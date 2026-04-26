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

/* ===== CONTACT MODAL ===== */
const contactModal = document.getElementById('contactModal');
const contactModalClose = document.getElementById('contactModalClose');

function openContactModal() {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (contactModalClose) contactModalClose.addEventListener('click', closeContactModal);
if (contactModal) contactModal.addEventListener('click', function (e) {
    if (e.target === contactModal) closeContactModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) closeContactModal();
});

/* ===== AUDIT FORM ===== */
const auditBack = document.getElementById('auditBack');
const auditNext = document.getElementById('auditNext');
const auditNav = document.getElementById('auditNav');
const auditPercent = document.getElementById('auditPercent');
const auditSteps = document.querySelectorAll('.audit-step');
const auditFileInput = document.getElementById('auditFile');
const auditFileName = document.getElementById('auditFileName');
let auditCur = 0;

const TG_BOT_TOKEN = '8782883520:AAGADAQIEsfwE0BI9MlA-LQyWSKuJ9flcT4';
const TG_CHAT_ID = '1256835529';

function updateAuditUI() {
    auditSteps.forEach(function (s) { s.classList.remove('active'); });
    var stepEl = document.querySelector('.audit-step[data-step="' + auditCur + '"]');
    if (stepEl) stepEl.classList.add('active');

    var pct = Math.round((auditCur / 6) * 100);
    auditPercent.textContent = pct + '%';

    for (var i = 0; i < 6; i++) {
        var seg = document.getElementById('seg' + i);
        seg.classList.remove('done', 'current');
        if (i < auditCur) seg.classList.add('done');
        else if (i === auditCur) seg.classList.add('current');
    }

    auditBack.style.display = auditCur === 0 ? 'none' : '';
    auditNav.style.display = auditCur >= 6 ? 'none' : '';
    auditNext.textContent = auditCur === 5 ? 'Отправить' : 'Далее';
}

if (auditBack) auditBack.addEventListener('click', function () {
    if (auditCur > 0) { auditCur--; updateAuditUI(); }
});

if (auditNext) auditNext.addEventListener('click', function () {
    if (auditCur === 0) {
        var biz = document.getElementById('auditBusiness').value.trim();
        var consent = document.getElementById('auditConsent').checked;
        if (!biz) { document.getElementById('auditBusiness').classList.add('error'); return; }
        document.getElementById('auditBusiness').classList.remove('error');
        if (!consent) { alert('Пожалуйста, дайте согласие на обработку данных'); return; }
    }
    if (auditCur === 5) {
        sendAuditForm();
        return;
    }
    auditCur++;
    updateAuditUI();
});

if (auditFileInput) auditFileInput.addEventListener('change', function () {
    if (this.files.length > 0) auditFileName.textContent = this.files[0].name;
    else auditFileName.textContent = '';
});

function sendAuditForm() {
    var data = {
        business: document.getElementById('auditBusiness').value.trim(),
        city: document.getElementById('auditCity').value.trim(),
        name: document.getElementById('auditName').value.trim(),
        phone: document.getElementById('auditPhone').value.trim(),
        avito: document.getElementById('auditAvito').value.trim(),
        file: auditFileInput.files.length > 0 ? auditFileInput.files[0].name : 'Нет',
        comment: document.getElementById('auditComment').value.trim()
    };

    var msg = '📋 <b>Новая заявка на аудит</b>\n\n'
        + '🏢 <b>Бизнес:</b> ' + data.business + '\n'
        + '📍 <b>Город:</b> ' + (data.city || '—') + '\n'
        + '👤 <b>Имя:</b> ' + (data.name || '—') + '\n'
        + '📞 <b>Телефон:</b> ' + (data.phone || '—') + '\n'
        + '🔗 <b>Авито:</b> ' + (data.avito || '—') + '\n'
        + '📎 <b>Файл:</b> ' + data.file + '\n'
        + '💬 <b>Комментарий:</b> ' + (data.comment || '—');

    if (TG_BOT_TOKEN && TG_CHAT_ID) {
        fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: msg,
                parse_mode: 'HTML'
            })
        }).then(function (r) { return r.json(); }).then(function (d) {
            if (!d.ok) console.error('Telegram error:', d);
            if (auditFileInput.files.length > 0) {
                var fd = new FormData();
                fd.append('chat_id', TG_CHAT_ID);
                fd.append('document', auditFileInput.files[0]);
                fd.append('caption', '📎 Файл к заявке: ' + data.business);
                fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendDocument', {
                    method: 'POST',
                    body: fd
                }).then(function (r2) { return r2.json(); }).then(function (d2) {
                    if (!d2.ok) console.error('Telegram file error:', d2);
                }).catch(function (e2) { console.error('Telegram file fetch error:', e2); });
            }
        }).catch(function (e) { console.error('Telegram fetch error:', e); });
    }

    auditCur = 6;
    updateAuditUI();
}

updateAuditUI();

/* ===== QUICK CONTACT FORM ===== */
var qfSubmit = document.getElementById('qfSubmit');
if (qfSubmit) qfSubmit.addEventListener('click', function () {
    var name = document.getElementById('qfName').value.trim();
    var phone = document.getElementById('qfPhone').value.trim();
    var email = document.getElementById('qfEmail').value.trim();
    var niche = document.getElementById('qfNiche').value.trim();
    if (!name && !phone) { document.getElementById('qfName').classList.add('error'); return; }
    document.getElementById('qfName').classList.remove('error');

    var msg = '📩 <b>Новая заявка с сайта</b>\n\n'
        + '👤 <b>Имя:</b> ' + (name || '—') + '\n'
        + '📞 <b>Телефон:</b> ' + (phone || '—') + '\n'
        + '📧 <b>Email:</b> ' + (email || '—') + '\n'
        + '🏢 <b>Сфера деятельности:</b> ' + (niche || '—');

    if (TG_BOT_TOKEN && TG_CHAT_ID) {
        fetch('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg, parse_mode: 'HTML' })
        }).catch(function () {});
    }

    document.getElementById('qfSubmit').style.display = 'none';
    document.querySelector('.quick-form-fields').style.display = 'none';
    document.querySelector('.quick-form-desc').style.display = 'none';
    document.getElementById('qfSuccess').style.display = 'block';
});
