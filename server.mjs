import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from 'openai';
import * as db from './database.js';
import path from 'path';


dotenv.config();

const openai = new OpenAI({
    key: process.env.OPENAI_API_KEY,
    engine: "text-davinci-003",
});

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
app.use(bodyParser.json());
app.use(express.static(path.join(new URL('.', import.meta.url).pathname, 'public')));




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});

app.post('/', async (req, res) => {
    try {
        const userInput = req.body.userInput;

        const response = await openai.chat.completions.create({ 
            model: "gpt-3.5-turbo", 
            messages: [{ role: "user", content: userInput }],
            temperature: 0,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.choices[0].message.content 
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err });
    }
});











// API endpoint to fetch distinct years
app.get('/api/years', async (req, res) => {
    try {
        const years = await db.getDistinctYears();
        res.json(years);
    } catch (error) {
        console.error('Error fetching years:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to fetch semesters based on the selected year
app.post('/api/semesters', async (req, res) => {
    const { year } = req.body;
    try {
        const semesters = await db.getDistinctSemesters(year);
        res.json(semesters);
    } catch (error) {
        console.error('Error fetching semesters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to fetch subjects based on the selected year and semester
app.post('/api/subjects', async (req, res) => {
    const { year, semester } = req.body;
    try {
        const subjects = await db.getDistinctSubjects(year, semester);
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to fetch and display notes based on the selected year, semester, and subject
app.post('/api/notes', async (req, res) => {
    const { year, semester, subject } = req.body;
    try {
        const notes = await db.getNotes(year, semester, subject);
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to serve PDF files
app.get('/api/pdf/:subject', async (req, res) => {
    const { subject } = req.params;
    try {
        const pdfPath = await db.getPdfPathBySubject(subject);
        
        // Construct an absolute path to the PDF file
        const absolutePath = path.resolve(new URL('../public', import.meta.url).pathname, pdfPath);


        // Send the file with the correct absolute path
        res.sendFile(absolutePath);
    } catch (error) {
        console.error('Error serving PDF file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(5000, () => console.log('Server is running on http://localhost:5000'));
