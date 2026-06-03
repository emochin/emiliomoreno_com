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

    let reflections = [];
    let brainMap = {};

    async function initData() {
        try {
            const res = await fetch('data/reflections.json');
            reflections = await res.json();
            brainMap = reflections.reduce((acc, current) => {
                acc[current.id] = current;
                return acc;
            }, {});
            
            renderBlogFeed();
            renderSuggestions();
        } catch (e) {
            console.error("Error loading reflections:", e);
        }
    }

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
                    <p class="blog-card-text">${note.text}</p>
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

    window.openModal = openModal; // Expose for inline handlers
    function openModal(noteId) {
        currentModalNoteId = noteId;
        const currentList = getSortedReflections();
        const index = currentList.findIndex(r => r.id === noteId);
        
        if (index === -1) return;
        const note = currentList[index];

        modalDate.textContent = formatDate(note.date);
        modalTag.textContent  = note.tag;
        modalTitle.textContent = note.title;
        modalText.textContent  = note.text;
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
            document.body.classList.remove('layout-mode-ia-active');
            if (btnLayoutBlog) btnLayoutBlog.classList.add('active');
            if (btnLayoutSplit) btnLayoutSplit.classList.remove('active');
            localStorage.setItem('cerebro-layout-preference', 'blog');
            
            columnFeed.classList.add('active');
            columnChat.classList.remove('active');
        } else {
            document.body.classList.add('layout-mode-ia-active');
            document.body.classList.remove('layout-mode-blog-active');
            if (btnLayoutSplit) btnLayoutSplit.classList.add('active');
            if (btnLayoutBlog) btnLayoutBlog.classList.remove('active');
            localStorage.setItem('cerebro-layout-preference', 'ia');
            
            columnChat.classList.add('active');
            columnFeed.classList.remove('active');
        }
    }

    if (btnLayoutSplit && btnLayoutBlog) {
        btnLayoutSplit.addEventListener('click', () => setLayoutMode('ia'));
        btnLayoutBlog.addEventListener('click', () => setLayoutMode('blog'));
    }

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

    let chatHistory = [];

    async function sendMessage() {
        const query = chatInput.value.trim();
        if (query === '') return;

        // Render User Message
        appendMessage('user', query);
        chatInput.value = '';

        // Add to history
        chatHistory.push({ role: 'user', content: query });

        // Simulate Bot thinking
        showTypingIndicator();
        
        try {
            // Llama al servidor RAG
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, history: chatHistory })
            });
            
            if (!response.ok) {
                throw new Error('Error en la API');
            }
            
            const data = await response.json();
            
            removeTypingIndicator();
            if (data.replyHtml) {
                appendMessage('bot', data.replyHtml, true);
            } else if (data.text) {
                let html = `<p style="margin-bottom:0.75rem; font-size:0.92rem; line-height:1.5; color:var(--text-primary);">${data.text}</p>`;
                if (data.notes && data.notes.length > 0) {
                     html += `<div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; border-top: 1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; margin-bottom:0.4rem; letter-spacing:0.5px;">Mis notas relacionadas:</div>`;
                     data.notes.forEach(id => {
                         const note = reflections.find(r => r.id === id);
                         if (note) {
                             const dateStr = new Date(note.date).toLocaleDateString('es-ES', {year:'numeric', month:'short', day:'numeric'});
                             html += `
                                 <div style="background:rgba(255, 255, 255, 0.02); border:1px solid var(--border-color); border-radius:12px; padding:0.6rem 0.75rem; margin-bottom:0.5rem; text-align:left; cursor:pointer;" onclick="window.openModal('${note.id}')">
                                     <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.2rem;">${dateStr}</div>
                                     <h5 style="font-size:0.82rem; font-weight:700; margin:0; color:var(--color-primary);">${note.title}</h5>
                                 </div>
                             `;
                         }
                     });
                }
                appendMessage('bot', html, true);
                // Add to history
                chatHistory.push({ role: 'model', content: data.text });
            }
        } catch (error) {
            console.error(error);
            removeTypingIndicator();
            appendMessage('bot', '<p>Vaya, parece que ha habido un error conectando con mi Cerebro de IA. Inténtalo de nuevo más tarde.</p>', true);
        }
    }

    // Chat Listeners
    btnSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    const btnSuggestTopic = document.getElementById('btn-suggest-topic');
    if (btnSuggestTopic) {
        btnSuggestTopic.addEventListener('click', () => {
            chatInput.value = '/sugerir ';
            chatInput.focus();
        });
    }

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
        { label: "#Festivo",     query: "Cuéntame sobre la religión del Crustofari" },
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
    initData();

    // Initialize Layout from Preference
    const savedLayout = localStorage.getItem('cerebro-layout-preference') || 'ia';
    setLayoutMode(savedLayout === 'split' ? 'ia' : savedLayout);

    // Logo Extension Alternator
    const logoExt = document.getElementById('logo-extension');
    if (logoExt) {
        const extensions = ['.com', '.es'];
        let currentIdx = 0;
        setInterval(() => {
            logoExt.classList.add('transition-out');
            setTimeout(() => {
                currentIdx = (currentIdx + 1) % extensions.length;
                logoExt.textContent = extensions[currentIdx];
                logoExt.classList.remove('transition-out');
                logoExt.classList.add('transition-in');
                // Force reflow
                void logoExt.offsetWidth;
                logoExt.classList.remove('transition-in');
            }, 350);
        }, 5000);
    }

    // Redirection Toast Handler
    const showRedirectionToast = () => {
        const toast = document.getElementById('domain-toast');
        const closeBtn = document.getElementById('toast-close');
        
        if (!toast) return;

        // Check if user came from emiliomoreno.es or has redirect query param
        const referrerMatches = document.referrer && document.referrer.includes('emiliomoreno.es');
        const urlParams = new URLSearchParams(window.location.search);
        const queryMatches = urlParams.get('from') === 'es' || urlParams.get('ref') === 'es';

        if ((referrerMatches || queryMatches) && !sessionStorage.getItem('domain-toast-shown')) {
            // Show toast after a small delay
            setTimeout(() => {
                toast.classList.remove('hidden');
            }, 1500);

            // Hide automatically after 8 seconds
            const autoHideTimeout = setTimeout(() => {
                toast.classList.add('hidden');
            }, 9500);

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    clearTimeout(autoHideTimeout);
                    toast.classList.add('hidden');
                });
            }

            sessionStorage.setItem('domain-toast-shown', 'true');
        }
    };
    showRedirectionToast();
});
