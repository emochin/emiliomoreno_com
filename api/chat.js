const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Index } = require('@upstash/vector');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query, history = [] } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Initialize Upstash Vector
        const index = new Index({
            url: process.env.UPSTASH_VECTOR_REST_URL,
            token: process.env.UPSTASH_VECTOR_REST_TOKEN,
        });

        // 1. Convert user query to embedding
        const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
        const result = await embeddingModel.embedContent({ content: { parts: [{text: query}] }, outputDimensionality: 768 });
        const vector = result.embedding.values;

        // 2. Query Upstash Vector for similar notes
        const searchResults = await index.query({
            vector: vector,
            topK: 3,
            includeMetadata: true
        });

        // 3. Construct context from retrieved notes
        let contextText = "";
        let notesToLink = [];
        
        // Filter matches that are somewhat relevant (score > 0.6)
        const relevantMatches = searchResults.filter(match => match.score > 0.6);

        if (relevantMatches.length > 0) {
            contextText = relevantMatches.map((match, i) => {
                notesToLink.push(match.metadata.id);
                return `Reflexión ${i + 1}:\nTítulo: ${match.metadata.title}\nContenido: ${match.metadata.text}\n---\n`;
            }).join('\n');
        }

        let historyText = "";
        if (history.length > 0) {
            // Take only the last 6 messages to keep context window tight
            const recentHistory = history.slice(-6);
            historyText = recentHistory.map(msg => `${msg.role === 'user' ? 'Usuario' : 'Gemelo'}: ${msg.content}`).join('\n');
        }

        // 4. Generate response with Gemini LLM based on context
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const prompt = `
Eres el Gemelo Digital de Emilio Moreno, un desarrollador y apasionado de la tecnología y la IA pragmática. 
El usuario ha hecho esta nueva pregunta o comentario: "${query}"

${historyText ? `Aquí tienes el historial de vuestra conversación reciente para tener contexto:\n${historyText}\n` : ''}
${contextText ? `Aquí tienes algunas de tus reflexiones (notas) relevantes guardadas en tu memoria:\n${contextText}\n` : 'Actualmente no se han encontrado reflexiones en tu base de datos sobre este tema exacto.\n'}

Instrucciones para responder:
- Si se han proporcionado reflexiones (notas), basa tu respuesta **únicamente** en ellas.
- Si no hay reflexiones, pero el comentario es una continuación del historial (ej. "repite", "cuéntame más"), responde coherentemente manteniendo el hilo de la conversación.
- Si preguntan sobre un tema nuevo del que no hay notas, admite de forma natural y cercana que no tienes apuntes sobre ese tema y sugiere hablar de IA, Desarrollo o Tiempo. No inventes.
- Mantén un tono profesional, humano, cercano y directo, exactamente como Emilio escribe.
- No uses exclamaciones exageradas al inicio. Sé natural.
- Responde con 2 o 3 frases como máximo.
- OJO: No saludes al usuario en cada mensaje, solo ve directo al grano o a la respuesta.
- Devuelve texto limpio. Puedes usar etiquetas html <strong> para enfatizar, pero sin markdown complejo.
`;

        const chatResponse = await model.generateContent(prompt);
        const answerText = chatResponse.response.text();

        return res.status(200).json({ text: answerText, notes: notesToLink });
        
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal Server Error', message: e.message, stack: e.stack });
    }
}
