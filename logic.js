// js/logic.js
document.addEventListener("DOMContentLoaded", () => {
    let money = parseInt(localStorage.getItem("banhmi_money")) || 0;
    let currentBanhMi = []; 
    let hasFan = localStorage.getItem("banhmi_fan") === "true";
    
    const recipes = [
        { name: "Bánh mì Đầy Đủ", req: ["Bánh Mì", "Pate", "Thịt", "Rau"], price: 15000 },
        { name: "Bánh mì Không Rau", req: ["Bánh Mì", "Pate", "Thịt"], price: 12000 },
        { name: "Bánh mì Pate Chả", req: ["Bánh Mì", "Pate", "Thịt"], price: 12000 } // Tạm coi Thịt là Chả
    ];
    let currentOrder = null;
    let patienceTimer;
    let currentPatience = 100;

    const moneyDisplay = document.getElementById("money-display");
    const plateDisplay = document.getElementById("plate");
    const customerOrderUI = document.getElementById("customer-order");
    const customerSprite = document.getElementById("customer-sprite");
    const orderText = document.getElementById("order-text");
    const patienceBar = document.getElementById("patience-bar");
    const kitchenArea = document.getElementById("kitchen-area");
    const floatingContainer = document.getElementById("floating-text-container");

    updateMoney(0);
    checkShop();
    setTimeout(spawnCustomer, 2000);

    // Xử lý nút nguyên liệu
    document.querySelectorAll(".btn-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Thêm hiệu ứng ấn nút pop-click
            e.target.classList.remove("pop-click");
            void e.target.offsetWidth; // Trigger reflow để restart animation
            e.target.classList.add("pop-click");

            currentBanhMi.push(e.target.getAttribute("data-item"));
            updatePlate();
        });
    });

    document.getElementById("btn-trash").addEventListener("click", () => {
        currentBanhMi = [];
        updatePlate();
    });

    // Giao món
    document.getElementById("btn-serve").addEventListener("click", () => {
        if (!currentOrder) return;

        if (JSON.stringify(currentBanhMi) === JSON.stringify(currentOrder.req)) {
            // ĐÚNG MÓN
            clearInterval(patienceTimer);
            updateMoney(currentOrder.price);
            showFloatingText(`+${currentOrder.price} VNĐ`, "good");
            
            currentBanhMi = [];
            updatePlate();
            dismissCustomer();
            setTimeout(spawnCustomer, 1500); 
        } else {
            // SAI MÓN
            kitchenArea.classList.remove("shake");
            void kitchenArea.offsetWidth; // Trigger reflow
            kitchenArea.classList.add("shake");
            showFloatingText("Sai món rồi!", "bad");
        }
    });

    function updatePlate() {
        plateDisplay.innerText = currentBanhMi.length === 0 ? "Chưa có gì" : currentBanhMi.join(" ➡ ");
    }

    function dismissCustomer() {
        customerOrderUI.classList.add("hidden");
        customerSprite.classList.add("hidden");
        customerSprite.classList.remove("slide-in-right");
        patienceBar.classList.remove("pulse-danger");
        currentOrder = null;
    }

    // Khách đến
    function spawnCustomer() {
        currentOrder = recipes[Math.floor(Math.random() * recipes.length)];
        orderText.innerText = `💭 Cho 1 ổ: ${currentOrder.name}`;
        
        customerOrderUI.classList.remove("hidden");
        customerSprite.classList.remove("hidden");
        
        // Hiệu ứng khách trượt vào
        customerSprite.classList.add("slide-in-right");
        
        currentPatience = 100;
        patienceBar.style.width = "100%";
        patienceBar.style.backgroundColor = "#4caf50";
        patienceBar.classList.remove("pulse-danger");

        const dropRate = hasFan ? 0.7 : 1.5; 

        clearInterval(patienceTimer);
        patienceTimer = setInterval(() => {
            currentPatience -= dropRate;
            patienceBar.style.width = `${currentPatience}%`;

            if (currentPatience < 50) patienceBar.style.backgroundColor = "#ff9800";
            if (currentPatience < 20) {
                patienceBar.style.backgroundColor = "#f44336";
                patienceBar.classList.add("pulse-danger"); // Nhấp nháy cảnh báo
            }

            if (currentPatience <= 0) {
                // HẾT GIỜ
                clearInterval(patienceTimer);
                showFloatingText("Khách bỏ đi rồi!", "bad");
                
                dismissCustomer();
                currentBanhMi = []; 
                updatePlate();

                setTimeout(spawnCustomer, 3000); 
            }
        }, 100); 
    }

    function updateMoney(amount) {
        money += amount;
        moneyDisplay.innerText = money.toLocaleString('vi-VN');
        localStorage.setItem("banhmi_money", money);
        checkShop();
    }

    function checkShop() {
        const btnFan = document.getElementById("btn-buy-fan");
        if (hasFan) {
            btnFan.innerText = "Đã Mua Quạt ✔️";
            btnFan.disabled = true;
        } else if (money < parseInt(btnFan.getAttribute("data-price"))) {
            btnFan.disabled = true;
        } else {
            btnFan.disabled = false;
        }
    }

    document.getElementById("btn-buy-fan").addEventListener("click", () => {
        const price = parseInt(document.getElementById("btn-buy-fan").getAttribute("data-price"));
        if (money >= price) {
            updateMoney(-price);
            hasFan = true;
            localStorage.setItem("banhmi_fan", "true");
            checkShop();
            showFloatingText("Đã mua Quạt! Mát rượi", "good");
        }
    });

    function showFloatingText(msg, type) {
        const el = document.createElement("div");
        // Gọi class fly-up-fade từ file animations.css
        el.className = `floating-text fly-up-fade ${type}`;
        el.innerText = msg;
        floatingContainer.appendChild(el);
        
        // Xóa element khi hoạt ảnh 1.2s kết thúc
        setTimeout(() => el.remove(), 1200);
    }
});
