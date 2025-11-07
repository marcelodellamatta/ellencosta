// Navegação mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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
});

// Formulário de contato removido

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

// Lazy loading para imagens
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
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
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
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

// Corrigir caminhos das imagens de produtos - garante que todas as imagens carreguem
document.addEventListener('DOMContentLoaded', () => {
    const productImages = document.querySelectorAll('#products .product-image img');
    
    productImages.forEach((img, index) => {
        const currentSrc = img.getAttribute('src');
        const fileName = currentSrc.split('/').pop();
        
        // Lista de caminhos alternativos para tentar
        const alternativePaths = [
            `./imagens/${fileName}`,
            `imagens/${fileName}`,
            `./${fileName}`,
            fileName
        ];
        
        let pathIndex = 0;
        let originalOnError = img.onerror;
        
        // Função para tentar o próximo caminho
        const tryNextPath = function() {
            if (pathIndex < alternativePaths.length) {
                const newSrc = alternativePaths[pathIndex];
                console.log(`Tentando carregar imagem ${index + 1}: ${newSrc}`);
                
                // Remove o handler anterior para evitar loops
                img.onerror = null;
                
                // Tenta o próximo caminho
                img.src = newSrc;
                pathIndex++;
                
                // Adiciona novo handler para próxima tentativa
                img.onerror = tryNextPath;
            } else {
                console.error(`Não foi possível carregar a imagem: ${fileName}`);
                // Mantém o handler original se existir
                if (originalOnError) {
                    img.onerror = originalOnError;
                }
            }
        };
        
        // Se a imagem não carregou, tenta caminhos alternativos
        if (!img.complete || img.naturalWidth === 0) {
            // Adiciona handler de erro que tenta caminhos alternativos
            img.onerror = tryNextPath;
        }
        
        // Handler de sucesso
        img.onload = function() {
            console.log(`✓ Imagem carregada: ${img.src}`);
            img.onerror = null; // Remove handler de erro se carregou com sucesso
        };
    });
});

console.log('ESJ Bones - Site carregado com sucesso! 🧢');
