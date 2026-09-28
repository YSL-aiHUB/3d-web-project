// js/logic.js

document.addEventListener("DOMContentLoaded", () => {
    // Trạng thái game
    let money = 0;
    let currentBanhMi = []; // Lưu các nguyên liệu đang làm
    const correctRecipe = ["Bánh Mì", "Pate", "Thịt", "Rau"]; // Công thức chuẩn

    // Lấy các element DOM
    const moneyDisplay = document.getElementById("money-display");
    const plateDisplay = document.getElementById("plate");
    const customerOrder = document.getElementById("customer-order");
    const btnItems = document.querySelectorAll(".btn-item");
    const btnServe = document.getElementById("btn-serve");
    const btnTrash = document.getElementById("btn-trash");

    // Hiển thị khách hàng (giả lập có khách)
    setTimeout(() => {
        customerOrder.classList.remove("hidden");
    }, 1000);

    // Xử lý khi nhấn nguyên liệu
    btnItems.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const item = e.target.getAttribute("data-item");
            currentBanhMi.push(item);
            updatePlate();
        });
    });

    // Cập nhật chữ hiển thị món đang làm
    function updatePlate() {
        if (currentBanhMi.length === 0) {
            plateDisplay.innerText = "Chưa có gì";
        } else {
            plateDisplay.innerText = currentBanhMi.join(" ➡ ");
        }
    }

    // Nút thùng rác (làm sai thì vứt đi làm lại)
    btnTrash.addEventListener("click", () => {
        currentBanhMi = [];
        updatePlate();
    });

    // Xử lý khi giao cho khách
    btnServe.addEventListener("click", () => {
        if (currentBanhMi.length === 0) {
            alert("Bạn chưa làm món gì cả!");
            return;
        }

        // So sánh mảng đang làm với công thức chuẩn
        // Chuyển mảng thành chuỗi để so sánh cho nhanh
        if (JSON.stringify(currentBanhMi) === JSON.stringify(correctRecipe)) {
            // Đúng công thức -> Khách trả tiền
            alert("Khách: Bánh mì ngon lắm! +15,000 VNĐ");
            money += 15000;
            moneyDisplay.innerText = money.toLocaleString('vi-VN');
            
            // Dọn dẹp khay
            currentBanhMi = [];
            updatePlate();
        } else {
            // Sai công thức
            alert("Khách: Ủa tôi đâu có gọi món này? Mất dở!");
        }
    });
});
