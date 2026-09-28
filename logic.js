document.addEventListener("DOMContentLoaded", () => {
    // 1. Quản lý trạng thái (Data/State)
    // Lấy tiền từ LocalStorage, nếu chơi lần đầu thì = 0
    let money = parseInt(localStorage.getItem("banhmi_money")) || 0;
    let currentBanhMi = []; 
    let hasFan = localStorage.getItem("banhmi_fan") === "true"; // Đã mua quạt chưa?
    
    // Các công thức (sau này có thể random)
    const recipes = [
        { name: "Bánh mì Đầy Đủ", req: ["Bánh Mì", "Pate", "Thịt", "Rau"], price: 15000 },
        { name: "Bánh mì Không Rau", req: ["Bánh Mì", "Pate", "Thịt"], price: 12000 }
    ];
    let currentOrder = null;

    // Timer cho khách
    let patienceTimer;
    let currentPatience = 100;

    // DOM Elements
    const moneyDisplay = document.getElementById("money-display");
    const plateDisplay = document.getElementById("plate");
    const customerOrderUI = document.getElementById("customer-order");
    const customerSprite = document.getElementById("customer-sprite");
    const orderText = document.getElementById("order-text");
    const patienceBar = document.getElementById("patience-bar");
    const kitchenArea = document.getElementById("kitchen-area");
    const floatingContainer = document.getElementById("floating-text-container");

    // Init Game
    updateMoney(0);
    checkShop();
    setTimeout(spawnCustomer, 2000); // Đợi 2s rồi gọi khách đầu tiên

    // --- LOGIC BẾP & LÀM MÓN ---
    document.querySelectorAll(".btn-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentBanhMi.push(e.target.getAttribute("data-item"));
            updatePlate();
        });
    });

    document.getElementById("btn-trash").addEventListener("click", () => {
        currentBanhMi = [];
        updatePlate();
    });

    document.getElementById("btn-serve").addEventListener("click", () => {
        if (!currentOrder) return; // Không có khách thì không giao

        if (JSON.stringify(currentBanhMi) === JSON.stringify(currentOrder.req)) {
            // ĐÚNG MÓN
            clearInterval(patienceTimer);
            updateMoney(currentOrder.price);
            showFloatingText(`+${currentOrder.price} VNĐ`, "good");
            
            // Dọn khay, đuổi khách cũ, đón khách mới
            currentBanhMi = [];
            updatePlate();
            customerOrderUI.classList.add("hidden");
            customerSprite.classList.add("hidden");
            currentOrder = null;
            
            setTimeout(spawnCustomer, 1500); // 1.5s sau khách mới tới
        } else {
            // SAI MÓN
            kitchenArea.classList.add("shake");
            setTimeout(() => kitchenArea.classList.remove("shake"), 500);
            showFloatingText("Sai món rồi!", "bad");
        }
    });

    function updatePlate() {
        plateDisplay.innerText = currentBanhMi.length === 0 ? "Chưa có gì" : currentBanhMi.join(" ➡ ");
    }

    // --- LOGIC KHÁCH HÀNG ---
    function spawnCustomer() {
        // Random 1 công thức trong mảng recipes
        currentOrder = recipes[Math.floor(Math.random() * recipes.length)];
        orderText.innerText = `💭 Cho 1 ổ: ${currentOrder.name}`;
        
        customerOrderUI.classList.remove("hidden");
        customerSprite.classList.remove("hidden");
        
        // Reset thanh kiên nhẫn
        currentPatience = 100;
        patienceBar.style.width = "100%";
        patienceBar.style.backgroundColor = "#4caf50";

        // Tốc độ trừ kiên nhẫn. Nếu có quạt thì khách chờ lâu hơn
        const dropRate = hasFan ? 0.7 : 1.5; 

        clearInterval(patienceTimer);
        patienceTimer = setInterval(() => {
            currentPatience -= dropRate;
            patienceBar.style.width = `${currentPatience}%`;

            if (currentPatience < 50) patienceBar.style.backgroundColor = "#ff9800"; // Cam
            if (currentPatience < 20) patienceBar.style.backgroundColor = "#f44336"; // Đỏ

            if (currentPatience <= 0) {
                // HẾT GIỜ - Khách bỏ đi
                clearInterval(patienceTimer);
                showFloatingText("Khách bỏ đi rồi!", "bad");
                
                customerOrderUI.classList.add("hidden");
                customerSprite.classList.add("hidden");
                currentOrder = null;
                currentBanhMi = []; // Bỏ luôn bánh đang làm
                updatePlate();

                setTimeout(spawnCustomer, 3000); // 3s sau khách mới tới
            }
        }, 100); // Cứ 0.1s trừ 1 lần
    }

    // --- LOGIC HỆ THỐNG (Tiền, Cửa hàng, UI) ---
    function updateMoney(amount) {
        money += amount;
        moneyDisplay.innerText = money.toLocaleString('vi-VN');
        localStorage.setItem("banhmi_money", money); // Lưu tiền vào trình duyệt
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
            showFloatingText("Đã mua Quạt! Khách sẽ kiên nhẫn hơn", "good");
        }
    });

    function showFloatingText(msg, type) {
        const el = document.createElement("div");
        el.className = `floating-text ${type}`;
        el.innerText = msg;
        floatingContainer.appendChild(el);
        // Xóa element sau khi animation kết thúc (1.5s)
        setTimeout(() => el.remove(), 1500);
    }
});
