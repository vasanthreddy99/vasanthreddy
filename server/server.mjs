import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
    key: process.env.OPENAI_API_KEY,
    engine: "text-davinci-003",
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', async (req, res) => {
    try {
        const userInput = req.body.userInput;

        const response = await openai.complete({
            prompt: userInput,
            temperature: 0,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.choices[0].text
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err });
    }
});

app.listen(5000, () => console.log('Server is running on http://localhost:5000'));
