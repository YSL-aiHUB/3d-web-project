// js/ui.js

const UI = {
    elements: {},

    init() {
        // Tự động tạo vùng chứa chữ bay lên nếu chưa có
        let floatingCont = document.getElementById("floating-text-container");
        if (!floatingCont) {
            floatingCont = document.createElement("div");
            floatingCont.id = "floating-text-container";
            document.getElementById("game-container").appendChild(floatingCont);
        }

        this.elements = {
            moneyDisplay: document.querySelector(".money"),
            plateDisplay: document.getElementById("plate"),
            customerOrderUI: document.querySelector(".bubble-order"),
            customerSprite: document.querySelector(".customer-avatar"),
            orderText: document.getElementById("order-text"),
            patienceBar: document.getElementById("patience-bar"),
            workStation: document.getElementById("work-station"),
            floatingContainer: floatingCont
        };
    },

    updateMoney(amount) {
        // Hiển thị tiền theo định dạng 217,8k hoặc số VNĐ
        this.elements.moneyDisplay.innerText = amount.toLocaleString('vi-VN') + "đ";
    },

    updatePlate(items) {
        this.elements.plateDisplay.innerText = items.length === 0 ? "Lấy bánh mì" : items.join(" + ");
    },

    showCustomer(orderName) {
        this.elements.orderText.innerText = `Làm cho chú 1 ổ ${orderName} nha cháu!`;
        this.elements.customerOrderUI.style.display = "block";
        this.elements.customerSprite.style.display = "flex";
        this.elements.customerSprite.classList.add("slide-in-right");
        
        // Reset thanh kiên nhẫn
        this.elements.patienceBar.style.width = "100%";
        this.elements.patienceBar.style.backgroundColor = "#81c784";
    },

    hideCustomer() {
        this.elements.customerOrderUI.style.display = "none";
        this.elements.customerSprite.style.display = "none";
        this.elements.customerSprite.classList.remove("slide-in-right");
    },

    updatePatienceBar(patience) {
        this.elements.patienceBar.style.width = `${patience}%`;
        if (patience < 50) this.elements.patienceBar.style.backgroundColor = "#f6a821"; // Chuyển cam
        if (patience < 20) this.elements.patienceBar.style.backgroundColor = "#f44336"; // Chuyển đỏ
    },

    showFloatingText(msg, type) {
        const el = document.createElement("div");
        el.className = `floating-text fly-up-fade ${type}`;
        el.innerText = msg;
        this.elements.floatingContainer.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    },

    triggerShake() {
        this.elements.workStation.classList.remove("shake");
        void this.elements.workStation.offsetWidth; // Reset animation
        this.elements.workStation.classList.add("shake");
    },

    triggerPop(element) {
        element.classList.remove("pop-click");
        void element.offsetWidth;
        element.classList.add("pop-click");
    }
};
