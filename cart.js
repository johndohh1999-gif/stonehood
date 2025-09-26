// Global Cart Management System for Stonehood
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.initializeCart();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cart = localStorage.getItem('stonehood_cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('stonehood_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Initialize cart functionality
    initializeCart() {
        this.createCartButton();
        this.createCartPopup();
        this.bindEvents();
    }

    // Create cart button in header
    createCartButton() {
        const existingCartButton = document.querySelector('.cart-button');
        if (existingCartButton) return; // Don't create if already exists

        const cartButton = document.createElement('div');
        cartButton.className = 'cart-button';
        cartButton.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        `;

        // Find where to insert the cart button
        const header = document.querySelector('.header');
        if (header) {
            const filterSort = header.querySelector('.filter-sort');
            if (filterSort) {
                filterSort.appendChild(cartButton);
            } else {
                header.appendChild(cartButton);
            }
        }

        // Add CSS for cart button
        this.addCartButtonStyles();
    }

    // Add CSS styles for cart button
    addCartButtonStyles() {
        if (document.getElementById('cart-styles')) return; // Don't add if already exists

        const style = document.createElement('style');
        style.id = 'cart-styles';
        style.textContent = `
            .cart-button {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 45px;
                background: #333;
                color: white;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-left: 15px;
            }

            .cart-button:hover {
                background: #555;
                transform: scale(1.05);
            }

            .cart-button i {
                font-size: 18px;
            }

            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 22px;
            }

            .cart-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .cart-popup.active {
                display: flex;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .cart-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from { transform: scale(0.8) translateY(-50px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }

            .cart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }

            .cart-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
            }

            .cart-close {
                background: none;
                border: none;
                font-size: 28px;
                color: #666;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .cart-close:hover {
                background: #f5f5f5;
                color: #333;
            }

            .cart-items {
                padding: 20px;
                min-height: 200px;
            }

            .cart-item {
                display: flex;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;
            }

            .cart-item:last-child {
                border-bottom: none;
            }

            .cart-item-image {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
                margin-right: 15px;
            }

            .cart-item-details {
                flex: 1;
                margin-right: 15px;
            }

            .cart-item-name {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }

            .cart-item-options {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
            }

            .cart-item-price {
                font-size: 14px;
                font-weight: 600;
                color: #e74c3c;
            }

            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-right: 15px;
            }

            .quantity-btn {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .quantity-btn:hover {
                background: #f5f5f5;
                border-color: #333;
            }

            .quantity-display {
                font-size: 14px;
                font-weight: 600;
                min-width: 20px;
                text-align: center;
            }

            .remove-item {
                background: #e74c3c;
                color: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .remove-item:hover {
                background: #c0392b;
            }

            .cart-empty {
                text-align: center;
                color: #666;
                padding: 40px 20px;
            }

            .cart-empty i {
                font-size: 48px;
                color: #ddd;
                margin-bottom: 15px;
            }

            .cart-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                background: #f9f9f9;
            }

            .cart-total {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                font-size: 18px;
                font-weight: 600;
            }

            .cart-actions {
                display: flex;
                gap: 10px;
            }

            .cart-checkout, .cart-continue {
                flex: 1;
                padding: 12px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
            }

            .cart-checkout {
                background: #333;
                color: white;
                border: none;
            }

            .cart-checkout:hover {
                background: #555;
            }

            .cart-continue {
                background: white;
                color: #333;
                border: 1px solid #333;
            }

            .cart-continue:hover {
                background: #f5f5f5;
            }
        `;
        document.head.appendChild(style);
    }

    // Create cart popup
    createCartPopup() {
        if (document.getElementById('cart-popup')) return; // Don't create if already exists

        const popup = document.createElement('div');
        popup.id = 'cart-popup';
        popup.className = 'cart-popup';
        popup.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2 class="cart-title">Shopping Cart</h2>
                    <button class="cart-close">&times;</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p style="font-size: 14px; color: #999; margin-top: 10px;">Add some items to get started</p>
                    </div>
                </div>
                <div class="cart-footer" id="cart-footer" style="display: none;">
                    <div class="cart-total">
                        <span>Total: </span>
                        <span id="cart-total-amount">Rs.0.00</span>
                    </div>
                    <div class="cart-actions">
                        <button class="cart-continue">Continue Shopping</button>
                        <button class="cart-checkout">Checkout</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }

    // Bind events
    bindEvents() {
        // Cart button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-button')) {
                this.showCart();
            }
        });

        // Cart popup events
        const popup = document.getElementById('cart-popup');
        if (popup) {
            // Close cart
            popup.addEventListener('click', (e) => {
                if (e.target === popup || e.target.classList.contains('cart-close') || e.target.classList.contains('cart-continue')) {
                    this.hideCart();
                }
            });

            // Quantity and remove buttons
            popup.addEventListener('click', (e) => {
                if (e.target.classList.contains('quantity-btn')) {
                    const change = e.target.textContent === '+' ? 1 : -1;
                    const itemId = e.target.closest('.cart-item').dataset.itemId;
                    this.updateQuantity(itemId, change);
                } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                    const itemId = e.target.closest('.cart-item').dataset.itemId;
                    this.removeItem(itemId);
                }
            });

            // Checkout button
            popup.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-checkout')) {
                    this.checkout();
                }
            });
        }
    }

    // Add item to cart
    addItem(productData) {
        const existingItem = this.items.find(item => 
            item.id === productData.id && 
            item.size === productData.size && 
            item.color === productData.color
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...productData,
                quantity: 1,
                addedAt: new Date().getTime()
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddedNotification(productData.name);
        return true;
    }

    // Update item quantity
    updateQuantity(itemId, change) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            }
        }
    }

    // Remove item from cart
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
    }

    // Update cart count display
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Show cart popup
    showCart() {
        const popup = document.getElementById('cart-popup');
        if (popup) {
            this.updateCartDisplay();
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide cart popup
    hideCart() {
        const popup = document.getElementById('cart-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Update cart display
    updateCartDisplay() {
        const container = document.getElementById('cart-items-container');
        const footer = document.getElementById('cart-footer');
        const totalAmount = document.getElementById('cart-total-amount');

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 14px; color: #999; margin-top: 10px;">Add some items to get started</p>
                </div>
            `;
            footer.style.display = 'none';
        } else {
            container.innerHTML = this.items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-options">Size: ${item.size}${item.color ? ` • Color: ${item.color}` : ''}</div>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn">+</button>
                    </div>
                    <button class="remove-item">×</button>
                </div>
            `).join('');

            // Calculate total
            const total = this.items.reduce((sum, item) => {
                const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
                return sum + (price * item.quantity);
            }, 0);

            totalAmount.textContent = `Rs.${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            footer.style.display = 'block';
        }
    }

    // Show added notification
    showAddedNotification(productName) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .cart-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10001;
                animation: slideInNotification 0.3s ease, slideOutNotification 0.3s ease 2.7s;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutNotification {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        if (!document.getElementById('notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Checkout
    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = this.items.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        alert(`Checkout - Total: Rs.${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}\n\nThis would redirect to payment gateway in a real application.`);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }
}

// Global cart instance
let cart;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// Global function to add items to cart (for use in onclick handlers)
function addToCart(productId, buttonElement = null) {
    if (!cart) {
        console.error('Cart not initialized');
        return;
    }

    const button = buttonElement || event.target;
    const card = button.closest('.product-card');
    
    if (!card) {
        console.error('Product card not found');
        return;
    }

    // Extract product information
    const name = card.querySelector('.product-name')?.textContent || 'Unknown Product';
    const priceElement = card.querySelector('.current-price');
    const price = priceElement ? priceElement.textContent : 'Rs.0.00';
    const selectedSizeBtn = card.querySelector('.size-btn.selected');
    const size = selectedSizeBtn ? selectedSizeBtn.textContent : 'M';
    
    // Get selected color (if available)
    const activeColorDot = card.querySelector('.color-dot.active');
    let color = '';
    if (activeColorDot) {
        const colorValue = activeColorDot.style.backgroundColor;
        color = colorValue || 'Default';
    }

    // Get product image
    const imageElement = card.querySelector('.product-image img') || card.querySelector('.product-main-image');
    const image = imageElement ? imageElement.src : '../images/products/default.png';

    // Create product data
    const productData = {
        id: `${productId}_${size}_${color}`,
        productId: productId,
        name: name,
        price: price,
        size: size,
        color: color,
        image: image
    };

    // Add to cart
    const added = cart.addItem(productData);

    if (added) {
        // Visual feedback on button
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        button.style.background = '#27ae60';
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.style.background = originalBg;
            button.textContent = originalText;
        }, 1500);
    }
}