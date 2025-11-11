// Navegação mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

const WHATSAPP_POPUP_DELAY = 20000; // 20 segundos
const WHATSAPP_POPUP_STORAGE_KEY = 'ecj_whatsapp_popup_dismissed';
let whatsappPopupTimeout = null;
let whatsappPopupBackdrop = null;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Fechar menu ao clicar em um link
if (navMenu) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
}

// Header no scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.product-card, .service-card, .feature-card, .contact-item, .stat-item, .value-item');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Animação de contador para estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = entry.target;
                
                if (!statItem.classList.contains('animated')) {
                    statItem.classList.add('animated');
                    const originalText = statItem.textContent;
                    let target, suffix = '';
                    
                    // Trata diferentes formatos: 10+, 5000+, 50K+, 100%
                    if (originalText.includes('K+')) {
                        target = parseInt(originalText) * 1000;
                        suffix = 'K+';
                    } else if (originalText.includes('+')) {
                        target = parseInt(originalText);
                        suffix = '+';
                    } else if (originalText.includes('%')) {
                        target = parseInt(originalText);
                        suffix = '%';
                    } else {
                        target = parseInt(originalText) || 0;
                    }
                    
                    animateCounter(statItem, target, suffix, originalText);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    scheduleWhatsAppPopup();
});

// Formulário de contato removido

function scheduleWhatsAppPopup(delay = WHATSAPP_POPUP_DELAY) {
    if (sessionStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY)) {
        return;
    }

    if (whatsappPopupTimeout) {
        clearTimeout(whatsappPopupTimeout);
    }

    whatsappPopupTimeout = window.setTimeout(() => {
        showWhatsAppPopup();
    }, delay);
}

function showWhatsAppPopup() {
    if (sessionStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY)) {
        return;
    }

    const backdrop = ensureWhatsAppPopup();
    if (!backdrop) {
        return;
    }

    requestAnimationFrame(() => {
        backdrop.classList.add('active');
        const focusTarget = backdrop.querySelector('.btn-whatsapp');
        if (focusTarget) {
            focusTarget.focus();
        }
    });
}

function ensureWhatsAppPopup() {
    if (whatsappPopupBackdrop) {
        return whatsappPopupBackdrop;
    }

    whatsappPopupBackdrop = document.createElement('div');
    whatsappPopupBackdrop.className = 'whatsapp-popup-backdrop';
    whatsappPopupBackdrop.setAttribute('role', 'dialog');
    whatsappPopupBackdrop.setAttribute('aria-modal', 'true');
    whatsappPopupBackdrop.setAttribute('aria-label', 'Conversar pelo WhatsApp');

    const popup = document.createElement('div');
    popup.className = 'whatsapp-popup';
    popup.innerHTML = `
        <button type="button" class="close-popup" aria-label="Fechar aviso">
            <i class="fas fa-times"></i>
        </button>
        <div class="popup-icon" aria-hidden="true">
            <i class="fab fa-whatsapp"></i>
        </div>
        <h3>Fale com a ECJ Bones</h3>
        <p>Precisa tirar dúvidas ou pedir um orçamento? Nossa equipe responde rapidamente pelo WhatsApp.</p>
        <div class="popup-actions">
            <a href="https://wa.me/5543996141411?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20de%20bonés%20personalizados." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                <i class="fab fa-whatsapp"></i>
                Ir para o WhatsApp
            </a>
            <button type="button" class="btn btn-secondary dismiss-popup">Agora não</button>
        </div>
    `;

    whatsappPopupBackdrop.appendChild(popup);
    document.body.appendChild(whatsappPopupBackdrop);

    const closeButton = popup.querySelector('.close-popup');
    const dismissButton = popup.querySelector('.dismiss-popup');
    const whatsappButton = popup.querySelector('.btn-whatsapp');

    function hide(persist = true) {
        if (!whatsappPopupBackdrop) {
            return;
        }

        whatsappPopupBackdrop.classList.remove('active');
        document.removeEventListener('keydown', onKeyDown);

        window.setTimeout(() => {
            if (whatsappPopupBackdrop && whatsappPopupBackdrop.parentNode) {
                whatsappPopupBackdrop.parentNode.removeChild(whatsappPopupBackdrop);
            }
            whatsappPopupBackdrop = null;
        }, 280);

        if (persist) {
            sessionStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, '1');
        }
    }

    function onKeyDown(event) {
        if (event.key === 'Escape') {
            hide();
        }
    }

    closeButton?.addEventListener('click', () => hide());
    dismissButton?.addEventListener('click', () => hide());
    whatsappButton?.addEventListener('click', () => hide());

    whatsappPopupBackdrop.addEventListener('click', (event) => {
        if (event.target === whatsappPopupBackdrop) {
            hide();
        }
    });

    document.addEventListener('keydown', onKeyDown);

    return whatsappPopupBackdrop;
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contador animado para estatísticas
function animateCounter(element, target, suffix = '', originalText = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const hasK = suffix === 'K+';
    const finalTarget = hasK ? target / 1000 : target;
    
    const timer = setInterval(() => {
        start += increment;
        let displayValue;
        
        if (hasK) {
            displayValue = (start / 1000).toFixed(0);
        } else {
            displayValue = Math.floor(start);
        }
        
        element.textContent = displayValue + suffix;
        
        if (start >= target) {
            element.textContent = originalText;
            clearInterval(timer);
        }
    }, 16);
}

