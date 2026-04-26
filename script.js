/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== MOBILE MENU ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

/* ===== SCROLL ANIMATIONS ===== */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ===== CASES CAROUSEL (16 slides) ===== */
const ncTrack = document.getElementById('ncTrack');
const ncDotsEl = document.getElementById('ncDots');
const ncPrev = document.getElementById('ncPrev');
const ncNext = document.getElementById('ncNext');
const ncCtop = document.getElementById('ncCtop');
const ncSlides = ncTrack ? ncTrack.querySelectorAll('.nc-slide') : [];
const ncN = ncSlides.length;
let ncCur = 0;

if (ncN > 0) {
    ncSlides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'nc-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => ncGo(i));
        ncDotsEl.appendChild(d);
    });
}

function ncGo(n) {
    ncCur = n;
    ncTrack.style.transform = `translateX(-${ncCur * 100}%)`;
    document.querySelectorAll('.nc-dot').forEach((d, i) => d.classList.toggle('active', i === ncCur));
    if (ncCtop) ncCtop.textContent = `${ncCur + 1} / ${ncN}`;
    if (ncPrev) ncPrev.disabled = ncCur === 0;
    if (ncNext) ncNext.disabled = ncCur === ncN - 1;
}

if (ncPrev) ncPrev.addEventListener('click', () => ncCur > 0 && ncGo(ncCur - 1));
if (ncNext) ncNext.addEventListener('click', () => ncCur < ncN - 1 && ncGo(ncCur + 1));

/* Touch swipe for new carousel */
let ncSx = 0;
if (ncTrack) {
    ncTrack.parentElement.addEventListener('touchstart', e => { ncSx = e.touches[0].clientX; }, { passive: true });
    ncTrack.parentElement.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - ncSx;
        if (dx < -40 && ncCur < ncN - 1) ncGo(ncCur + 1);
        if (dx > 40 && ncCur > 0) ncGo(ncCur - 1);
    }, { passive: true });
}

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

/* Also open lightbox on clicking screenshots directly */
document.querySelectorAll('.step-screenshot img').forEach(img => {
    img.addEventListener('click', () => {
        const parent = img.closest('.step-screenshot');
        const src = parent.dataset.screenshot;
        const title = parent.closest('.step-content').querySelector('h3').textContent;
        openLightbox(src, title);
    });
});

/* Case images open in lightbox too */
document.querySelectorAll('.case-images img').forEach(img => {
    img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
    });
});

/* ===== PARTICLES ===== */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['rgba(139,92,246,0.3)', 'rgba(6,182,212,0.2)', 'rgba(168,85,247,0.15)'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
    }
}
createParticles();

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = navbar.offsetHeight + 10;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
