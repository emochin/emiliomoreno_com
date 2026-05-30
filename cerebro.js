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
            id: "sistemas-complejos",
            date: "2026-05-30",
            title: "La ilusión del aislamiento en sistemas complejos",
            tag: "#Sistemas",
            image: null,
            text: "Una de las mayores trampas al diseñar tecnología, organizaciones o incluso al analizar problemas sociales es pensar que podemos aislar las variables. En los sistemas complejos, nada importante ocurre de manera completamente aislada. Cada decisión, cada cambio, genera efectos de segundo y tercer orden en cascada. El comportamiento del todo emerge de las interacciones constantes entre sus partes, no de las partes analizadas por separado. Ignorar esta red de interdependencia suele llevar a soluciones frágiles y a consecuencias imprevistas.",
            source: "Teoría de la Complejidad",
            sourceUrl: "https://es.wikipedia.org/wiki/Sistema_complejo",
            link: "https://es.wikipedia.org/wiki/Sistema_complejo",
            linkLabel: "Leer sobre Sistemas Complejos"
        },
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
    const PAGE_SIZE = 5;
    let currentPage = 1;

    function renderBlogFeed(resetPage = true) {
        if (resetPage) currentPage = 1;
        reflectionsFeedList.innerHTML = '';

        const sortedReflections = [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date));
        let displayReflections = sortedReflections;

        if (currentTagFilter) {
            displayReflections = sortedReflections.filter(note => note.tag.toLowerCase() === currentTagFilter.toLowerCase());
            const filterBar = document.createElement('div');
            filterBar.className = 'filter-status-bar';
            filterBar.innerHTML = `
                <span>Filtrado por: <strong>${currentTagFilter}</strong> (${displayReflections.length} ${displayReflections.length === 1 ? 'nota' : 'notas'})</span>
                <button class="clear-filter-btn" id="btn-clear-filter">Ver todas</button>
            `;
            reflectionsFeedList.appendChild(filterBar);
            filterBar.querySelector('#btn-clear-filter').addEventListener('click', () => {
                currentTagFilter = null;
                renderBlogFeed();
            });
        }

        const paginated = displayReflections.slice(0, currentPage * PAGE_SIZE);
        const hasMore = paginated.length < displayReflections.length;

        paginated.forEach((note) => {
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
            // Open modal on card click
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return; // let source links work normally
                openModal(note.id);
            });
            card.style.cursor = 'pointer';
            reflectionsFeedList.appendChild(card);
        });

        if (hasMore) {
            const loadMoreWrap = document.createElement('div');
            loadMoreWrap.className = 'load-more-container';
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'btn-load-more';
            const remaining = displayReflections.length - paginated.length;
            loadMoreBtn.textContent = `Ver ${Math.min(remaining, PAGE_SIZE)} más`;
            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                renderBlogFeed(false);
            });
            loadMoreWrap.appendChild(loadMoreBtn);
            reflectionsFeedList.appendChild(loadMoreWrap);
        }
    }

    // --- Reflection Modal ---
    const modalOverlay  = document.getElementById('reflection-modal-overlay');
    const modalDate     = document.getElementById('modal-date');
    const modalTag      = document.getElementById('modal-tag');
    const modalTitle    = document.getElementById('modal-title');
    const modalText     = document.getElementById('modal-text');
    const modalImageWrap = document.getElementById('modal-image-wrap');
    const modalSourceLink = document.getElementById('modal-source-link');
    const btnPrev       = document.getElementById('modal-prev-btn');
    const btnNext       = document.getElementById('modal-next-btn');

    let currentModalNoteId = null;

    function getSortedReflections() {
        const sorted = [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (currentTagFilter) {
            return sorted.filter(note => note.tag.toLowerCase() === currentTagFilter.toLowerCase());
        }
        return sorted;
    }

    function openModal(noteId) {
        currentModalNoteId = noteId;
        const currentList = getSortedReflections();
        const index = currentList.findIndex(r => r.id === noteId);
        
        if (index === -1) return;
        const note = currentList[index];

        modalDate.textContent = formatDate(note.date);
        modalTag.textContent  = note.tag;
        modalTitle.textContent = note.title;
        modalText.textContent  = '"' + note.text + '"';
        modalImageWrap.innerHTML = note.image
            ? `<img src="${note.image}" alt="${note.title}">`
            : '';
        
        const url = note.sourceUrl || note.link;
        if (url) {
            modalSourceLink.href        = url;
            modalSourceLink.textContent = note.linkLabel || ('vía ' + note.source);
            modalSourceLink.style.display = '';
        } else {
            modalSourceLink.style.display = 'none';
        }

        // Configure Navigation buttons
        btnPrev.disabled = index === 0;
        btnNext.disabled = index === currentList.length - 1;

        if (!modalOverlay.classList.contains('open')) {
            // Prevent layout shifting by checking scrollbar width
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
            modalOverlay.classList.add('open');
        }
    }

    function navigateModal(direction) {
        const currentList = getSortedReflections();
        const currentIndex = currentList.findIndex(r => r.id === currentModalNoteId);
        if (currentIndex === -1) return;

        const nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < currentList.length) {
            openModal(currentList[nextIndex].id);
        }
    }

    function closeModal() {
        if (!modalOverlay.classList.contains('open')) return;
        
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Flash target card in the feed for visual feedback
        if (currentModalNoteId) {
            const targetCard = document.getElementById(`nota-${currentModalNoteId}`);
            if (targetCard) {
                targetCard.classList.remove('card-attention');
                void targetCard.offsetWidth; // Trigger reflow
                targetCard.classList.add('card-attention');
            }
        }
    }

    // Modal listeners
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    btnPrev.addEventListener('click', () => navigateModal(-1));
    btnNext.addEventListener('click', () => navigateModal(1));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    
    document.addEventListener('keydown', (e) => {
        if (!modalOverlay.classList.contains('open')) return;
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    });

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

        // Wire up note-link clicks: open detail modal directly (works regardless of pagination)
        if (isHtml) {
            bubble.querySelectorAll('a.note-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const noteId = link.getAttribute('data-note-id');
                    openModal(noteId);
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
        const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let matchTopic = null;
        let summaryText = "";
        let notesToLink = [];

        // Helper para que no parezcan respuestas fijas
        const randomResponse = (responses) => responses[Math.floor(Math.random() * responses.length)];

        // Topic and Keyword checking
        if (q.includes('conscien') || q.includes('conciencia') || q.includes('sentir') || q.includes('subjetiv') || q.includes('filosofi') || q.includes('xhub') || q.includes('claude') || q.includes('experiencia') || q.includes('alma') || q.includes('mente')) {
            matchTopic = 'ia-consciencia';
            summaryText = randomResponse([
                "Es una pregunta profunda. Honestamente, me parece fascinante que nos estemos planteando esto hoy en día. Mi postura personal es escéptica pero abierta: no creo que los modelos actuales sientan de verdad o tengan experiencia subjetiva, pero tampoco tengo la verdad absoluta para descartarlo. El 'problema de la conciencia' es un misterio hasta para nosotros los humanos, así que explorarlo en la IA es un ejercicio filosófico muy interesante.",
                "Ese es uno de los grandes debates de nuestro tiempo. Mi visión es que, aunque los LLMs simulan comprensión maravillosamente bien, no experimentan la realidad de forma subjetiva. Aun así, admito que definir la conciencia es tan difícil para nosotros que negársela categóricamente a una máquina futura sería atrevido. Por ahora, me mantengo escéptico pero con la mente abierta.",
                "Suelo pensar que la consciencia en la IA actual es solo una ilusión muy bien diseñada. Sin embargo, no dejo de maravillarme con el debate. Dado que la experiencia subjetiva sigue siendo un misterio en neurociencia, aplicar ese mismo prisma a la inteligencia artificial me parece un ejercicio intelectual fascinante, más que una certeza técnica."
            ]);
            notesToLink = ['ia-consciencia'];
        } else if (q.includes('estrategia') || q.includes('transformac') || q.includes('negocio') || q.includes('modelo') || q.includes('llm') || q.includes('empresa') || q.includes('organiza') || q.includes('arquitectura') || q.includes('rag')) {
            matchTopic = 'estrategia-ia';
            summaryText = randomResponse([
                "Cuando me siento a diseñar la arquitectura y selección de modelos de lenguaje (LLMs), mi filosofía es ser bastante práctico. No creo que siempre haga falta el modelo comercial más potente. Prefiero diseñar pensando en las necesidades reales: optimizando el contexto con técnicas como RAG y valorando modelos locales o de código abierto para cuidar los costes, la latencia y, sobre todo, la privacidad.",
                "A la hora de integrar modelos de IA en un proyecto, huyo del 'usar lo más grande por defecto'. Mi enfoque se basa en construir buenas capas de abstracción y exprimir el contexto usando RAG. A menudo, un modelo local, pequeño y especializado es mejor opción que depender de APIs gigantes, sobre todo si te preocupa el coste y la privacidad.",
                "Mi estrategia con los LLMs siempre parte del pragmatismo. No todo requiere GPT-4 o Claude Opus. Si optimizas bien la inyección de contexto (RAG), muchos modelos open source o locales dan resultados excelentes. Es una cuestión de arquitectura inteligente más que de fuerza bruta computacional."
            ]);
            notesToLink = ['estrategia-ia'];
        } else if (q.includes('copiloto') || q.includes('desarrolla') || q.includes('program') || q.includes('codigo') || q.includes('sintaxis') || q.includes('ingenieria')) {
            matchTopic = 'desarrollo-ia';
            summaryText = randomResponse([
                "Me gusta mucho hablar sobre desarrollo y copilotos de IA. Yo los veo como unos compañeros de equipo incansables. Mi consejo suele ser delegarles las tareas más mecánicas o la sintaxis repetitiva. Así liberamos nuestra mente para lo que realmente aporta valor: diseñar arquitecturas con propósito y cuidar la experiencia del usuario final.",
                "En el día a día, uso la IA como un asistente de ingeniería para quitarme de en medio el trabajo sucio: escribir pruebas, estructuras repetitivas o sintaxis pesada. Esto me permite centrar toda mi energía mental en la arquitectura del software y en cómo resolver problemas reales de negocio.",
                "Los copilotos de código han cambiado mi forma de trabajar. En lugar de ser un 'picador de código', me siento más como un director de orquesta. Le delego la sintaxis a la herramienta y yo me dedico a pensar en la lógica, el diseño y la robustez del sistema."
            ]);
            notesToLink = ['ia'];
        } else if (q.includes('ia') || q.includes('inteligencia') || q.includes('artificial')) {
            matchTopic = 'general-ia';
            summaryText = randomResponse([
                "Tengo una visión bastante pragmática sobre la Inteligencia Artificial. La veo como un copiloto que nos ayuda en el día a día delegando tareas mecánicas. Creo firmemente en integrarla con sentido común, usando arquitecturas eficientes (como RAG) y sin perder nunca el toque personal en lo que construimos.",
                "Para mí, la IA no es un reemplazo, es un amplificador de capacidades. Trato de usarla a diario para automatizar lo aburrido y ganar tiempo para pensar. La clave está en usarla con una arquitectura modular y no depender ciegamente de un solo proveedor comercial.",
                "Mi forma de ver la Inteligencia Artificial se resume en: utilidad sin exageraciones. Es una herramienta magnífica si sabes cómo acotar su contexto y delegarle tareas específicas. El secreto es mantener siempre tú el control del diseño y la estrategia."
            ]);
            notesToLink = ['estrategia-ia', 'ia'];
        } else if (q.includes('tiempo') || q.includes('whatstime') || q.includes('atencion') || q.includes('mindfulness') || q.includes('concentra') || q.includes('enfoque')) {
            matchTopic = 'tiempo';
            summaryText = randomResponse([
                "Este es un tema que me toca muy de cerca. Creo que hoy en día el verdadero reto no es gestionar el tiempo, sino proteger nuestra atención. Vivimos rodeados de distracciones y es muy fácil dispersarse. Por eso creé whatstime.net, buscando ofrecer un refugio digital minimalista para limpiar la mente antes de concentrarnos en tareas complejas.",
                "Suelo decir que los bloques en el calendario no sirven de nada si tu mente está llena de ruido. Lo que realmente necesitamos proteger es nuestra atención. Herramientas como whatstime.net las he desarrollado precisamente para recuperar ese enfoque profundo que perdemos entre tantas notificaciones y estímulos digitales.",
                "La gestión del tiempo está sobrevalorada; lo crítico hoy es la gestión de la atención. Puedes tener tres horas libres, pero si estás saltando de pestaña en pestaña, no avanzas. Dedico mucho esfuerzo a crear espacios libres de ruido para trabajar, y de ahí nacen ideas como whatstime.net."
            ]);
            notesToLink = ['tiempo'];
        } else if (q.includes('decision') || q.includes('weigh-up') || q.includes('sopesar') || q.includes('opcion') || q.includes('peso') || q.includes('equilibrio')) {
            matchTopic = 'decisiones';
            summaryText = randomResponse([
                "Para la toma de decisiones, a veces nos engañamos haciendo simples listas de pros y contras. Lo que realmente importa es cómo resuena cada punto contigo, su peso moral o estratégico. Si algo afecta tu paz mental o tu tiempo familiar, un solo contra debería pesar más que varios pros. Basándome en este enfoque diseñé el concepto de weigh-up.com.",
                "Al sopesar opciones, el error común es contar 'cuántos pros y cuántos contras hay'. Yo creo que las decisiones se toman por impacto: un solo argumento en contra relacionado con tus valores clave vale más que diez pros superficiales. De esa forma más honesta de ponderar nació la idea detrás de weigh-up.com.",
                "Tomar buenas decisiones requiere honestidad brutal con uno mismo. No se trata de sumar puntos matemáticos en una balanza, sino de asignar el peso emocional real a cada factor. Por eso me gusta el enfoque asimétrico que propongo con herramientas conceptuales como weigh-up.com."
            ]);
            notesToLink = ['decisiones'];
        } else if (q.includes('sistema') || q.includes('aislad') || q.includes('complej') || q.includes('red') || q.includes('interact') || q.includes('efecto')) {
            matchTopic = 'sistemas-complejos';
            summaryText = randomResponse([
                "Me gusta mucho hablar de pensamiento sistémico. Mi opinión es clara: en sistemas complejos, nada importante ocurre de manera completamente aislada. Pensar que podemos analizar o cambiar una sola pieza sin afectar al resto es una ilusión que suele salir cara.",
                "Cuando diseño soluciones, intento aplicar la teoría de sistemas complejos. La clave es entender que no existen eventos aislados; todo está conectado. Si cambias un elemento de la red, inevitablemente generas efectos de segundo y tercer orden en otras partes del sistema.",
                "El pensamiento sistémico me ha enseñado que tratar de resolver problemas aislando variables casi siempre falla. En redes interconectadas, el comportamiento del todo emerge de las interacciones. Por eso intento diseñar con una visión panorámica y no centrada solo en los detalles locales."
            ]);
            notesToLink = ['sistemas-complejos'];
        } else if (q.includes('podcast') || q.includes('escuchar') || q.includes('recomiend') || q.includes('notificac') || q.includes('movil') || q.includes('spotify') || q.includes('neurociencia') || q.includes('ivoox')) {
            matchTopic = 'podcast';
            if (q.includes('recomiend') || q.includes('podcast') || q.includes('escuchar') || q.includes('ivoox')) {
                summaryText = randomResponse([
                    "Últimamente estoy escuchando bastante xHUB.AI, de Plácido Doménech. Es una comunidad sobre IA y ciencias en español muy interesante. Hace poco tuvieron un episodio donde entrevistaban a Claude sobre si podría ser consciente, y fue un enfoque muy bueno. Te recomiendo echarle un vistazo en iVoox, Spotify o Apple Podcasts.",
                    "Si buscas una buena recomendación, dale una oportunidad a xHUB.AI. Me parece uno de los podcasts más serios y a la vez entretenidos sobre filosofía de la IA, LLMs y tecnología aplicada. El episodio en el que exploran la consciencia simulada con Claude me pareció espectacular.",
                    "Ahora mismo mi referencia principal en audio es xHUB.AI de Plácido Doménech. Tratan los temas de Inteligencia Artificial sin el 'hype' habitual, centrándose mucho en el impacto filosófico y técnico. Tienes los episodios en las principales plataformas y te aseguro que valen la pena."
                ]);
                notesToLink = ['ia-consciencia', 'podcast'];
            } else {
                summaryText = randomResponse([
                    "Suelo inspirarme escuchando podcasts sobre IA y neurociencia para entender mejor cómo funciona nuestra mente. Un consejo práctico que comparto a menudo: prueba a desactivar las notificaciones del móvil. Mantenerlo en modo 'No molestar' permanentemente (dejando solo llamadas de emergencia) es clave para recuperar la capacidad de concentración profunda.",
                    "Escuchar sobre neurociencia en podcasts me hizo darme cuenta de algo vital: nuestros cerebros no están preparados para el bombardeo de las notificaciones. Así que mi mayor consejo es usar el modo 'No molestar' de forma predeterminada en el móvil. Verás cómo tu concentración profunda se multiplica en pocos días."
                ]);
                notesToLink = ['podcast'];
            }
        }

        // Return matched response with summaries and note links
        if (matchTopic && notesToLink.length > 0) {
            let replyHtml = `<p style="margin-bottom:0.75rem; font-size:0.92rem; line-height:1.5; color:var(--text-primary);">${summaryText}</p>`;
            replyHtml += `<div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; border-top: 1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; margin-bottom:0.4rem; letter-spacing:0.5px;">Mis notas relacionadas:</div>`;
            
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
        if (q.includes('hola') || q.includes('buenas') || q.includes('quien eres') || q.includes('ayuda') || q.includes('saludo') || q.includes('que tal')) {
            const greetingText = randomResponse([
                "Hola, soy el Gemelo Digital de Emilio. Puedo buscar entre mis reflexiones y darte mi punto de vista sobre temas como la Inteligencia Artificial, la gestión de la atención, la toma de decisiones o recomendarte algún podcast interesante. ¿Sobre qué te gustaría charlar?",
                "¡Hola! Estás hablando con mi Gemelo Digital. En base a mis apuntes, puedo conversar contigo sobre modelos de lenguaje, copilotos de desarrollo, filosofía sobre el tiempo y el enfoque, o herramientas de decisión. ¿Qué tema te apetece tratar hoy?",
                "Bienvenido. Como Gemelo Digital de Emilio, tengo indexadas sus notas principales. Si te interesa la intersección entre tecnología (especialmente IA), la neurociencia, la atención y el minimalismo digital, estás en el lugar correcto. ¿En qué te ayudo?"
            ]);
            return `
                    <p style="margin-bottom:0.5rem; color:var(--text-secondary);">${greetingText}</p>
            `;
        }

        // Fallback
        const fallbackText = randomResponse([
            "No tengo notas concretas sobre ese tema en mi memoria ahora mismo.",
            "He revisado mis apuntes y no parece que tenga nada específico sobre esto guardado por el momento.",
            "Esa consulta se escapa un poco del alcance de mis reflexiones actuales."
        ]);
        const fallbackSubText = randomResponse([
            "Si quieres, podemos explorar otras ideas. Por ejemplo:",
            "Pero no te vayas sin probar algunos de los temas que más me interesan:",
            "¿Por qué no probamos con algo que sí tengo documentado? Como por ejemplo:"
        ]);

        return `
            <p style="margin-bottom:0.5rem;">${fallbackText}</p>
            <p style="color:var(--text-secondary); margin-bottom:0.5rem;">
                ${fallbackSubText}
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

    // Pool de etiquetas cortas (quick tags)
    const tagPool = [
        { label: "#IA",          query: "¿Qué opinas sobre la Inteligencia Artificial?" },
        { label: "#Tiempo",      query: "¿Cómo gestionas tu atención?" },
        { label: "#Decisiones",  query: "¿Cómo tomar mejores decisiones?" },
        { label: "#Podcasts",    query: "Recomiéndame un podcast" },
        { label: "#Consciencia", query: "¿Crees que la IA puede ser consciente?" },
        { label: "#LLMs",        query: "¿Cómo eliges un modelo LLM?" },
        { label: "#Enfoque",     query: "¿Qué opinas de las notificaciones del móvil?" },
        { label: "#Filosofía",   query: "¿Tiene mente la IA?" },
        { label: "#Sistemas",    query: "¿Qué son los sistemas complejos?" },
    ];

    // Pool de ejemplos del bubble de bienvenida (pares)
    const bubbleExamplePool = [
        ["¿Qué opinas del tiempo?",              "Recomiéndame un podcast"],
        ["¿Puede la IA ser consciente?",          "¿Cómo eliges un modelo LLM?"],
        ["¿Cómo gestionas tu atención?",          "¿Qué opinas de las notificaciones?"],
        ["¿Cómo tomar mejores decisiones?",       "¿Qué opinas de los sistemas complejos?"],
        ["¿Qué es RAG y cuándo lo usas?",         "¿Nada ocurre de manera aislada?"],
    ];

    function fireQuestion(q) {
        chatInput.value = q;
        sendMessage();
    }

    function renderSuggestions() {
        // Quick tags: 4 aleatorias del pool
        const container = document.getElementById('quick-tags-container');
        if (container) {
            const shuffled = [...tagPool].sort(() => Math.random() - 0.5).slice(0, 4);
            container.innerHTML = '';
            shuffled.forEach(({ label, query }) => {
                const btn = document.createElement('button');
                btn.className = 'quick-tag-btn';
                btn.textContent = label;
                btn.addEventListener('click', () => fireQuestion(query));
                container.appendChild(btn);
            });
        }

        // Bubble de bienvenida: par de ejemplos aleatorio con enlaces clicables
        const bubbleEl = document.getElementById('bubble-examples');
        if (bubbleEl) {
            const [ex1, ex2] = bubbleExamplePool[Math.floor(Math.random() * bubbleExamplePool.length)];
            bubbleEl.innerHTML = `Pregúntame cosas como: <a class="bubble-link" href="#">"${ex1}"</a> o <a class="bubble-link" href="#">"${ex2}"</a> y responderé basándome en mis propias notas.`;
            bubbleEl.querySelectorAll('.bubble-link').forEach((link, i) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    fireQuestion(i === 0 ? ex1 : ex2);
                });
            });
        }
    }

    // Initial Execution on Load
    renderBlogFeed();
    renderSuggestions();

    // Initialize Layout from Preference
    const savedLayout = localStorage.getItem('cerebro-layout-preference') || 'split';
    setLayoutMode(savedLayout);
});
