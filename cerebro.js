/* cerebro.js - Simulated Chatbot Brain */
document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const quickTags = document.querySelectorAll('.quick-tag-btn');

    // Brain Database: Emilio's thoughts & reflections
    const brainData = {
        ia: {
            title: "Copilotos en el desarrollo de software",
            tag: "#IA",
            text: "La Inteligencia Artificial no va a reemplazar a los desarrolladores, sino a aquellos que no la utilicen. En mi día a día, la veo como un copiloto de ingeniería de primer nivel: le delego la sintaxis repetitiva, las estructuras estándar y las pruebas rápidas, lo que me permite liberar ancho de banda mental para concentrarme en lo que importa: la arquitectura, el diseño de la lógica de negocio y la experiencia de usuario final. Menos picar código, más diseñar soluciones pragmáticas.",
            date: "28 de Mayo, 2026",
            link: "https://emiliomoreno.com#sobre-mi"
        },
        tiempo: {
            title: "Atención vs Calendario",
            tag: "#GestiónDelTiempo",
            text: "Solemos obsesionarnos con la gestión del tiempo, cuando en realidad lo que debemos gestionar es la atención. De nada sirve tener un bloque de 3 horas reservado en tu Google Calendar si tu mente está dispersa o sobreestimulada por notificaciones. Crear whatstime.net nació precisamente de esa inquietud: la necesidad de crear un espacio digital minimalista para 'limpiar' la atención antes de enfocarse en tareas complejas.",
            date: "24 de Mayo, 2026",
            link: "https://whatstime.net"
        },
        decisiones: {
            title: "El verdadero peso de las opciones",
            tag: "#TomaDeDecisiones",
            text: "Cuando usas una lista de pros y contras para tomar una decisión (de ahí el concepto detrás de weigh-up.com), el error común es contar cuántos puntos hay en cada lado de la lista. En la realidad, las decisiones se toman por peso moral o estratégico. Un solo 'contra' con peso de importancia 5 (como comprometer tu salud, tus valores o el tiempo familiar) debe ganar por goleada a cinco 'pros' con peso de importancia 1. Ponderar con honestidad es el verdadero camino al crecimiento personal.",
            date: "20 de Mayo, 2026",
            link: "https://weigh-up.com"
        },
        podcast: {
            title: "La neurociencia detrás del enfoque",
            tag: "#Podcasts",
            text: "Hace poco escuché un episodio fascinante en un podcast sobre la neurociencia del enfoque. Explicaban cómo nuestro cerebro está programado evolutivamente para reaccionar a las interrupciones, y cómo las notificaciones móviles explotan esa debilidad. Mi consejo práctico: mantén el móvil en modo 'No molestar' permanentemente y deja solo llamadas de emergencia en tu lista de excepciones. El aumento en tu capacidad de concentración profunda en solo una semana te sorprenderá.",
            date: "15 de Mayo, 2026",
            link: "https://whatstime.net"
        }
    };

    // Chat Log Auto-scroll Helper
    function scrollToBottom() {
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Escape HTML to prevent injection
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Append Message to Log
    function appendMessage(sender, content, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isHtml) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }
        
        messageDiv.appendChild(bubble);
        chatLog.appendChild(messageDiv);
        scrollToBottom();
    }

    // Append Typing Indicator
    function showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        messageDiv.id = 'typing-indicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble typing-indicator';
        
        bubble.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        
        messageDiv.appendChild(bubble);
        chatLog.appendChild(messageDiv);
        scrollToBottom();
    }

    // Remove Typing Indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Send User Message & Process Reply
    function sendMessage() {
        const query = chatInput.value.trim();
        if (query === '') return;

        // Render User Message
        appendMessage('user', query);
        chatInput.value = '';

        // Simulate Bot thinking
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            const replyHtml = getBotResponse(query);
            appendMessage('bot', replyHtml, true);
        }, 1500); // 1.5s simulated delay
    }

    // Process Query and Return Custom HTML Reply
    function getBotResponse(query) {
        const q = query.toLowerCase();
        
        // Match Keywords
        let matchKey = null;

        if (q.includes('ia') || q.includes('inteligencia') || q.includes('artificial') || q.includes('desarroll') || q.includes('program') || q.includes('software') || q.includes('copiloto')) {
            matchKey = 'ia';
        } else if (q.includes('tiempo') || q.includes('whatstime') || q.includes('hora') || q.includes('atencion') || q.includes('mindfulness') || q.includes('concentra') || q.includes('enfoc')) {
            matchKey = 'tiempo';
        } else if (q.includes('decision') || q.includes('weigh-up') || q.includes('sopesar') || q.includes('contra') || q.includes('pro') || q.includes('peso') || q.includes('elegir') || q.includes('opcion')) {
            matchKey = 'decisiones';
        } else if (q.includes('podcast') || q.includes('escuchar') || q.includes('recomiend') || q.includes('notificac') || q.includes('movil')) {
            matchKey = 'podcast';
        }

        // If Keyword matches
        if (matchKey && brainData[matchKey]) {
            const data = brainData[matchKey];
            return `
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:1px; font-weight:700;">
                    Reflexión sobre ${data.tag} (${data.date})
                </div>
                <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-primary);">${data.title}</h4>
                <p style="color:var(--text-secondary); margin-bottom:1rem;">"${data.text}"</p>
                <a href="${data.link}" target="_blank" style="color:var(--color-primary); font-weight:600; text-decoration:none; font-size:0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">
                    Ver proyecto relacionado 
                    <svg style="width:14px; height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            `;
        }

        // Welcome / Greetings Match
        if (q.includes('hola') || q.includes('buenas') || q.includes('quien eres') || q.includes('ayuda') || q.includes('como funciona')) {
            return `
                <p style="margin-bottom:0.75rem;">¡Hola de nuevo! Soy el Gemelo Digital de Emilio.</p>
                <p style="color:var(--text-secondary);">
                    Puedes preguntarme directamente sobre cualquier tema del que Emilio tenga notas en su cartera, como la <strong>Inteligencia Artificial</strong>, la gestión de la <strong>atención y el tiempo</strong>, el peso de las <strong>decisiones</strong> o mis últimas recomendaciones de <strong>podcasts</strong>.
                </p>
            `;
        }

        // Fallback message
        return `
            <p style="margin-bottom:0.75rem;">No he encontrado apuntes específicos sobre eso en mi memoria.</p>
            <p style="color:var(--text-secondary); margin-bottom:0.75rem;">
                Por ahora, solo guardo reflexiones relacionadas con la tecnología, la IA, el tiempo y el crecimiento personal. Prueba a preguntarme sobre:
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Háblame de IA'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#IA</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Mindfulness y Tiempo'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Tiempo</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Balanza de Decisiones'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Decisiones</button>
            </div>
        `;
    }

    // Input listeners
    btnSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick Tags Click Handler
    quickTags.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.getAttribute('data-tag');
            if (brainData[tag]) {
                // Set input field
                chatInput.value = `Háblame de ${brainData[tag].tag}`;
                // Trigger send
                sendMessage();
            }
        });
    });
});
