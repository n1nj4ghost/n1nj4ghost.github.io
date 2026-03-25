// ===== Particle Background =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
});

// ===== Typewriter Effect =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'OSCP Certified Pentester',
    'Red Team Operator',
    'Bug Bounty Hunter',
    'Deputy Manager @ Deloitte',
    'Security Consultant',
    'Ethical Hacker'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewrite() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
    }

    setTimeout(typewrite, speed);
}
typewrite();

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;

        const rect = counter.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        counter.dataset.animated = 'true';
        const target = parseInt(counter.dataset.count);
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 40);
    });
}

// ===== Scroll Reveal (Intersection Observer) =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars when visible
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                const width = fill.dataset.width;
                fill.style.width = width + '%';
            });

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Also observe skill bars container
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.skill-fill').forEach(fill => {
                    setTimeout(() => {
                        fill.style.width = fill.dataset.width + '%';
                    }, 300);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
}

// Counter animation on scroll
window.addEventListener('scroll', animateCounters);
animateCounters();

// ===== Smooth transition for all animated elements =====
document.querySelectorAll('[data-aos]').forEach((el, index) => {
    el.style.transitionDelay = `${index % 6 * 0.1}s`;
    el.style.transition = `opacity 0.6s ease ${index % 6 * 0.1}s, transform 0.6s ease ${index % 6 * 0.1}s`;
});
