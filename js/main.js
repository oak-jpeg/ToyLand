// เมื่อ DOM โหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', function() {
    // โหลดสินค้าลงในหน้าหลัก
    loadProducts();
    
    // โหลดสินค้าลดราคา
    loadSaleProducts();
    
    // ตั้งค่าปุ่มกรอง
    setupFilterButtons();
    
    // ตั้งค่าปุ่มเพิ่มสินค้าลงตะกร้า
    setupAddToCartButtons();
    
    // ตรวจสอบว่าอยู่ในหน้ารายละเอียดสินค้าหรือไม่
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetail();
    }
    
    // อัปเดตจำนวนสินค้าในตะกร้า
    updateCartCount();
});

// ฟังก์ชันโหลดสินค้าทั้งหมด
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    let productsHTML = '';
    
    // แสดงสินค้าจากอาร์เรย์ products ที่อยู่ในไฟล์ products.js
    products.slice(0, 8).forEach(product => {
        productsHTML += `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    ${product.discount ? `<div class="sale-badge">ลดราคา</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)} | ${product.ageRange}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">฿${product.price.toLocaleString()}</span>
                        ${product.discount ? `<span class="original-price">฿${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = productsHTML;
    
    // เพิ่ม Event Listener สำหรับคลิกที่การ์ดสินค้า
    setupProductCardLinks();
}

// ฟังก์ชันตั้งค่าลิงก์การ์ดสินค้า
function setupProductCardLinks() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // ไม่นำไปที่หน้ารายละเอียดหากคลิกที่ปุ่ม
            if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                const productId = this.dataset.id;
                window.location.href = `product-details.html?id=${productId}`;
            }
        });
    });
}

// ฟังก์ชันโหลดรายละเอียดสินค้า
function loadProductDetail() {
    // รับค่า id จาก URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }
    
    // หาข้อมูลสินค้าจาก id
    const product = findProductById(productId);
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }
    
    // อัปเดต Breadcrumb
    const categoryElement = document.getElementById('product-category');
    if (categoryElement) {
        categoryElement.textContent = getCategoryName(product.category);
    }
    
    const nameElement = document.getElementById('product-name');
    if (nameElement) {
        nameElement.textContent = product.name;
    }
    
    // แสดงรายละเอียดสินค้า
    const productDetail = document.getElementById('product-detail');
    if (!productDetail) return;
    
    productDetail.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            ${product.discount ? `<div class="sale-badge">ลดราคา</div>` : ''}
        </div>
        <div class="product-info-detail">
            <div class="product-category">${getCategoryName(product.category)} | ${product.ageRange}</div>
            <h1 class="product-title">${product.name}</h1>
            <div class="product-rating">
                ${getStarRating(product.rating)}
                <span class="rating-number">(${product.rating})</span>
            </div>
            <div class="product-price detail-price">
                <span class="current-price">฿${product.price.toLocaleString()}</span>
                ${product.discount ? `<span class="original-price">฿${product.originalPrice.toLocaleString()}</span>` : ''}
                ${product.discount ? `<span class="discount-percent">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
            </div>
            <div class="product-description">
                <h3>รายละเอียดสินค้า</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-quantity">
                <span>จำนวน:</span>
                <div class="quantity-control">
                    <button class="quantity-btn minus" id="decrease-quantity">-</button>
                    <input type="number" value="1" min="1" max="99" id="product-quantity">
                    <button class="quantity-btn plus" id="increase-quantity">+</button>
                </div>
            </div>
            <button class="add-to-cart-large" id="add-to-cart-detail" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> เพิ่มลงตะกร้า
            </button>
        </div>
    `;
    
    // ตั้งค่าปุ่มเพิ่ม/ลดจำนวน
    setupQuantityButtons();
    
    // ตั้งค่าปุ่มเพิ่มลงตะกร้า
    const addToCartButton = document.getElementById('add-to-cart-detail');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
            addToCart(productId, quantity);
            showNotification(`เพิ่ม ${product.name} จำนวน ${quantity} ชิ้นลงตะกร้าเรียบร้อยแล้ว`);
        });
    }
    
    // โหลดสินค้าที่เกี่ยวข้อง
    loadRelatedProducts(product.category, productId);
}

// ฟังก์ชันแปลงรหัสหมวดหมู่เป็นชื่อภาษาไทย
function getCategoryName(categoryCode) {
    const categories = {
        'educational': 'ของเล่นเสริมทักษะ',
        'plush': 'ตุ๊กตา',
        'vehicles': 'รถและยานพาหนะ',
        'board-games': 'เกมกระดาน',
        'baby': 'ของเล่นเด็กเล็ก'
    };
    
    return categories[categoryCode] || categoryCode;
}

// ฟังก์ชันสร้างดาวจากคะแนนรีวิว
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // เพิ่มดาวเต็ม
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // เพิ่มดาวครึ่ง (ถ้ามี)
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // เพิ่มดาวว่าง
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// ฟังก์ชันค้นหาสินค้าจาก ID
function findProductById(id) {
    return products.find(product => product.id === parseInt(id)) || null;
}

// ฟังก์ชันตั้งค่าปุ่มเพิ่ม/ลดจำนวน
function setupQuantityButtons() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('product-quantity');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) return;
    
    decreaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity < 99) {
            quantityInput.value = quantity + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let quantity = parseInt(this.value);
        if (isNaN(quantity) || quantity < 1) {
            this.value = 1;
        } else if (quantity > 99) {
            this.value = 99;
        }
    });
}

// ฟังก์ชันโหลดสินค้าลดราคา (เพิ่มใหม่)
function loadSaleProducts() {
    const saleProductsContainer = document.getElementById('sale-products');
    if (!saleProductsContainer) return;
    
    // กรองเฉพาะสินค้าที่มีส่วนลด
    const discountedProducts = products.filter(product => product.discount);
    
    if (discountedProducts.length === 0) {
        saleProductsContainer.innerHTML = '<p class="no-products">ขณะนี้ไม่มีสินค้าลดราคา</p>';
        return;
    }
    
    let productsHTML = '';
    
    // สร้าง HTML สำหรับสินค้าลดราคา
    discountedProducts.forEach(product => {
        productsHTML += `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="sale-badge">ลดราคา</div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)} | ${product.ageRange}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">฿${product.price.toLocaleString()}</span>
                        <span class="original-price">฿${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        `;
    });
    
    saleProductsContainer.innerHTML = productsHTML;
    
    // เพิ่ม Event Listener สำหรับคลิกที่การ์ดสินค้า
    const productCards = document.querySelectorAll('#sale-products .product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // ไม่นำไปที่หน้ารายละเอียดหากคลิกที่ปุ่ม
            if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                const productId = this.dataset.id;
                window.location.href = `product-details.html?id=${productId}`;
            }
        });
    });
    
    // เพิ่ม Event Listener สำหรับปุ่มเพิ่มลงตะกร้า
    const addToCartButtons = document.querySelectorAll('#sale-products .add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.id;
            addToCart(productId);
            showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
        });
    });
}

// ฟังก์ชันโหลดสินค้าที่เกี่ยวข้อง (เพิ่มใหม่)
function loadRelatedProducts(category, currentProductId) {
    const relatedProductsContainer = document.getElementById('related-products');
    if (!relatedProductsContainer) return;
    
    // หาสินค้าในหมวดหมู่เดียวกันที่ไม่ใช่สินค้าปัจจุบัน
    const relatedProducts = products.filter(product => 
        product.category === category && product.id !== parseInt(currentProductId)
    );
    
    // ถ้าไม่มีสินค้าที่เกี่ยวข้อง
    if (relatedProducts.length === 0) {
        relatedProductsContainer.innerHTML = '<p class="no-products">ไม่มีสินค้าที่เกี่ยวข้อง</p>';
        return;
    }
    
    // สุ่มเลือกไม่เกิน 4 รายการ
    const randomRelated = relatedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    let productsHTML = '';
    
    // สร้าง HTML สำหรับสินค้าที่เกี่ยวข้อง
    randomRelated.forEach(product => {
        productsHTML += `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    ${product.discount ? `<div class="sale-badge">ลดราคา</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)} | ${product.ageRange}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">฿${product.price.toLocaleString()}</span>
                        ${product.discount ? `<span class="original-price">฿${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        `;
    });
    
    relatedProductsContainer.innerHTML = productsHTML;
    
    // เพิ่ม Event Listener สำหรับการ์ดสินค้า
    const productCards = document.querySelectorAll('#related-products .product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                const productId = this.dataset.id;
                window.location.href = `product-details.html?id=${productId}`;
            }
        });
    });
    
    // เพิ่ม Event Listener สำหรับปุ่มเพิ่มลงตะกร้า
    const addToCartButtons = document.querySelectorAll('#related-products .add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.id;
            addToCart(productId);
            showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
        });
    });
}

// ฟังก์ชันแสดงการแจ้งเตือน (เพิ่มใหม่)
function showNotification(message) {
    // ตรวจสอบว่ามีคอนเทนเนอร์สำหรับแจ้งเตือนหรือไม่
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // สร้างคอนเทนเนอร์ใหม่
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // สร้างการแจ้งเตือน
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // เพิ่มลงในคอนเทนเนอร์
    notificationContainer.appendChild(notification);
    
    // แสดงการแจ้งเตือน
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // ซ่อนการแจ้งเตือนหลังจาก 3 วินาที
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ฟังก์ชันตั้งค่าปุ่มกรอง (เพิ่มใหม่)
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // ลบคลาส active จากปุ่มทั้งหมด
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // เพิ่มคลาส active ให้กับปุ่มที่ถูกคลิก
            this.classList.add('active');
            
            // กรองสินค้าตามหมวดหมู่
            const category = this.dataset.filter;
            filterProductsByCategory(category);
        });
    });
}

// ฟังก์ชันกรองสินค้าตามหมวดหมู่ (เพิ่มใหม่)
function filterProductsByCategory(category) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    // กรองสินค้าตามหมวดหมู่
    let filteredProducts;
    if (category === 'all') {
        // สุ่มสินค้าทั้งหมด 8 รายการสำหรับแสดงในหมวดหมู่ 'ทั้งหมด'
        filteredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
    } else {
        // กรองตามหมวดหมู่ที่เลือก
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // สร้าง HTML สำหรับแสดงสินค้า
    let productsHTML = '';
    filteredProducts.forEach(product => {
        productsHTML += `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    ${product.discount ? `<div class="sale-badge">ลดราคา</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)} | ${product.ageRange}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">฿${product.price.toLocaleString()}</span>
                        ${product.discount ? `<span class="original-price">฿${product.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${getStarRating(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        `;
    });
    
    // ถ้าไม่มีสินค้าในหมวดหมู่ที่เลือก
    if (productsHTML === '') {
        productsHTML = '<div class="no-products">ไม่พบสินค้าในหมวดหมู่นี้</div>';
    }
    
    // แสดงผลสินค้า
    productGrid.innerHTML = productsHTML;
    
    // เพิ่ม Event Listener สำหรับคลิกที่การ์ดสินค้า
    setupProductCardLinks();
    
    // เพิ่ม Event Listener สำหรับปุ่มเพิ่มสินค้าลงตะกร้า
    setupAddToCartButtons();
}

// ฟังก์ชันตั้งค่าปุ่มเพิ่มสินค้าลงตะกร้า (เพิ่มใหม่)
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.id;
            addToCart(productId);
            
            // แสดงการแจ้งเตือนการเพิ่มสินค้า
            showNotification('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว');
        });
    });
}

// ฟังก์ชันเพิ่มสินค้าลงตะกร้า (เพิ่มใหม่)
function addToCart(productId, quantity = 1) {
    // ตรวจสอบข้อมูลนำเข้า
    productId = parseInt(productId);
    quantity = parseInt(quantity) || 1;
    
    if (isNaN(productId) || productId <= 0) {
        console.error('รหัสสินค้าไม่ถูกต้อง');
        return;
    }
    
    // หาข้อมูลสินค้า
    const product = findProductById(productId);
    if (!product) {
        console.error('ไม่พบข้อมูลสินค้า');
        return;
    }
    
    // ดึงข้อมูลตะกร้าเดิมจาก localStorage
    let cart = [];
    const savedCart = localStorage.getItem('toylandCart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
    const existingItemIndex = cart.findIndex(item => parseInt(item.id) === productId);
    
    if (existingItemIndex !== -1) {
        // ถ้ามีสินค้านี้แล้ว เพิ่มจำนวน
        cart[existingItemIndex].quantity = parseInt(cart[existingItemIndex].quantity) + quantity;
    } else {
        // ถ้ายังไม่มีสินค้านี้ เพิ่มรายการใหม่
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // บันทึกข้อมูลตะกร้าลงใน localStorage
    localStorage.setItem('toylandCart', JSON.stringify(cart));
    
    // อัปเดตจำนวนสินค้าในตะกร้าที่แสดง
    updateCartCount();
}

// ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า (เพิ่มใหม่)
function updateCartCount() {
    // ดึงข้อมูลตะกร้าจาก localStorage
    let cart = [];
    const savedCart = localStorage.getItem('toylandCart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // คำนวณจำนวนสินค้าทั้งหมดในตะกร้า
    const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
    
    // อัปเดตจำนวนที่แสดง
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        
        // แสดง/ซ่อนจำนวนตามความเหมาะสม
        if (totalItems > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}