// 1. LOGIC PRELOADER (CHỜ SPLINE TẢI XONG)
const preloader = document.getElementById('preloader');
const splineViewer = document.getElementById('spline-3d');

// Nếu Spline tải thành công, ẩn Preloader
if(splineViewer) {
    splineViewer.addEventListener('load', () => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        playHeroAnimations(); // Bắt đầu chạy animation chữ
    });
}

// Fallback: Lỡ mạng quá yếu, sau 6 giây tự động tắt preloader để người dùng xem web
setTimeout(() => {
    if (preloader.style.opacity !== '0') {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        playHeroAnimations();
    }
}, 6000);

// 2. LENIS SMOOTH SCROLL
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 3. CUSTOM CURSOR (Bỏ qua nếu là điện thoại)
if (window.matchMedia("(any-hover: hover)").matches) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        setTimeout(() => {
            cursorFollower.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        }, 40);
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorFollower.style.width = '60px';
            cursorFollower.style.height = '60px';
            cursorFollower.style.background = 'rgba(0, 206, 201, 0.1)';
            cursor.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        target.addEventListener('mouseleave', () => {
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.background = 'transparent';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// 4. GSAP ANIMATIONS
gsap.registerPlugin(ScrollTrigger);

function playHeroAnimations() {
    gsap.from(".navbar", { y: -100, duration: 1, ease: "power3.out" });
    gsap.from(".animate-hero", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out" });
}

gsap.from(".animate-header", { scrollTrigger: { trigger: ".features", start: "top 85%" }, y: 40, opacity: 0, duration: 1 });
gsap.from(".card-3d-wrapper", { scrollTrigger: { trigger: ".features", start: "top 80%" }, y: 80, opacity: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" });

// 5. 3D TILT & GLARE EFFECT
const cards = document.querySelectorAll('.card-3d');

cards.forEach(card => {
    const glare = card.querySelector('.glare');

    const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${-rotateY}px ${rotateX}px 25px rgba(0,0,0,0.5)`;

        glare.style.opacity = '1';
        glare.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    const handleLeave = () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        card.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`;
        glare.style.opacity = '0';
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('touchmove', handleMove, {passive: true});
    card.addEventListener('touchend', handleLeave);
});