// Removido efeito parallax - hero section simplificada

// Lazy loading para imagens (excluindo imagens de produtos)
const images = document.querySelectorAll('img:not(#products img)');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // Não aplica lazy loading se a imagem já foi carregada
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
            }
            
            observer.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Validação de formulário removida - formulário não existe mais

// Estilos para hamburger menu
const style = document.createElement('style');
style.textContent = `
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Preloader (opcional)
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Botão de voltar ao topo
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 998;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
`;

// Responsive adjustments for back-to-top button
function adjustBackToTopButton() {
    if (window.innerWidth <= 480) {
        backToTopBtn.style.width = '45px';
        backToTopBtn.style.height = '45px';
        backToTopBtn.style.bottom = '20px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.fontSize = '1rem';
    } else if (window.innerWidth <= 360) {
        backToTopBtn.style.width = '40px';
        backToTopBtn.style.height = '40px';
        backToTopBtn.style.bottom = '15px';
        backToTopBtn.style.right = '15px';
        backToTopBtn.style.fontSize = '0.9rem';
    } else {
        backToTopBtn.style.width = '50px';
        backToTopBtn.style.height = '50px';
        backToTopBtn.style.bottom = '30px';
        backToTopBtn.style.right = '30px';
        backToTopBtn.style.fontSize = '1.2rem';
    }
}

window.addEventListener('resize', adjustBackToTopButton);
adjustBackToTopButton();

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
        backToTopBtn.style.transform = 'scale(1)';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
        backToTopBtn.style.transform = 'scale(0.8)';
    }
});

// Hover effect
backToTopBtn.addEventListener('mouseenter', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.transform = 'scale(1.1)';
        backToTopBtn.style.background = '#c82333';
    }
});

backToTopBtn.addEventListener('mouseleave', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.transform = 'scale(1)';
        backToTopBtn.style.background = '#dc3545';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Efeito de hover nos cards de produto
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Adicionar efeito de typing no título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Efeito de typing desabilitado - título estático
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-text h1');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         setTimeout(() => {
//             typeWriter(heroTitle, originalText, 50);
//         }, 1000);
//     }
// });

// Garantir que todas as imagens de produtos sejam exibidas corretamente
function loadProductImages() {
    const productImages = document.querySelectorAll('#products .product-image img');
    
    productImages.forEach((img, index) => {
        // FORÇA a imagem a ser visível - importante usar !important via setProperty
        img.style.setProperty('opacity', '1', 'important');
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('visibility', 'visible', 'important');
        
        // Handler para quando a imagem carregar
        const makeVisible = function() {
            this.style.setProperty('opacity', '1', 'important');
            this.style.setProperty('display', 'block', 'important');
            this.style.setProperty('visibility', 'visible', 'important');
        };
        
        if (img.complete && img.naturalWidth > 0) {
            makeVisible.call(img);
            console.log(`✓ [${index + 1}] Imagem já carregada: ${img.src}`);
        } else {
            img.onload = function() {
                makeVisible.call(this);
                console.log(`✓ [${index + 1}] Imagem carregada: ${this.src}`);
            };
            img.onerror = function() {
                console.error(`✗ [${index + 1}] Erro ao carregar: ${this.src}`);
            };
        }
    });
}

// Executa quando o DOM estiver pronto e também após o carregamento completo
function initProductImages() {
    loadProductImages();
    // Executa múltiplas vezes para garantir
    setTimeout(loadProductImages, 50);
    setTimeout(loadProductImages, 100);
    setTimeout(loadProductImages, 200);
    setTimeout(loadProductImages, 500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductImages);
} else {
    // DOM já está carregado
    initProductImages();
}

// Também executa quando a página terminar de carregar completamente
window.addEventListener('load', function() {
    setTimeout(loadProductImages, 100);
    setTimeout(loadProductImages, 300);
    setTimeout(loadProductImages, 600);
});

// Monitora continuamente para garantir que as imagens estejam visíveis
setInterval(function() {
    const productImages = document.querySelectorAll('#products .product-image img');
    productImages.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            // Força visibilidade apenas se a imagem já carregou
            const currentOpacity = window.getComputedStyle(img).opacity;
            if (currentOpacity !== '1') {
                img.style.setProperty('opacity', '1', 'important');
            }
        }
    });
}, 1000); // Verifica a cada 1 segundo

console.log('ESJ Bones - Site carregado com sucesso! 🧢');
