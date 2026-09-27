// 1. LENIS SMOOTH SCROLL
const lenis = new Lenis({ duration: 1.5, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. CUSTOM CURSOR LOGIC
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target');

document.addEventListener('mousemove', (e) => {
    // Di chuyển chấm nhỏ mượt
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    // Di chuyển vòng tròn ngoài có độ trễ
    setTimeout(() => {
        cursorFollower.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    }, 50);
});

// Phóng to con trỏ khi chạm vào nút hoặc thẻ 3D
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

// 3. GSAP ANIMATIONS
gsap.registerPlugin(ScrollTrigger);
gsap.from(".navbar", { y: -100, duration: 1, ease: "power3.out" });
gsap.from(".animate-hero", { y: 50, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power4.out", pointerEvents: "auto" });
gsap.from(".animate-header", { scrollTrigger: { trigger: ".features", start: "top 80%" }, y: 40, opacity: 0, duration: 1 });
gsap.from(".card-3d-wrapper", { scrollTrigger: { trigger: ".features", start: "top 75%" }, y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)" });

// 4. 3D TILT & GLARE EFFECT
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
        
        // Tính góc xoay
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(0,0,0,0.6)`;

        // Di chuyển vệt sáng ánh sáng (Glare)
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
    card.addEventListener('touchmove', handleMove);
    card.addEventListener('touchend', handleLeave);
});
