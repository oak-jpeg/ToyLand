// ตัวแปรสำหรับเก็บข้อมูลตะกร้าสินค้า
let cart = [];

// โหลดข้อมูลตะกร้าสินค้าจาก LocalStorage เมื่อโหลดเพจ
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // ตรวจสอบว่าอยู่ในหน้าตะกร้าสินค้าหรือไม่
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
    
    // ตรวจสอบว่าอยู่ในหน้าชำระเงินหรือไม่
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();
        setupCheckoutForm();
    }
});

// ฟังก์ชันโหลดข้อมูลตะกร้าสินค้าจาก LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('toylandCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// ฟังก์ชันบันทึกข้อมูลตะกร้าสินค้าลงใน LocalStorage
function saveCart() {
    localStorage.setItem('toylandCart', JSON.stringify(cart));
    updateCartCount();
}

// ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    // นับจำนวนสินค้าทั้งหมดในตะกร้า
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // อัปเดตจำนวนสินค้าในทุกจุดที่แสดงบนเว็บไซต์
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        
        // แสดง/ซ่อนจำนวนสินค้าตามความเหมาะสม
        if (totalItems > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// ฟังก์ชันเพิ่มสินค้าลงตะกร้า
function addToCart(productId, quantity = 1) {
    // หาข้อมูลสินค้า
    const product = findProductById(productId);
    if (!product) return;
    
    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าอยู่แล้วหรือไม่
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // ถ้ามีสินค้านี้อยู่แล้ว ให้เพิ่มจำนวน
        cart[existingItemIndex].quantity += quantity;
    } else {
        // ถ้ายังไม่มีสินค้านี้ ให้เพิ่มสินค้าใหม่
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // บันทึกข้อมูลตะกร้าสินค้า
    saveCart();
}

// ฟังก์ชันลบสินค้าออกจากตะกร้า
function removeFromCart(productId) {
    // กรองสินค้าที่ต้องการลบออกจากตะกร้า
    cart = cart.filter(item => item.id !== productId);
    
    // บันทึกข้อมูลตะกร้าสินค้า
    saveCart();
    
    // อัปเดตหน้าตะกร้าสินค้า
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า
function updateCartItemQuantity(productId, quantity) {
    // หาตำแหน่งของสินค้าในตะกร้า
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (quantity > 0) {
            // อัปเดตจำนวนสินค้า
            cart[itemIndex].quantity = quantity;
        } else {
            // ลบสินค้าออกจากตะกร้าหากจำนวนน้อยกว่าหรือเท่ากับ 0
            cart.splice(itemIndex, 1);
        }
        
        // บันทึกข้อมูลตะกร้าสินค้า
        saveCart();
        
        // อัปเดตหน้าตะกร้าสินค้า
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
    }
}

// ฟังก์ชันคำนวณราคารวมทั้งหมดในตะกร้า
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ฟังก์ชันล้างตะกร้าสินค้า
function clearCart() {
    cart = [];
    saveCart();
}

// ฟังก์ชันแสดงรายการสินค้าในตะกร้า
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartContainer || !cartSummary) return;
    
    if (cart.length === 0) {
        // ถ้าตะกร้าว่าง
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>ตะกร้าสินค้าของคุณว่างเปล่า</h2>
                <p>กลับไปเลือกซื้อสินค้าเพื่อเพิ่มสินค้าลงตะกร้า</p>
                <a href="index.html" class="btn">กลับไปช้อปปิ้ง</a>
            </div>
        `;
        cartSummary.innerHTML = '';
    } else {
        // สร้าง HTML สำหรับแสดงรายการสินค้าในตะกร้า
        let cartItemsHTML = '';
        
        cart.forEach(item => {
            cartItemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">
                        ฿${(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartContainer.innerHTML = cartItemsHTML;
        
        // คำนวณราคารวม
        const subtotal = calculateTotal();
        const shipping = subtotal > 1000 ? 0 : 50; // ฟรีค่าจัดส่งสำหรับคำสั่งซื้อมากกว่า 1,000 บาท
        const total = subtotal + shipping;
        
        // สร้าง HTML สำหรับแสดงสรุปราคา
        cartSummary.innerHTML = `
            <h3>สรุปคำสั่งซื้อ</h3>
            <div class="summary-row">
                <span>ราคาสินค้ารวม</span>
                <span>฿${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>ค่าจัดส่ง</span>
                <span>${shipping === 0 ? 'ฟรี' : '฿' + shipping.toLocaleString()}</span>
            </div>
            <div class="summary-row total">
                <span>ราคารวมทั้งสิ้น</span>
                <span>฿${total.toLocaleString()}</span>
            </div>
            <a href="checkout.html" class="btn checkout-btn">ดำเนินการชำระเงิน</a>
        `;
        
        // เพิ่ม Event Listener สำหรับปุ่มเพิ่ม/ลด/ลบสินค้า
        setupCartEventListeners();
    }
}

// ฟังก์ชันตั้งค่า Event Listener สำหรับปุ่มในหน้าตะกร้าสินค้า
function setupCartEventListeners() {
    // ปุ่มลบสินค้า
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
    
    // ปุ่มลดจำนวนสินค้า
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                const newQuantity = cart[itemIndex].quantity - 1;
                updateCartItemQuantity(productId, newQuantity);
            }
        });
    });
    
    // ปุ่มเพิ่มจำนวนสินค้า
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                const newQuantity = cart[itemIndex].quantity + 1;
                updateCartItemQuantity(productId, newQuantity);
            }
        });
    });
    
    // ช่องกรอกจำนวนสินค้า
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            if (!isNaN(newQuantity) && newQuantity > 0) {
                updateCartItemQuantity(productId, newQuantity);
            } else {
                this.value = 1;
                updateCartItemQuantity(productId, 1);
            }
        });
    });
}

// ฟังก์ชันแสดงสรุปรายการสั่งซื้อในหน้าชำระเงิน
function renderCheckoutSummary() {
    const checkoutSummary = document.getElementById('order-summary');
    if (!checkoutSummary) return;
    
    // คำนวณราคารวม
    const subtotal = calculateTotal();
    const shipping = subtotal > 1000 ? 0 : 50; // ฟรีค่าจัดส่งสำหรับคำสั่งซื้อมากกว่า 1,000 บาท
    const total = subtotal + shipping;
    
    let itemsHTML = '';
    cart.forEach(item => {
        itemsHTML += `
            <div class="summary-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <div class="item-name">${item.name}</div>
                <div class="item-price">฿${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `;
    });
    
    checkoutSummary.innerHTML = `
        <h3>สรุปคำสั่งซื้อ</h3>
        <div class="summary-items">
            ${itemsHTML}
        </div>
        <div class="summary-totals">
            <div class="summary-row">
                <span>ราคาสินค้ารวม</span>
                <span>฿${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>ค่าจัดส่ง</span>
                <span>${shipping === 0 ? 'ฟรี' : '฿' + shipping.toLocaleString()}</span>
            </div>
            <div class="summary-row total">
                <span>ราคารวมทั้งสิ้น</span>
                <span>฿${total.toLocaleString()}</span>
            </div>
        </div>
    `;
}

// ฟังก์ชันตั้งค่าฟอร์มชำระเงิน
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ตรวจสอบความถูกต้องของข้อมูล
        if (validateCheckoutForm()) {
            // สร้างข้อมูลคำสั่งซื้อ
            const order = {
                items: cart,
                total: calculateTotal(),
                shipping: calculateTotal() > 1000 ? 0 : 50,
                customer: {
                    name: document.getElementById('fullname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    province: document.getElementById('province').value,
                    postalCode: document.getElementById('postal-code').value
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                orderDate: new Date().toISOString(),
                orderNumber: generateOrderNumber()
            };
            
            // บันทึกคำสั่งซื้อลงใน LocalStorage
            saveOrder(order);
            
            // ล้างตะกร้าสินค้า
            clearCart();
            
            // ไปยังหน้ายืนยันการสั่งซื้อ
            window.location.href = 'confirmation.html';
        }
    });
}

// ฟังก์ชันตรวจสอบความถูกต้องของฟอร์มชำระเงิน
function validateCheckoutForm() {
    // ตัวอย่างการตรวจสอบอย่างง่าย (ในเว็บไซต์จริงควรมีการตรวจสอบที่ซับซ้อนกว่านี้)
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const province = document.getElementById('province').value.trim();
    const postalCode = document.getElementById('postal-code').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    
    let isValid = true;
    let errorMessage = '';
    
    if (!fullname) {
        isValid = false;
        errorMessage += 'กรุณากรอกชื่อ-นามสกุล\n';
    }
    
    if (!email || !email.includes('@')) {
        isValid = false;
        errorMessage += 'กรุณากรอกอีเมลให้ถูกต้อง\n';
    }
    
    if (!phone || phone.length < 9) {
        isValid = false;
        errorMessage += 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง\n';
    }
    
    if (!address) {
        isValid = false;
        errorMessage += 'กรุณากรอกที่อยู่\n';
    }
    
    if (!province) {
        isValid = false;
        errorMessage += 'กรุณากรอกจังหวัด\n';
    }
    
    if (!postalCode || postalCode.length !== 5) {
        isValid = false;
        errorMessage += 'กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง\n';
    }
    
    if (!paymentMethod) {
        isValid = false;
        errorMessage += 'กรุณาเลือกวิธีการชำระเงิน\n';
    }
    
    if (!isValid) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน:\n' + errorMessage);
    }
    
    return isValid;
}

// ฟังก์ชันสร้างหมายเลขคำสั่งซื้อ
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `TL${year}${month}${day}${random}`;
}

// ฟังก์ชันบันทึกคำสั่งซื้อลงใน LocalStorage
function saveOrder(order) {
    let orders = [];
    const savedOrders = localStorage.getItem('toylandOrders');
    
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    orders.push(order);
    localStorage.setItem('toylandOrders', JSON.stringify(orders));
    localStorage.setItem('toylandLatestOrder', JSON.stringify(order));
}

// ฟังก์ชันแสดงข้อมูลการยืนยันการสั่งซื้อ
function renderOrderConfirmation() {
    const confirmationContainer = document.getElementById('confirmation-details');
    if (!confirmationContainer) return;
    
    const latestOrder = localStorage.getItem('toylandLatestOrder');
    if (!latestOrder) {
        window.location.href = 'index.html';
        return;
    }
    
    const order = JSON.parse(latestOrder);
    
    confirmationContainer.innerHTML = `
        <div class="confirmation-header">
            <i class="fas fa-check-circle"></i>
            <h2>ขอบคุณสำหรับคำสั่งซื้อ!</h2>
            <p>คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว</p>
        </div>
        <div class="order-details">
            <div class="order-number">
                <h3>หมายเลขคำสั่งซื้อ: ${order.orderNumber}</h3>
                <p>วันที่สั่งซื้อ: ${new Date(order.orderDate).toLocaleDateString('th-TH')}</p>
            </div>
            <div class="shipping-details">
                <h3>ข้อมูลการจัดส่ง</h3>
                <p>${order.customer.name}</p>
                <p>${order.customer.address}</p>
                <p>${order.customer.province} ${order.customer.postalCode}</p>
                <p>โทร: ${order.customer.phone}</p>
                <p>อีเมล: ${order.customer.email}</p>
            </div>
            <div class="payment-details">
                <h3>วิธีการชำระเงิน</h3>
                <p>${getPaymentMethodText(order.paymentMethod)}</p>
            </div>
            <div class="order-summary">
                <h3>สรุปคำสั่งซื้อ</h3>
                <table>
                    <thead>
                        <tr>
                            <th>สินค้า</th>
                            <th>จำนวน</th>
                            <th>ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>฿${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2">ราคาสินค้ารวม</td>
                            <td>฿${order.total.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="2">ค่าจัดส่ง</td>
                            <td>${order.shipping === 0 ? 'ฟรี' : '฿' + order.shipping.toLocaleString()}</td>
                        </tr>
                        <tr class="total">
                            <td colspan="2">ราคารวมทั้งสิ้น</td>
                            <td>฿${(order.total + order.shipping).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="confirmation-footer">
            <a href="index.html" class="btn">กลับไปช้อปปิ้งต่อ</a>
        </div>
    `;
}

// ฟังก์ชันแปลงรหัสวิธีการชำระเงินเป็นข้อความ
function getPaymentMethodText(paymentMethod) {
    const methods = {
        'credit-card': 'บัตรเครดิต/เดบิต',
        'bank-transfer': 'โอนเงินผ่านธนาคาร',
        'prompt-pay': 'พร้อมเพย์',
        'cod': 'เก็บเงินปลายทาง'
    };
    
    return methods[paymentMethod] || paymentMethod;
}

// ตรวจสอบว่าอยู่ในหน้ายืนยันการสั่งซื้อหรือไม่และแสดงข้อมูลการยืนยัน
if (window.location.pathname.includes('confirmation.html')) {
    document.addEventListener('DOMContentLoaded', renderOrderConfirmation);
}