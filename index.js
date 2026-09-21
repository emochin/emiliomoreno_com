/* index.js - Landing Blog Logic & Offcanvas Chat */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Chat
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const quickTagsContainer = document.getElementById('quick-tags-container');
    
    // DOM Elements - Offcanvas Chat
    const chatOffcanvas = document.getElementById('chat-offcanvas');
    const chatOverlay = document.getElementById('chat-offcanvas-overlay');
    const btnsOpenChat = [
        document.getElementById('btn-open-chat'),
        document.getElementById('link-open-chat'),
        document.getElementById('footer-btn-chat')
    ];
    const btnCloseChat = document.getElementById('chat-close-btn');

    // DOM Elements - Blog
    const blogHeroContainer = document.getElementById('blog-hero-container');
    const reflectionsFeedList = document.getElementById('reflections-feed-list');

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
            checkHashOnLoad();
        } catch (e) {
            console.error("Error loading reflections:", e);
        }
    }

    // --- Offcanvas Chat Logic ---
    function openChat(e) {
        if(e) e.preventDefault();
        chatOffcanvas.classList.add('open');
        chatOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeChat() {
        chatOffcanvas.classList.remove('open');
        chatOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    btnsOpenChat.forEach(btn => {
        if(btn) btn.addEventListener('click', openChat);
    });
    if(btnCloseChat) btnCloseChat.addEventListener('click', closeChat);
    if(chatOverlay) chatOverlay.addEventListener('click', closeChat);

    // --- Render Blog Feed (1+2 Hero and the rest) ---
    const PAGE_SIZE = 6;
    let currentPage = 1;
    let currentTagFilter = null;

    document.addEventListener('click', (e) => {
        const tagElement = e.target.closest('.blog-card-tag');
        if (tagElement && !e.target.closest('#reflection-modal')) {
            e.stopPropagation();
            const tagText = tagElement.textContent.trim();
            filterByTag(tagText);
        }
    });

    function filterByTag(tag) {
        currentTagFilter = tag;
        renderBlogFeed();
        document.getElementById('feed').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function buildCardHTML(note) {
        const targetUrl = note.sourceUrl || note.link;
        return `
            ${note.image ? `<div class="blog-card-image"><img src="${note.image}" alt="${note.title}" loading="lazy"></div>` : ''}
            <div class="blog-card-body">
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        ${formatDate(note.date)} —
                        ${targetUrl ? `<a href="${targetUrl}" target="_blank" rel="noopener" class="blog-card-source-link">${note.source}</a>` : `${note.source}`}
                    </span>
                    <span class="blog-card-tag" title="Filtrar por esta etiqueta">${note.tag}</span>
                </div>
                <h3 class="blog-card-title">${note.title}</h3>
                <div class="blog-card-text">${note.text}</div>
            </div>
        `;
    }

    function renderBlogFeed(resetPage = true) {
        if (resetPage) currentPage = 1;
        blogHeroContainer.innerHTML = '';
        reflectionsFeedList.innerHTML = '';

        const sortedReflections = [...reflections].sort((a, b) => new Date(b.date) - new Date(a.date));
        let displayReflections = sortedReflections;

        if (currentTagFilter) {
            displayReflections = sortedReflections.filter(note => note.tag.toLowerCase() === currentTagFilter.toLowerCase());
            const filterBar = document.createElement('div');
            filterBar.className = 'filter-status-bar';
            filterBar.style.gridColumn = '1 / -1';
            filterBar.style.marginBottom = '2rem';
            filterBar.innerHTML = `
                <span>Filtrado por: <strong>${currentTagFilter}</strong> (${displayReflections.length} ${displayReflections.length === 1 ? 'nota' : 'notas'})</span>
                <button class="clear-filter-btn" id="btn-clear-filter">Ver todas</button>
            `;
            blogHeroContainer.appendChild(filterBar);
            filterBar.querySelector('#btn-clear-filter').addEventListener('click', () => {
                currentTagFilter = null;
                renderBlogFeed();
            });
        }

        // Split into Hero (top 3) and Rest
        // If filtering by tag, we still use the 1+2 layout if there are enough items.
        const heroItems = displayReflections.slice(0, 3);
        const restItems = displayReflections.slice(3);

        heroItems.forEach((note, index) => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            
            if (index === 0) {
                card.classList.add('blog-hero-main');
            } else {
                card.classList.add('blog-hero-sub');
            }

            card.id = `nota-${note.id}`;
            card.innerHTML = buildCardHTML(note);
            
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.share-card-btn') || e.target.closest('.blog-card-tag')) return; 
                openModal(note.id);
            });
            blogHeroContainer.appendChild(card);
        });

        // Hide "Rest" section if there are no more items
        const restContainerElement = reflectionsFeedList.parentElement;
        if (restItems.length === 0) {
            restContainerElement.style.display = 'none';
            return;
        } else {
            restContainerElement.style.display = 'block';
        }

        const paginated = restItems.slice(0, currentPage * PAGE_SIZE);
        const hasMore = paginated.length < restItems.length;

        paginated.forEach(note => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.id = `nota-${note.id}`;
            card.innerHTML = buildCardHTML(note);
            
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.share-card-btn') || e.target.closest('.blog-card-tag')) return; 
                openModal(note.id);
            });
            reflectionsFeedList.appendChild(card);
        });

        if (hasMore) {
            const loadMoreWrap = document.createElement('div');
            loadMoreWrap.className = 'load-more-container';
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'btn-load-more';
            const remaining = restItems.length - paginated.length;
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

    window.openModal = function(noteId) {
        currentModalNoteId = noteId;
        const currentList = getSortedReflections();
        const index = currentList.findIndex(r => r.id === noteId);
        
        if (index === -1) return;
        const note = currentList[index];

        history.replaceState(null, null, `#nota-${noteId}`);

        modalDate.textContent = formatDate(note.date);
        modalTag.textContent  = note.tag;
        modalTitle.textContent = note.title;
        modalText.innerHTML  = note.text;
        modalImageWrap.innerHTML = note.image ? `<img src="${note.image}" alt="${note.title}">` : '';
        
        const url = note.sourceUrl || note.link;
        if (url) {
            modalSourceLink.href = url;
            modalSourceLink.textContent = note.linkLabel || ('vía ' + note.source);
            modalSourceLink.style.display = '';
        } else {
            modalSourceLink.style.display = 'none';
        }

        btnPrev.disabled = index === 0;
        btnNext.disabled = index === currentList.length - 1;

        if (!modalOverlay.classList.contains('open')) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
            modalOverlay.classList.add('open');
        }
    };

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
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    btnPrev.addEventListener('click', () => navigateModal(-1));
    btnNext.addEventListener('click', () => navigateModal(1));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    function checkHashOnLoad() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#nota-')) {
            const noteId = hash.replace('#nota-', '');
            const note = reflections.find(r => r.id === noteId);
            if (note) {
                setTimeout(() => openModal(noteId), 200);
            }
        }
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('es-ES', options);
    }

    // --- Chatbot Functionality ---
    function scrollToBottom() { chatLog.scrollTop = chatLog.scrollHeight; }

    function appendMessage(sender, content, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isHtml) bubble.innerHTML = content;
        else bubble.textContent = content;
        
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
        bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
        messageDiv.appendChild(bubble);
        chatLog.appendChild(messageDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    let chatHistory = [];

    async function sendMessage(queryText = null) {
        const query = queryText || chatInput.value.trim();
        if (query === '') return;

        appendMessage('user', query);
        chatInput.value = '';
        chatHistory.push({ role: 'user', content: query });
        showTypingIndicator();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, history: chatHistory })
            });
            
            if (!response.ok) throw new Error('Error en la API');
            const data = await response.json();
            
            removeTypingIndicator();
            if (data.replyHtml) {
                appendMessage('bot', data.replyHtml, true);
            } else if (data.text) {
                let html = `<p style="margin-bottom:0.75rem; font-size:0.92rem;">${data.text}</p>`;
                if (data.notes && data.notes.length > 0) {
                     html += `<div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; border-top: 1px solid var(--border-color); padding-top:0.6rem; margin-top:0.6rem; margin-bottom:0.4rem;">Mis notas relacionadas:</div>`;
                     data.notes.forEach(id => {
                          const note = reflections.find(r => r.id === id);
                          if (note) {
                              const dateStr = new Date(note.date).toLocaleDateString('es-ES', {year:'numeric', month:'short', day:'numeric'});
                              html += `
                                  <div class="related-note-item" style="display: flex; gap: 0.75rem; align-items: center; background:rgba(255, 255, 255, 0.05); border:1px solid var(--border-color); border-radius:6px; padding:0.5rem; margin-bottom:0.5rem; cursor:pointer;" onclick="window.openModal('${note.id}')">
                                      ${note.image ? `<div style="width: 40px; height: 40px; border-radius: 4px; overflow: hidden;"><img src="${note.image}" style="width: 100%; height: 100%; object-fit: cover;"></div>` : ''}
                                      <div style="flex: 1; min-width: 0;">
                                          <div style="font-size:0.65rem; color:var(--text-muted);">${dateStr}</div>
                                          <h5 style="font-size:0.8rem; font-weight:700; color:var(--color-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${note.title}</h5>
                                      </div>
                                  </div>
                              `;
                          }
                     });
                }
                appendMessage('bot', html, true);
                chatHistory.push({ role: 'model', content: data.text });
            }
        } catch (error) {
            console.error(error);
            removeTypingIndicator();
            appendMessage('bot', '<p>Vaya, ha habido un error conectando con mi IA.</p>', true);
        }
    }

    btnSend.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Pool de etiquetas cortas
    const tagPool = [
        { label: "Sobre Inteligencia Artificial", query: "¿Qué opinas sobre la Inteligencia Artificial?" },
        { label: "Decisiones", query: "¿Cómo tomar mejores decisiones?" },
        { label: "Filosofía e IA", query: "¿Tiene mente la IA?" },
        { label: "Productividad", query: "¿Cómo gestionas tu atención?" },
        { label: "Sistemas Complejos", query: "¿Qué son los sistemas complejos?" }
    ];

    function renderSuggestions() {
        const container = document.getElementById('quick-tags-container');
        if (container) {
            const shuffled = [...tagPool].sort(() => Math.random() - 0.5).slice(0, 3);
            container.innerHTML = '';
            shuffled.forEach(({ label, query }) => {
                const btn = document.createElement('button');
                btn.className = 'quick-tag-btn';
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    sendMessage(query);
                    // No cierro el chat, solo envío el mensaje.
                });
                container.appendChild(btn);
            });
        }
    }

    initData();

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Logo Extension Alternator
    const logoExt = document.getElementById('logo-extension');
    if (logoExt) {
        const extensions = ['.com', '.es'];
        let currentIdx = 0;
        setInterval(() => {
            logoExt.style.opacity = 0;
            setTimeout(() => {
                currentIdx = (currentIdx + 1) % extensions.length;
                logoExt.textContent = extensions[currentIdx];
                logoExt.style.opacity = 1;
            }, 300);
        }, 5000);
    }
});
