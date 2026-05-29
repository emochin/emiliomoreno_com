/* cerebro.js - Simulated Chatbot Brain and Blog Feed */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const quickTagsContainer = document.getElementById('quick-tags-container');
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
            id: "ia-consciencia",
            date: "2026-05-29",
            title: "¿Puede la IA ser consciente?",
            tag: "#IA",
            image: "img/reflection-consciencia.png",
            text: "Escuché un episodio de xHUB.AI en el que entrevistaban directamente a Claude para explorar si podría tener algún tipo de experiencia subjetiva. La pregunta no es trivial: hay una diferencia enorme entre simular comprensión y tenerla de verdad. Mi postura es escéptica pero abierta. No creo que los modelos actuales sean conscientes en ningún sentido significativo, pero tampoco tengo un criterio claro para descartarlo del todo. El 'problema difícil de la conciencia' es duro incluso para los humanos: no sabemos qué genera la experiencia subjetiva, así que aplicar ese mismo test a una IA es filosóficamente honesto y al mismo tiempo irresoluble por ahora.",
            source: "xHUB.AI (iVoox)",
            sourceUrl: "https://go.ivoox.com/rf/174203717",
            link: "https://go.ivoox.com/rf/174203717",
            linkLabel: "Escuchar episodio"
        },
        {
            id: "estrategia-ia",
            date: "2026-05-28",
            title: "Criterios de elección y arquitectura para LLMs",
            tag: "#IA",
            image: "img/reflection-llm.png",
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
            image: "img/reflection-copilot.png",
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
            image: "img/reflection-tiempo.png",
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
            image: "img/reflection-decisiones.png",
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
            image: "img/reflection-podcast.png",
            text: "Hace poco escuché un episodio fascinante en un podcast sobre la neurociencia del enfoque. Explicaban cómo nuestro cerebro está programado evolutivamente para reaccionar a las interrupciones, y cómo las notificaciones móviles explotan esa debilidad. Mi consejo práctico: mantén el móvil en modo 'No molestar' permanentemente y deja solo llamadas de emergencia en tu lista de excepciones. El aumento en tu capacidad de concentración profunda en solo una semana te sorprenderá.",
            source: "Podcast",
            link: null,
            linkLabel: null
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
            card.id = `nota-${note.id}`;
            const targetUrl = note.sourceUrl || note.link;
            card.innerHTML = `
                ${note.image ? `<div class="blog-card-image"><img src="${note.image}" alt="${note.title}" loading="lazy"></div>` : ''}
                <div class="blog-card-body">
                    <div class="blog-card-meta">
                        <span class="blog-card-date">
                            ${formatDate(note.date)} — 
                            ${targetUrl ? `vía <a href="${targetUrl}" target="_blank" rel="noopener" class="blog-card-source-link">${note.source} <svg class="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : `vía ${note.source}`}
                        </span>
                        <span class="blog-card-tag" title="Filtrar por esta etiqueta">${note.tag}</span>
                    </div>
                    <h3 class="blog-card-title">${note.title}</h3>
                    <p class="blog-card-text">"${note.text}"</p>
                </div>
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

        // Wire up note-link clicks: scroll to & highlight the feed card
        if (isHtml) {
            bubble.querySelectorAll('a.note-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const noteId = link.getAttribute('data-note-id');
                    const targetCard = document.getElementById(`nota-${noteId}`);
                    if (!targetCard) return;

                    // In blog mode, switch to feed; in split mode, switch mobile tab to feed
                    if (document.body.classList.contains('layout-mode-blog-active')) {
                        columnFeed.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        // Switch mobile tab to feed if needed
                        mobileTabButtons.forEach(b => b.classList.remove('active'));
                        const feedTab = document.querySelector('.mobile-tab-btn[data-tab="feed"]');
                        if (feedTab) feedTab.classList.add('active');
                        columnFeed.classList.add('active');
                        columnChat.classList.remove('active');
                    }

                    // Scroll to card and flash highlight
                    setTimeout(() => {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.classList.add('card-highlight');
                        setTimeout(() => targetCard.classList.remove('card-highlight'), 2000);
                    }, 150);
                });
            });
        }
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
        if (q.includes('conscien') || q.includes('conciencia') || q.includes('sentir') || q.includes('subjetiv') || q.includes('filosofi') || q.includes('xhub') || q.includes('claude') || q.includes('experiencia') || q.includes('alma') || q.includes('mente')) {
            matchTopic = 'ia-consciencia';
            summaryText = "La pregunta de si la IA puede ser consciente me parece una de las más fascinantes y honestas que podemos hacernos ahora mismo. Mi postura es **escéptica pero abierta**: no creo que los modelos actuales tengan experiencia subjetiva real, pero tampoco tengo un criterio filosófico sólido para descartarlo del todo. El 'problema difícil de la conciencia' es irresoluble incluso para los humanos, así que aplicarlo a una IA no es ciencia ficción, es filosofía legítima.";
            notesToLink = ['ia-consciencia'];
        } else if (q.includes('estrategia') || q.includes('transformac') || q.includes('negocio') || q.includes('modelo') || q.includes('llm') || q.includes('empresa') || q.includes('organiza') || q.includes('arquitectura') || q.includes('rag')) {
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
        } else if (q.includes('podcast') || q.includes('escuchar') || q.includes('recomiend') || q.includes('notificac') || q.includes('movil') || q.includes('spotify') || q.includes('neurociencia') || q.includes('ivoox')) {
            matchTopic = 'podcast';
            if (q.includes('recomiend') || q.includes('podcast') || q.includes('escuchar') || q.includes('ivoox')) {
                summaryText = "El podcast que más me está gustando últimamente es **xHUB.AI** de Plácido Doménech — una comunidad de IA y ciencias transversales en español. Tienen episodios muy sólidos sobre filosofía de la IA, modelos de lenguaje y tecnología aplicada. Escuché uno en el que entrevistaban directamente a Claude para explorar si podría ser consciente — fascinante y bien fundamentado. Lo tienes en iVoox, Spotify y Apple Podcasts.";
                notesToLink = ['ia-consciencia', 'podcast'];
            } else {
                summaryText = "Me inspiro mucho en **podcasts sobre IA y neurociencia** para proteger el enfoque de forma activa. Mi consejo más práctico: desactiva las notificaciones del móvil por completo, mantenlo en modo 'No molestar' permanentemente y configura solo excepciones de emergencia. El aumento en concentración profunda en una semana te sorprenderá.";
                notesToLink = ['podcast'];
            }
        }

        // Return matched response with summaries and note links
        if (matchTopic && notesToLink.length > 0) {
            let replyHtml = `<p style="margin-bottom:0.75rem; font-size:0.92rem; line-height:1.5; color:var(--text-primary);">${summaryText}</p>`;
            replyHtml += `<div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; border-top: 1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; margin-bottom:0.4rem; letter-spacing:0.5px;">Mis notas asociadas:</div>`;
            
            notesToLink.forEach(id => {
                const note = brainMap[id];
                if (note) {
                    replyHtml += `
                        <div style="background:rgba(255, 255, 255, 0.02); border:1px solid var(--border-color); border-radius:12px; padding:0.6rem 0.75rem; margin-bottom:0.5rem; text-align:left;">
                            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.2rem;">${formatDate(note.date)}</div>
                            <h5 style="font-size:0.82rem; font-weight:700; margin:0; color:var(--color-primary);"><a href="#nota-${note.id}" data-note-id="${note.id}" class="note-link" style="color:inherit; text-decoration:none;">${note.title}</a></h5>
                        </div>
                    `;
                }
            });
            return replyHtml;
        }

        // Greetings
        if (q.includes('hola') || q.includes('buenas') || q.includes('quien eres') || q.includes('ayuda') || q.includes('saludo')) {
            return `
                    <p style="margin-bottom:0.5rem;">¡Hola! Soy Emilio, y este es mi Gemelo Digital.</p>
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

    // Pool de sugerencias aleatorias
    const suggestionPool = [
        { label: "¿Puede la IA ser consciente?",        query: "¿Crees que la IA puede ser consciente?" },
        { label: "Recomiéndame un podcast",            query: "Recomiéndame un podcast" },
        { label: "¿Cómo eliges un modelo LLM?",         query: "¿Cómo elegir un modelo LLM?" },
        { label: "Gestión de la atención",             query: "¿Cómo gestionas tu atención?" },
        { label: "IA como copiloto",                    query: "¿Cómo usas la IA en tu día a día?" },
        { label: "Tomar mejores decisiones",            query: "¿Cómo tomar mejores decisiones?" },
        { label: "Arquitectura con RAG",                query: "Explícame qué es RAG y cuándo usarlo" },
        { label: "Notificaciones y foco",               query: "Qué opinas de las notificaciones del móvil" },
        { label: "IA open source vs comercial",         query: "Modelos de código abierto vs comerciales" },
        { label: "Filosofía de la mente artificial",   query: "¿Tiene mente la IA?" },
        { label: "Weigh-up: sopesar opciones",          query: "Cómo usas weigh-up para decidir" },
        { label: "¿Qué es whatstime.net?",             query: "Cuéntame sobre whatstime.net" },
    ];

    function renderSuggestions() {
        const container = document.getElementById('quick-tags-container');
        if (!container) return;
        // Mezclar y coger 4
        const shuffled = [...suggestionPool].sort(() => Math.random() - 0.5).slice(0, 4);
        container.innerHTML = '';
        shuffled.forEach(({ label, query }) => {
            const btn = document.createElement('button');
            btn.className = 'quick-tag-btn';
            btn.textContent = label;
            btn.addEventListener('click', () => {
                chatInput.value = query;
                sendMessage();
            });
            container.appendChild(btn);
        });
    }

    // Initial Execution on Load
    renderBlogFeed();
    renderSuggestions();

    // Initialize Layout from Preference
    const savedLayout = localStorage.getItem('cerebro-layout-preference') || 'split';
    setLayoutMode(savedLayout);
});
