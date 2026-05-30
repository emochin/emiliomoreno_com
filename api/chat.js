const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Index } = require('@upstash/vector');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query } = req.body;
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

            // 4. Generate response with Gemini LLM based on context
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
Eres el Gemelo Digital de Emilio Moreno, un desarrollador y apasionado de la tecnología y la IA pragmática. 
El usuario ha hecho esta pregunta: "${query}"

Aquí tienes algunas de tus reflexiones (notas) más relevantes guardadas en tu memoria:
${contextText}

Instrucciones para responder:
- Responde a la pregunta basándote **únicamente** en las reflexiones proporcionadas.
- Mantén un tono profesional, humano, cercano y directo, exactamente como Emilio escribe.
- No uses exclamaciones exageradas al inicio. Sé natural.
- Responde con 2 o 3 frases como máximo.
- Si no hay información suficiente en las reflexiones para responder, admite que no tienes apuntes concretos sobre ese tema en tu memoria. No inventes.
- OJO: No saludes al usuario en cada mensaje, solo ve directo al grano o a la respuesta.
- No uses Markdown complejo en tu respuesta. Puedes usar algo de bold <strong>, pero tu respuesta será inyectada en HTML. Devuelve texto limpio.
`;

            const chatResponse = await model.generateContent(prompt);
            const answerText = chatResponse.response.text();

            return res.status(200).json({ text: answerText, notes: notesToLink });
        } else {
            // Fallback response if no relevant notes found
            const fallbackHtml = `
            <p style="margin-bottom:0.5rem;">No tengo notas concretas sobre ese tema en mi memoria ahora mismo.</p>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">
                Si quieres, podemos explorar otras ideas. Por ejemplo:
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.4rem;">
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Estrategia LLM'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Modelos LLM</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Copilotos de IA'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Copilotos</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Reflexión sobre el tiempo'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Tiempo</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Balanza de Decisiones'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Decisiones</button>
            </div>
            `;
            return res.status(200).json({ replyHtml: fallbackHtml });
        }
        
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
