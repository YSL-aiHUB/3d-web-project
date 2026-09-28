// js/ui.js

const UI = {
    elements: {},

    // Gom các thẻ HTML lại 1 chỗ
    init() {
        this.elements = {
            moneyDisplay: document.getElementById("money-display"),
            plateDisplay: document.getElementById("plate"),
            customerOrderUI: document.getElementById("customer-order"),
            customerSprite: document.getElementById("customer-sprite"),
            orderText: document.getElementById("order-text"),
            patienceBar: document.getElementById("patience-bar"),
            kitchenArea: document.getElementById("kitchen-area"),
            floatingContainer: document.getElementById("floating-text-container"),
            btnFan: document.getElementById("btn-buy-fan")
        };
    },

    updateMoney(amount) {
        this.elements.moneyDisplay.innerText = amount.toLocaleString('vi-VN');
    },

    updatePlate(items) {
        this.elements.plateDisplay.innerText = items.length === 0 ? "Chưa có gì" : items.join(" ➡ ");
    },

    updateShopButton(money, hasFan, fanPrice) {
        if (hasFan) {
            this.elements.btnFan.innerText = "Đã Mua Quạt ✔️";
            this.elements.btnFan.disabled = true;
        } else if (money < fanPrice) {
            this.elements.btnFan.disabled = true;
        } else {
            this.elements.btnFan.disabled = false;
        }
    },

    showCustomer(orderName) {
        this.elements.orderText.innerText = `💭 Cho 1 ổ: ${orderName}`;
        this.elements.customerOrderUI.classList.remove("hidden");
        this.elements.customerSprite.classList.remove("hidden");
        this.elements.customerSprite.classList.add("slide-in-right");
        
        this.elements.patienceBar.style.width = "100%";
        this.elements.patienceBar.style.backgroundColor = "#4caf50";
        this.elements.patienceBar.classList.remove("pulse-danger");
    },

    hideCustomer() {
        this.elements.customerOrderUI.classList.add("hidden");
        this.elements.customerSprite.classList.add("hidden");
        this.elements.customerSprite.classList.remove("slide-in-right");
        this.elements.patienceBar.classList.remove("pulse-danger");
    },

    updatePatienceBar(patience) {
        this.elements.patienceBar.style.width = `${patience}%`;
        if (patience < 50) this.elements.patienceBar.style.backgroundColor = "#ff9800";
        if (patience < 20) {
            this.elements.patienceBar.style.backgroundColor = "#f44336";
            this.elements.patienceBar.classList.add("pulse-danger");
        }
    },

    showFloatingText(msg, type) {
        const el = document.createElement("div");
        el.className = `floating-text fly-up-fade ${type}`;
        el.innerText = msg;
        this.elements.floatingContainer.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    },

    triggerShake() {
        this.elements.kitchenArea.classList.remove("shake");
        void this.elements.kitchenArea.offsetWidth;
        this.elements.kitchenArea.classList.add("shake");
    },

    triggerPop(element) {
        element.classList.remove("pop-click");
        void element.offsetWidth;
        element.classList.add("pop-click");
    }
};
