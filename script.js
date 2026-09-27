// 1. KHỞI TẠO LENIS (SMOOTH SCROLLING)
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. HIỆU ỨNG GSAP (SCROLL TRIGGER)
gsap.registerPlugin(ScrollTrigger);

// Navbar xuất hiện
gsap.from(".navbar", { y: -100, duration: 1, ease: "power3.out" });

// Hero section
gsap.from(".animate-hero", {
    y: 50, opacity: 0, duration: 1.2,
    stagger: 0.2, ease: "power4.out"
});

// Chữ tính năng xuất hiện
gsap.from(".animate-header", {
    scrollTrigger: { trigger: ".features", start: "top 80%" },
    y: 40, opacity: 0, duration: 1
});

// Các thẻ 3D bay từ dưới lên
gsap.from(".card-3d-wrapper", {
    scrollTrigger: { trigger: ".features", start: "top 75%" },
    y: 100, opacity: 0, duration: 1,
    stagger: 0.2, ease: "back.out(1.5)"
});

// 3. LOGIC HIỆU ỨNG TILT 3D (TƯƠNG TÁC CHUỘT/CẢM ỨNG)
const cards = document.querySelectorAll('.card-3d');

cards.forEach(card => {
    // Khi rê chuột hoặc di ngón tay trên thẻ
    const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        // Hỗ trợ cả chuột (clientX) và cảm ứng điện thoại (touches[0].clientX)
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const x = clientX - rect.left; // Tọa độ X trong thẻ
        const y = clientY - rect.top;  // Tọa độ Y trong thẻ
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Tính toán góc nghiêng (tối đa xoay 15 độ)
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Đổi hướng bóng đổ để tăng độ chân thực
        card.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(0,0,0,0.6)`;
    };

    // Phục hồi thẻ về vị trí thẳng khi thả tay/chuột ra
    const handleLeave = () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        card.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`;
    };

    // Sự kiện cho Máy tính (Chuột)
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    
    // Sự kiện cho Điện thoại (Cảm ứng màn hình)
    card.addEventListener('touchmove', handleMove);
    card.addEventListener('touchend', handleLeave);
});
