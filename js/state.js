// js/state.js

const GameState = {
    money: 0,
    hasFan: false,
    currentBanhMi: [],
    currentOrder: null,
    currentPatience: 100,
    patienceTimer: null,

    // Tải dữ liệu lúc mới vào game
    init() {
        this.money = parseInt(localStorage.getItem("banhmi_money")) || 0;
        this.hasFan = localStorage.getItem("banhmi_fan") === "true";
    },

    // Xử lý tiền
    addMoney(amount) {
        this.money += amount;
        localStorage.setItem("banhmi_money", this.money);
    },

    // Mua đồ
    buyFan(price) {
        if (this.money >= price && !this.hasFan) {
            this.addMoney(-price);
            this.hasFan = true;
            localStorage.setItem("banhmi_fan", "true");
            return true;
        }
        return false;
    },

    // Xử lý nguyên liệu
    addItem(item) {
        this.currentBanhMi.push(item);
    },
    clearBanhMi() {
        this.currentBanhMi = [];
    },

    // Kiểm tra đúng món không
    checkRecipe() {
        if (!this.currentOrder) return false;
        return JSON.stringify(this.currentBanhMi) === JSON.stringify(this.currentOrder.req);
    },

    // Chọn ngẫu nhiên 1 công thức cho khách mới
    getRandomRecipe() {
        const randomIndex = Math.floor(Math.random() * GameData.recipes.length);
        this.currentOrder = GameData.recipes[randomIndex];
        return this.currentOrder;
    }
};
