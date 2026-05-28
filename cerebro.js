/* cerebro.js - Simulated Chatbot Brain and Blog Feed */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const quickTags = document.querySelectorAll('.quick-tag-btn');
    const reflectionsFeedList = document.getElementById('reflections-feed-list');
    
    // Mobile Tabs Navigation
    const mobileTabButtons = document.querySelectorAll('.mobile-tab-btn');
    const columnFeed = document.getElementById('column-feed');
    const columnChat = document.getElementById('column-chat');

    // Layout Switcher & Floating Chat Elements
    const btnLayoutSplit = document.getElementById('btn-layout-split');
    const btnLayoutBlog = document.getElementById('btn-layout-blog');
    const floatingChatFab = document.getElementById('floating-chat-fab');
    const chatCloseBtn = document.getElementById('chat-close-btn');

    // Brain Database: Emilio's thoughts & reflections (Chronological Array)
    const reflections = [
        {
            id: "estrategia-ia",
            date: "2026-05-28",
            title: "Criterios de elección y arquitectura para LLMs",
            tag: "#IA",
            text: "Al integrar modelos de lenguaje (LLMs), la elección del modelo y la arquitectura de soporte son decisiones críticas. No siempre se requiere el modelo comercial más potente; a veces, modelos de código abierto locales o especializados ofrecen mayor control de privacidad, menor latencia y menor coste. Arquitectónicamente, la clave está en desacoplar la aplicación del modelo concreto mediante capas de abstracción y optimizar el contexto (RAG) en lugar de intentar reentrenar modelos de forma innecesaria.",
            source: "LinkedIn (Milko C.)",
            sourceUrl: "https://www.linkedin.com/posts/milkocc_estrategiaia-modelosdelenguaje-transformaciaejndigital-share-7463302192670859265-DAyu/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAForToBmuOb9IOAkN9w-5u2wvgTIv2Z3pc",
            link: "https://www.linkedin.com/posts/milkocc_estrategiaia-modelosdelenguaje-transformaciaejndigital-share-7463302192670859265-DAyu/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAForToBmuOb9IOAkN9w-5u2wvgTIv2Z3pc",
            linkLabel: "Ver en LinkedIn"
        },
        {
            id: "ia",
            date: "2026-05-28",
            title: "Copilotos en el desarrollo de software",
            tag: "#IA",
            text: "La Inteligencia Artificial no va a reemplazar a los desarrolladores, sino a aquellos que no la utilicen. En mi día a día, la veo como un copiloto de ingeniería de primer nivel: le delego la sintaxis repetitiva, las estructuras estándar y las pruebas rápidas, lo que me permite liberar ancho de banda mental para concentrarme en lo que importa: la arquitectura, el diseño de la lógica de negocio y la experiencia de usuario final. Menos picar código, más diseñar soluciones pragmáticas.",
            source: "LinkedIn",
            sourceUrl: "https://www.linkedin.com/in/emiliomorenochinchilla",
            link: "https://emiliomoreno.com#sobre-mi",
            linkLabel: "Ver mi perfil"
        },
        {
            id: "tiempo",
            date: "2026-05-24",
            title: "Atención vs Calendario",
            tag: "#Tiempo",
            text: "Solemos obsesionarnos con la gestión del tiempo, cuando en realidad lo que debemos gestionar es la atención. De nada sirve tener un bloque de 3 horas reservado en tu Google Calendar si tu mente está dispersa o sobreestimulada por notificaciones. Crear whatstime.net nació precisamente de esa inquietud: la necesidad de crear un espacio digital minimalista para 'limpiar' la atención antes de enfocarse en tareas complejas.",
            source: "whatstime.net",
            link: "https://whatstime.net",
            linkLabel: "Visitar whatstime.net"
        },
        {
            id: "decisiones",
            date: "2026-05-20",
            title: "El verdadero peso de las opciones",
            tag: "#Decisiones",
            text: "Cuando usas una lista de pros y contras para tomar una decisión (de ahí el concepto detrás de weigh-up.com), el error común es contar cuántos puntos hay en cada lado de la lista. En la realidad, las decisiones se toman por peso moral o estratégico. Un solo 'contra' con peso de importancia 5 (como comprometer tu salud, tus valores o el tiempo familiar) debe ganar por goleada a cinco 'pros' con peso de importancia 1. Ponderar con honestidad es el verdadero camino al crecimiento personal.",
            source: "weigh-up.com",
            link: "https://weigh-up.com",
            linkLabel: "Visitar weigh-up.com"
        },
        {
            id: "podcast",
            date: "2026-05-15",
            title: "La neurociencia detrás del enfoque",
            tag: "#Podcasts",
            text: "Hace poco escuché un episodio fascinante en un podcast sobre la neurociencia del enfoque. Explicaban cómo nuestro cerebro está programado evolutivamente para reaccionar a las interrupciones, y cómo las notificaciones móviles explotan esa debilidad. Mi consejo práctico: mantén el móvil en modo 'No molestar' permanentemente y deja solo llamadas de emergencia en tu lista de excepciones. El aumento en tu capacidad de concentración profunda en solo una semana te sorprenderá.",
            source: "Spotify",
            sourceUrl: "https://open.spotify.com/show/79CkJv3rnGaqNHJbHQf328",
            link: "https://whatstime.net",
            linkLabel: "Ver whatstime.net"
        }
    ];

    // Helper: Map ID key to reflection object
    const brainMap = reflections.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
    }, {});

    // --- Tag Filtering Logic State ---
    let currentTagFilter = null;

    // Event delegation for tag clicks inside reflectionsFeedList
    reflectionsFeedList.addEventListener('click', (e) => {
        const tagElement = e.target.closest('.blog-card-tag');
        if (tagElement) {
            const tagText = tagElement.textContent.trim();
            filterByTag(tagText);
        }
    });

    function filterByTag(tag) {
        currentTagFilter = tag;
        renderBlogFeed();
        // Smooth scroll to top of feed column
        columnFeed.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Render Blog Feed (Chronological, Newest First) ---
    function renderBlogFeed() {
        reflectionsFeedList.innerHTML = '';
        
        // Sort chronologically (just in case the array isn't ordered)
        const sortedReflections = [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter reflections if a tag filter is active
        let displayReflections = sortedReflections;
        if (currentTagFilter) {
            displayReflections = sortedReflections.filter(note => note.tag.toLowerCase() === currentTagFilter.toLowerCase());

            // Create and append the filter status bar at the top of the feed
            const filterBar = document.createElement('div');
            filterBar.className = 'filter-status-bar';
            filterBar.innerHTML = `
                <span>Filtrado por: <strong>${currentTagFilter}</strong> (${displayReflections.length} ${displayReflections.length === 1 ? 'nota' : 'notas'})</span>
                <button class="clear-filter-btn" id="btn-clear-filter">Ver todas</button>
            `;
            reflectionsFeedList.appendChild(filterBar);

            // Add clear filter event listener
            filterBar.querySelector('#btn-clear-filter').addEventListener('click', () => {
                currentTagFilter = null;
                renderBlogFeed();
            });
        }

        displayReflections.forEach((note) => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            const targetUrl = note.sourceUrl || note.link;
            card.innerHTML = `
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        ${formatDate(note.date)} — 
                        ${targetUrl ? `vía <a href="${targetUrl}" target="_blank" rel="noopener" class="blog-card-source-link">${note.source} <svg class="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : `vía ${note.source}`}
                    </span>
                    <span class="blog-card-tag" title="Filtrar por esta etiqueta">${note.tag}</span>
                </div>
                <h3 class="blog-card-title">${note.title}</h3>
                <p class="blog-card-text">"${note.text}"</p>
            `;
            reflectionsFeedList.appendChild(card);
        });
    }

    // Helper: Format Date String
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', options);
    }

    // --- Layout Switching Logic ---
    function setLayoutMode(mode) {
        if (mode === 'blog') {
            document.body.classList.add('layout-mode-blog-active');
            btnLayoutBlog.classList.add('active');
            btnLayoutSplit.classList.remove('active');
            localStorage.setItem('cerebro-layout-preference', 'blog');
            
            // Ensure the chat is closed initially when entering blog mode
            columnChat.classList.remove('floating-open');
            floatingChatFab.classList.remove('fab-hidden');
            
            // On mobile, ensure the blog feed column is visible in blog mode
            columnFeed.classList.add('active');
        } else {
            document.body.classList.remove('layout-mode-blog-active');
            btnLayoutSplit.classList.add('active');
            btnLayoutBlog.classList.remove('active');
            localStorage.setItem('cerebro-layout-preference', 'split');
            
            // In split mode, default to displaying whatever mobile tab is active
            const activeTab = document.querySelector('.mobile-tab-btn.active');
            if (activeTab) {
                const tabTarget = activeTab.getAttribute('data-tab');
                if (tabTarget === 'feed') {
                    columnFeed.classList.add('active');
                    columnChat.classList.remove('active');
                } else {
                    columnChat.classList.add('active');
                    columnFeed.classList.remove('active');
                }
            }
        }
    }

    if (btnLayoutSplit && btnLayoutBlog) {
        btnLayoutSplit.addEventListener('click', () => setLayoutMode('split'));
        btnLayoutBlog.addEventListener('click', () => setLayoutMode('blog'));
    }

    // --- Floating Chat Control (FAB + Close) ---
    if (floatingChatFab && chatCloseBtn) {
        floatingChatFab.addEventListener('click', () => {
            columnChat.classList.add('floating-open');
            floatingChatFab.classList.add('fab-hidden');
            // Allow DOM to adjust before scrolling
            setTimeout(scrollToBottom, 50);
        });

        chatCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            columnChat.classList.remove('floating-open');
            floatingChatFab.classList.remove('fab-hidden');
        });
    }

    // --- Mobile Tabs switching logic (only used in Dual View) ---
    mobileTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons
            mobileTabButtons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const tabTarget = btn.getAttribute('data-tab');
            if (tabTarget === 'feed') {
                columnFeed.classList.add('active');
                columnChat.classList.remove('active');
            } else {
                columnChat.classList.add('active');
                columnFeed.classList.remove('active');
            }
        });
    });

    // --- Chatbot Functionality ---
    function scrollToBottom() {
        chatLog.scrollTop = chatLog.scrollHeight;
    }

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

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

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
        }, 1200); // 1.2s delay for snappy response
    }

    function getBotResponse(query) {
        const q = query.toLowerCase();
        let matchTopic = null;
        let summaryText = "";
        let notesToLink = [];

        // Topic and Keyword checking
        if (q.includes('estrategia') || q.includes('transformac') || q.includes('negocio') || q.includes('modelo') || q.includes('llm') || q.includes('empresa') || q.includes('organiza') || q.includes('arquitectura') || q.includes('rag')) {
            matchTopic = 'estrategia-ia';
            summaryText = "Cuando pienso en **arquitectura y selección de modelos de lenguaje (LLMs)**, mi postura es clara: no hay que usar por defecto el modelo comercial más potente. Diseño capas de abstracción para no depender de un único proveedor, y optimizo el contexto mediante técnicas como RAG, evaluando modelos locales o especializados de código abierto para reducir costes, latencia y mejorar la privacidad.";
            notesToLink = ['estrategia-ia'];
        } else if (q.includes('copiloto') || q.includes('desarrolla') || q.includes('program') || q.includes('código') || q.includes('sintaxis') || q.includes('ingeniería')) {
            matchTopic = 'desarrollo-ia';
            summaryText = "Sobre el **desarrollo y copilotos de IA**, soy bastante pragmático: uso las herramientas de IA como asistentes de ingeniería de primer nivel. Mi enfoque es delegar la sintaxis repetitiva, tareas mecánicas y pruebas rápidas a la IA, y así liberar ancho de banda mental para concentrarme en lo estratégico: la arquitectura del software y el diseño lógico.";
            notesToLink = ['ia'];
        } else if (q.includes('ia') || q.includes('inteligencia') || q.includes('artificial')) {
            matchTopic = 'general-ia';
            summaryText = "Tengo una visión muy pragmática sobre la **Inteligencia Artificial**: la uso como copiloto en el día a día para delegar tareas mecánicas, y aplico criterios de arquitectura flexibles y eficientes al integrar modelos (LLMs), priorizando modelos locales y técnicas de contexto (RAG) en lugar de soluciones sobredimensionadas.";
            notesToLink = ['estrategia-ia', 'ia'];
        } else if (q.includes('tiempo') || q.includes('whatstime') || q.includes('atencion') || q.includes('mindfulness') || q.includes('concentra') || q.includes('enfoque')) {
            matchTopic = 'tiempo';
            summaryText = "Para mí, lo verdaderamente importante no es gestionar el tiempo, sino la **gestión de la atención**. Vivimos rodeados de distracciones diseñadas para capturar nuestro enfoque. Por eso creé `whatstime.net`: un espacio digital minimalista para 'limpiar' la atención antes de realizar tareas complejas.";
            notesToLink = ['tiempo'];
        } else if (q.includes('decision') || q.includes('weigh-up') || q.includes('sopesar') || q.includes('opcion') || q.includes('peso') || q.includes('equilibrio')) {
            matchTopic = 'decisiones';
            summaryText = "Para la **toma de decisiones**, no se trata de contar la cantidad de pros y contras. Lo que importa es el *peso moral o estratégico* de cada punto. Un solo contra con mucho peso —como comprometer mi salud o tiempo familiar— debe imponerse sobre múltiples pros menores. De este concepto nació mi herramienta interactiva `weigh-up.com`.";
            notesToLink = ['decisiones'];
        } else if (q.includes('podcast') || q.includes('escuchar') || q.includes('recomiend') || q.includes('notificac') || q.includes('movil') || q.includes('spotify') || q.includes('neurociencia')) {
            matchTopic = 'podcast';
            summaryText = "Me inspiro mucho en **podcasts de neurociencia** y recomiendo proteger el enfoque de forma activa. Mi consejo más práctico: desactiva por completo las notificaciones del móvil, manénlo en modo 'No molestar' permanentemente y configura solo excepciones de llamadas de emergencia. El aumento en tu capacidad de concentración profunda en una semana te sorprenderá.";
            notesToLink = ['podcast'];
        }

        // Return matched response with summaries and note links
        if (matchTopic && notesToLink.length > 0) {
            let replyHtml = `<p style="margin-bottom:0.75rem; font-size:0.92rem; line-height:1.5; color:var(--text-primary);">${summaryText}</p>`;
            replyHtml += `<div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; border-top: 1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; margin-bottom:0.4rem; letter-spacing:0.5px;">Mis notas asociadas:</div>`;
            
            notesToLink.forEach(id => {
                const note = brainMap[id];
                if (note) {
                    const targetUrl = note.sourceUrl || note.link;
                    replyHtml += `
                        <div style="background:rgba(255, 255, 255, 0.02); border:1px solid var(--border-color); border-radius:12px; padding:0.75rem; margin-bottom:0.5rem; text-align:left;">
                            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.25rem;">
                                <span>${formatDate(note.date)}</span>
                                ${targetUrl ? `<a href="${targetUrl}" target="_blank" rel="noopener" style="color:var(--color-primary); text-decoration:none; display:inline-flex; align-items:center; gap:0.15rem; font-weight:700;">vía ${note.source} <svg style="width:9px; height:9px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : `<span>vía ${note.source}</span>`}
                            </div>
                            <h5 style="font-size:0.82rem; font-weight:700; margin-bottom:0.25rem; color:var(--text-primary);"><a href="${targetUrl}" target="_blank" rel="noopener" style="color:inherit; text-decoration:none;">${note.title}</a></h5>

                        </div>
                    `;
                }
            });
            return replyHtml;
        }

        // Greetings
        if (q.includes('hola') || q.includes('buenas') || q.includes('quien eres') || q.includes('ayuda') || q.includes('saludo')) {
            return `
                    <p style="margin-bottom:0.5rem;">¡Hola! Soy Emilio, y este es mi Cerebro Digital.</p>
                    <p style="color:var(--text-secondary);">
                        Puedo buscar entre mis reflexiones del feed de la izquierda y responder a tus preguntas sobre <strong>Inteligencia Artificial</strong>, <strong>atención y tiempo</strong>, <strong>toma de decisiones</strong> o <strong>podcasts</strong>.
                    </p>`;
        }

        // Fallback
        return `
            <p style="margin-bottom:0.5rem;">No tengo apuntes específicos en mi memoria para esa consulta.</p>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">
                Prueba a preguntarme sobre:
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.4rem;">
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Estrategia LLM'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Modelos LLM</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Copilotos de IA'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Copilotos</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Reflexión sobre el tiempo'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Tiempo</button>
                <button class="quick-tag-btn" onclick="document.getElementById('chat-input').value = 'Balanza de Decisiones'; document.getElementById('btn-send').click();" style="font-size:0.75rem;">#Decisiones</button>
            </div>
        `;
    }

    // Chat Listeners
    btnSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Quick Tags Click
    quickTags.forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.getAttribute('data-tag');
            let queryText = "";
            if (tag === "ia") queryText = "Inteligencia Artificial";
            else if (tag === "tiempo") queryText = "Reflexión sobre el tiempo";
            else if (tag === "decisiones") queryText = "Toma de decisiones";
            else if (tag === "podcast") queryText = "Recomiéndame un podcast";
            
            if (queryText) {
                chatInput.value = queryText;
                sendMessage();
            }
        });
    });

    // Initial Execution on Load
    renderBlogFeed();

    // Initialize Layout from Preference
    const savedLayout = localStorage.getItem('cerebro-layout-preference') || 'split';
    setLayoutMode(savedLayout);
});
