import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_LETTERS } from './src/data/initialLetters.js';
import { Letter } from './src/types.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc, query, orderBy, limit, writeBatch } from 'firebase/firestore';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(currentDir, 'firebase-applet-config.json'), 'utf8'));

// Initialize Firebase Client SDK
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Seed initial letters if Firestore is empty
async function seedDatabase() {
  try {
    const lettersCol = collection(db, 'letters');
    const q = query(lettersCol, limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('Seeding initial letters to Firestore...');
      const batch = writeBatch(db);
      INITIAL_LETTERS.forEach((letter) => {
        const ref = doc(db, 'letters', letter.id);
        batch.set(ref, letter);
      });
      await batch.commit();
      console.log('Seed complete.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
seedDatabase();

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. AI fallback will use structured compassionate templates if API key is not supplied.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// GET /api/letters - Fetch community letters with optional filtering
app.get('/api/letters', async (req, res) => {
  try {
    const { feeling, topic, targetAge, source, search } = req.query;

    const lettersCol = collection(db, 'letters');
    const q = query(lettersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let filtered: Letter[] = [];
    snapshot.forEach((docSnap) => {
      filtered.push(docSnap.data() as Letter);
    });

    if (feeling && feeling !== 'All') {
      filtered = filtered.filter((l) => l.feeling.toLowerCase().includes(String(feeling).toLowerCase()));
    }

    if (topic && topic !== 'All') {
      filtered = filtered.filter((l) =>
        l.topics.some((t) => t.toLowerCase() === String(topic).toLowerCase())
      );
    }

    if (targetAge && targetAge !== 'All') {
      filtered = filtered.filter(
        (l) => l.targetAge.toLowerCase() === String(targetAge).toLowerCase() || l.targetAge === 'All'
      );
    }

    if (source && source !== 'All') {
      if (source === 'human') filtered = filtered.filter((l) => !l.isAI);
      if (source === 'ai') filtered = filtered.filter((l) => l.isAI);
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.content.toLowerCase().includes(q) ||
          (l.lifeLesson && l.lifeLesson.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, letters: filtered, total: filtered.length });
  } catch (error) {
    console.error('Error fetching letters:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch letters' });
  }
});

// GET /api/letters/random - Get one random letter
app.get('/api/letters/random', async (req, res) => {
  try {
    const lettersCol = collection(db, 'letters');
    const snapshot = await getDocs(lettersCol);
    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'No letters available' });
    }
    const docsList = snapshot.docs;
    const randomIndex = Math.floor(Math.random() * docsList.length);
    res.json({ success: true, letter: docsList[randomIndex].data() as Letter });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving random letter', error: error?.message || String(error) });
  }
});

// POST /api/letters/react - React to a letter
app.post('/api/letters/react', async (req, res) => {
  try {
    const { letterId, reactionType } = req.body;
    
    const letterRef = doc(db, 'letters', letterId);
    const docSnap = await getDoc(letterRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ success: false, message: 'Letter not found' });
    }

    const letterData = docSnap.data() as Letter;
    const reactions = letterData.reactions || { neededThis: 0, feltUnderstood: 0, beautiful: 0, hopeful: 0, madeMeSmile: 0 };
    
    const key = reactionType as keyof typeof reactions;
    if (key && typeof reactions[key] === 'number') {
      reactions[key] += 1;
    } else if (key) {
      reactions[key] = 1;
    }

    await updateDoc(letterRef, { reactions });

    res.json({ success: true, reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record reaction' });
  }
});

// POST /api/generate-letter - AI Generation for personalized future self or matching perspective
app.post('/api/generate-letter', async (req, res) => {
  const { currentAge, perspective, feeling, topics, userContext } = req.body;

  const targetTopics = Array.isArray(topics) ? topics.join(', ') : topics || 'Life & Hope';
  const age = currentAge || 18;
  const pers = perspective || 'Future Me';
  const feel = feeling || 'Give me hope';

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = getAIClient();
      const prompt = `Write a deeply moving, empathetic, comforting letter for a web application called "Letters Beyond Time".
The recipient is currently ${age} years old.
Perspective requested: "${pers}" (e.g. Future Self writing back to younger self, or an older compassionate person).
The recipient asked for this feeling: "${feel}".
Topics requested: ${targetTopics}.
Additional context from recipient: "${userContext || 'None provided'}".

Requirements:
1. The letter must feel authentic, personal, timeless, and deeply encouraging.
2. It must NOT sound like generic AI corporate fluff. Write like a real person writing a warm handwritten letter on stationery paper.
3. Structure:
   - A heartwarming, poetic title
   - Main letter content (3 to 5 realistic paragraphs)
   - A short key life lesson / takeaway quote
   - A realistic fictional location (e.g. "Seattle, Washington", "Edinburgh, Scotland", "Future, Age ${Number(age) + 20}")
4. Do NOT use clichés like "supercharge" or robotic AI jargon.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Title of the letter' },
              content: { type: Type.STRING, description: 'The main body of the letter with newline breaks' },
              lifeLesson: { type: Type.STRING, description: 'A 1-sentence key life lesson or takeaway' },
              location: { type: Type.STRING, description: 'Imagined location or future age timestamp' },
            },
            required: ['title', 'content', 'lifeLesson'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        const generatedLetter: Letter = {
          id: `ai-letter-${Date.now()}`,
          authorAge: pers.includes('70') ? 70 : pers.includes('40') ? 40 : pers.includes('25') ? 25 : Number(age) + 15,
          targetAge: String(age),
          senderPerspective: pers,
          feeling: feel,
          topics: Array.isArray(topics) ? topics : [topics],
          title: parsed.title || 'A Letter Written Across Time',
          content: parsed.content || 'Take a soft breath. You are going to make it through.',
          lifeLesson: parsed.lifeLesson || 'Every storm eventually runs out of rain.',
          isAI: true,
          createdAt: new Date().toISOString(),
          reactions: { neededThis: 1, feltUnderstood: 1, beautiful: 1, hopeful: 1, madeMeSmile: 1 },
          location: parsed.location || 'Beyond Time',
          waxSealColor: '#d4a359',
        };

        // Add to community letters database so others can read
        await setDoc(doc(db, 'letters', generatedLetter.id), generatedLetter);

        return res.json({ success: true, letter: generatedLetter });
      }
    }
  } catch (err) {
    console.error('Gemini API letter generation error:', err);
  }

  // Fallback if API key unavailable or failed
  const fallbackLetter: Letter = {
    id: `ai-fallback-${Date.now()}`,
    authorAge: Number(age) + 15,
    targetAge: String(age),
    senderPerspective: pers,
    feeling: feel,
    topics: Array.isArray(topics) ? topics : [topics],
    title: `Words for Your ${age}-Year-Old Self`,
    content: `Dear friend,\n\nI am writing to you from a place further down the path. I know that right now, carrying ${targetTopics} feels heavy on your shoulders, and you wonder if you are taking the right steps.\n\nPlease know that every uncertainty you are navigating right now is quietly building the wisdom and resilience you will treasure years from now. Take a deep breath, go easy on yourself today, and remember that you don't need to have everything figured out all at once.\n\nKeep walking forward with a gentle heart. The future is brighter than you can see right now.`,
    lifeLesson: 'You are growing stronger in the places that feel fragile today.',
    isAI: true,
    createdAt: new Date().toISOString(),
    reactions: { neededThis: 5, feltUnderstood: 3, beautiful: 4, hopeful: 6, madeMeSmile: 2 },
    location: 'Future Perspective',
    waxSealColor: '#d4a359',
  };

  await setDoc(doc(db, 'letters', fallbackLetter.id), fallbackLetter);
  return res.json({ success: true, letter: fallbackLetter });
});

