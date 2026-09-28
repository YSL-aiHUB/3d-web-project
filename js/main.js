// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Khởi tạo State và UI
    GameState.init();
    UI.init();

    // 2. Set up màn hình lần đầu
    UI.updateMoney(GameState.money);
    UI.updateShopButton(GameState.money, GameState.hasFan, GameData.shopItems.fan.price);
    
    // Gọi khách sau 2 giây
    setTimeout(spawnCustomer, 2000);

    // 3. Bắt sự kiện Click nguyên liệu
    document.querySelectorAll(".btn-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            UI.triggerPop(e.target);
            GameState.addItem(e.target.getAttribute("data-item"));
            UI.updatePlate(GameState.currentBanhMi);
        });
    });

    // 4. Bắt sự kiện Vứt đi
    document.getElementById("btn-trash").addEventListener("click", () => {
        GameState.clearBanhMi();
        UI.updatePlate(GameState.currentBanhMi);
    });

    // 5. Bắt sự kiện Giao món
    document.getElementById("btn-serve").addEventListener("click", () => {
        if (!GameState.currentOrder) return;

        if (GameState.checkRecipe()) {
            // ĐÚNG MÓN
            clearInterval(GameState.patienceTimer);
            GameState.addMoney(GameState.currentOrder.price);
            
            // Cập nhật giao diện
            UI.updateMoney(GameState.money);
            UI.updateShopButton(GameState.money, GameState.hasFan, GameData.shopItems.fan.price);
            UI.showFloatingText(`+${GameState.currentOrder.price} VNĐ`, "good");
            
            // Đuổi khách hiện tại
            GameState.clearBanhMi();
            UI.updatePlate(GameState.currentBanhMi);
            UI.hideCustomer();
            
            // Đón khách mới
            setTimeout(spawnCustomer, 1500); 
        } else {
            // SAI MÓN
            UI.triggerShake();
            UI.showFloatingText("Sai món rồi!", "bad");
        }
    });

    // 6. Bắt sự kiện Mua Quạt
    document.getElementById("btn-buy-fan").addEventListener("click", () => {
        const price = GameData.shopItems.fan.price;
        if (GameState.buyFan(price)) {
            UI.updateMoney(GameState.money);
            UI.updateShopButton(GameState.money, GameState.hasFan, price);
            UI.showFloatingText("Đã mua Quạt! Mát rượi", "good");
        }
    });

    // 7. Vòng lặp khách hàng (Game Loop)
    function spawnCustomer() {
        const order = GameState.getRandomRecipe();
        UI.showCustomer(order.name);
        
        GameState.currentPatience = 100;
        const dropRate = GameState.hasFan ? 0.7 : 1.5; 

        clearInterval(GameState.patienceTimer);
        GameState.patienceTimer = setInterval(() => {
            GameState.currentPatience -= dropRate;
            UI.updatePatienceBar(GameState.currentPatience);

            if (GameState.currentPatience <= 0) {
                // Khách hết kiên nhẫn bỏ đi
                clearInterval(GameState.patienceTimer);
                UI.showFloatingText("Khách bỏ đi rồi!", "bad");
                
                UI.hideCustomer();
                GameState.currentOrder = null;
                GameState.clearBanhMi();
                UI.updatePlate(GameState.currentBanhMi);

                setTimeout(spawnCustomer, 3000); 
            }
        }, 100); 
    }
});
