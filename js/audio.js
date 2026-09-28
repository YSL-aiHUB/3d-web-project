// js/audio.js

document.addEventListener("DOMContentLoaded", () => {
    const radioAudio = document.getElementById("bg-radio");
    const btnToggle = document.getElementById("btn-radio-toggle");
    const radioStatus = document.getElementById("radio-status");

    let isPlaying = false;

    // Giảm âm lượng xuống một chút để giống nhạc nền vỉa hè
    radioAudio.volume = 0.4; 

    btnToggle.addEventListener("click", () => {
        if (isPlaying) {
            radioAudio.pause();
            btnToggle.innerText = "Bật Nhạc";
            radioStatus.innerText = "Đang tắt...";
            isPlaying = false;
        } else {
            radioAudio.play().then(() => {
                btnToggle.innerText = "Tắt Nhạc";
                radioStatus.innerText = "🎵 Đang phát (Lofi)...";
                isPlaying = true;
            }).catch(error => {
                console.error("Không thể phát nhạc:", error);
                radioStatus.innerText = "Lỗi tải nhạc!";
            });
        }
    });
});
