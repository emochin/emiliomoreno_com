const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Index } = require('@upstash/vector');
require('dotenv').config();

async function main() {
    if (!process.env.GEMINI_API_KEY || !process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
        console.error("Missing environment variables. Please check your .env file.");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const index = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });

    console.log("Reading reflections.json...");
    const dataPath = path.join(__dirname, '../data/reflections.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const reflections = JSON.parse(rawData);

    console.log(`Found ${reflections.length} reflections to ingest.`);

    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

    for (const note of reflections) {
        console.log(`Processing note: ${note.id}`);
        // Create embedding from title + text for better semantic matching
        const contentToEmbed = `Title: ${note.title}\nContent: ${note.text}`;
        
        try {
            const result = await embeddingModel.embedContent({ content: { parts: [{text: contentToEmbed}] }, outputDimensionality: 768 });
            const vector = result.embedding.values;

            // Upsert into Upstash Vector
            await index.upsert({
                id: note.id,
                vector: vector,
                metadata: {
                    id: note.id,
                    title: note.title,
                    text: note.text,
                    date: note.date
                }
            });
            console.log(`Successfully ingested: ${note.id}`);
        } catch (e) {
            console.error(`Error processing note ${note.id}:`, e);
        }
    }
    console.log("Done!");
}

main();
