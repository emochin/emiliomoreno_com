document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (using Intersection Observer)
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal
    const projectCards = document.querySelectorAll('.project-card');
    const sectionHeaders = document.querySelectorAll('.section-header');
    const skillItems = document.querySelectorAll('.skill-item');
    const aboutTexts = document.querySelectorAll('.about-text');
    const contactCard = document.querySelector('.contact-card');

    // Add initial reveal styles dynamically
    const revealElements = [...projectCards, ...sectionHeaders, ...skillItems, ...aboutTexts, contactCard].filter(el => el !== null);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // CSS injection for revealed state
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        body.no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // 4. Interactive Card Parallax Glow (optional nice-to-have)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the card
            const y = e.clientY - rect.top;  // y coordinate inside the card
            
            const glow = card.querySelector('.project-glow');
            if (glow) {
                glow.style.top = `${y - 75}px`;
                glow.style.left = `${x - 75}px`;
            }
        });
    });

    // 5. Logo Extension Alternator
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

    // 6. Redirection Toast Handler
    const showRedirectionToast = () => {
        const toast = document.getElementById('domain-toast');
        const closeBtn = document.getElementById('toast-close');
        
        if (!toast) return;

        // Check if user came from emiliomoreno.es or has redirect query param
        const referrerMatches = document.referrer && document.referrer.includes('emiliomoreno.es');
        const urlParams = new URLSearchParams(window.location.search);
        const queryMatches = urlParams.get('from') === 'es' || urlParams.get('ref') === 'es';

        if ((referrerMatches || queryMatches) && !sessionStorage.getItem('domain-toast-shown')) {
            // Show toast after a small delay for premium entrance feel
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

    // 7. Interactive Domain Switcher on Project Card
    const domainTabButtons = document.querySelectorAll('.domain-tab-btn');
    const emilioTitle = document.getElementById('emiliomoreno-title');
    const emilioDesc = document.getElementById('emiliomoreno-desc');
    const emilioStatus = document.getElementById('emiliomoreno-status');
    const emilioImg = document.getElementById('emiliomoreno-image');

    const domainData = {
        com: {
            title: 'emiliomoreno.com',
            desc: 'Este sitio web. Un punto de encuentro centralizado y limpio para unificar mis dominios registrados, hablar de mis intereses tecnológicos y ofrecer un canal de comunicación directo.',
            status: 'Activo',
            statusClass: 'status-active'
        },
        es: {
            title: 'emiliomoreno.es',
            desc: 'Mi dominio nacional. Redirigido a la versión global .com para consolidar el tráfico, reservado para proyectos orientados específicamente al mercado de habla hispana y al posicionamiento local.',
            status: 'Redirigido',
            statusClass: 'status-redirected'
        }
    };

    if (domainTabButtons.length > 0) {
        domainTabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const domain = btn.getAttribute('data-domain');
                if (!domainData[domain]) return;

                // Toggle active class on buttons
                domainTabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Apply fade out transition
                const elements = [emilioTitle, emilioDesc, emilioStatus, emilioImg].filter(el => el !== null);
                elements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(4px)';
                });

                setTimeout(() => {
                    // Update content
                    const data = domainData[domain];
                    if (emilioTitle) emilioTitle.textContent = data.title;
                    if (emilioDesc) emilioDesc.textContent = data.desc;
                    
                    if (emilioStatus) {
                        emilioStatus.textContent = data.status;
                        emilioStatus.className = `project-status ${data.statusClass}`;
                    }

                    // Restore opacity and slide back up
                    elements.forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }, 300);
            });
        });
    }
});