// POST /api/submit-letter - Moderate and submit community letter
app.post('/api/submit-letter', async (req, res) => {
  const { currentAge, targetAge, feeling, topics, title, lifeLesson, content, isAnonymous } = req.body;

  if (!content || content.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'Letter content must be at least 20 characters long.' });
  }

  // AI Moderation check
  let isApproved = true;
  let reason = '';

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = getAIClient();
      const modPrompt = `Analyze the following user letter submission for a public kindness app. 
Verify if it contains any severe toxicity, hate speech, explicit sexual violence, harassment, or self-harm encouragement.
Content: "${title || ''} - ${content}".
Respond ONLY in JSON with format: { "approved": boolean, "reason": "string" }`;

      const modResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: modPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
            },
            required: ['approved'],
          },
        },
      });

      if (modResponse.text) {
        const parsed = JSON.parse(modResponse.text.trim());
        isApproved = parsed.approved;
        reason = parsed.reason || '';
      }
    }
  } catch (err) {
    console.error('Moderation check error:', err);
  }

  if (!isApproved) {
    return res.status(400).json({
      success: false,
      message: 'Your letter could not be published because it flagged our community kindness & safety guidelines.',
      reason,
    });
  }

  const newLetter: Letter = {
    id: `user-letter-${Date.now()}`,
    authorAge: Number(currentAge) || 20,
    targetAge: targetAge || 'Any',
    senderPerspective: isAnonymous ? `Someone who was ${currentAge}` : `A ${currentAge}-year-old traveler`,
    feeling: feeling || 'Give me hope',
    topics: Array.isArray(topics) && topics.length > 0 ? topics : ['Growing up'],
    title: title || 'A Gift of Experience',
    content,
    lifeLesson: lifeLesson || undefined,
    isAI: false,
    createdAt: new Date().toISOString(),
    reactions: { neededThis: 1, feltUnderstood: 1, beautiful: 1, hopeful: 1, madeMeSmile: 1 },
    location: 'Community Contributor',
    waxSealColor: '#3b5e4a',
  };

  await setDoc(doc(db, 'letters', newLetter.id), newLetter);

  res.json({ success: true, message: 'Your letter has been published to the community!', letter: newLetter });
});

// GET /api/daily-letter - Fetch or generate daily letter
app.get('/api/daily-letter', async (req, res) => {
  try {
    const lettersCol = collection(db, 'letters');
    const q = query(lettersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'No letters available' });
    }
    const docsList = snapshot.docs;
    const todayIndex = new Date().getDate() % docsList.length;
    res.json({ success: true, letter: docsList[todayIndex].data() as Letter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving daily letter' });
  }
});

// Vite / Production setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Letters Beyond Time server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
