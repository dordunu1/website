const paystackPublicKey = 'pk_live_d14897378376801dca7720b66df6e59570a5d8f9';

document.addEventListener('DOMContentLoaded', function() {
    const cartItems = [];
    let cartElement = null;

    // Add color and size selectors to all products
    const products = document.querySelectorAll('.product');
    const colorOptions = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

    products.forEach(product => {
        const colorSelector = createColorSelector(colorOptions);
        const sizeSelector = createSizeSelector(sizeOptions);
        
        product.insertBefore(sizeSelector, product.querySelector('.add-to-cart'));
        product.insertBefore(colorSelector, sizeSelector);
    });

    function createColorSelector(colors) {
        const container = document.createElement('div');
        container.className = 'color-selector';
        const mutedColors = {
            red: '#D32F2F',
            orange: '#F57C00',
            yellow: '#FBC02D',
            green: '#388E3C',
            blue: '#1976D2',
            indigo: '#303F9F',
            violet: '#7B1FA2'
        };
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = mutedColors[color] || color;
            colorOption.setAttribute('data-color', color);
            colorOption.innerHTML = '<span class="checkmark">✓</span>';
            colorOption.addEventListener('click', function() {
                this.parentNode.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
            });
            container.appendChild(colorOption);
        });
        return container;
    }

    function createSizeSelector(sizes) {
        const container = document.createElement('div');
        container.className = 'size-selector';
        sizes.forEach(size => {
            const sizeOption = document.createElement('button');
            sizeOption.className = 'size-option';
            sizeOption.textContent = size;
            sizeOption.setAttribute('data-size', size);
            sizeOption.addEventListener('click', function() {
                this.parentNode.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
            });
            container.appendChild(sizeOption);
        });
        return container;
    }

    function createCartElement() {
        if (!cartElement) {
            cartElement = document.createElement('div');
            cartElement.id = 'cart';
            cartElement.style.display = 'none'; // Hide the cart initially
            document.body.appendChild(cartElement);
        }
    }

    function addToCart(productElement) {
        const colorSelected = productElement.querySelector('.color-option.selected');
        const sizeSelected = productElement.querySelector('.size-option.selected');
        
        if (!colorSelected || !sizeSelected) {
            alert('Please select both color and size');
            return;
        }
        
        const color = colorSelected.getAttribute('data-color');
        const size = sizeSelected.getAttribute('data-size');
        
        const product = {
            id: productElement.querySelector('.add-to-cart').getAttribute('data-item-id'),
            name: productElement.querySelector('h3').textContent,
            price: parseFloat(productElement.querySelector('.add-to-cart').getAttribute('data-item-price')),
            color: color,
            size: size
        };
    
        const existingItem = cartItems.find(item => 
            item.id === product.id && item.color === color && item.size === size
        );
    
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({...product, quantity: 1});
        }
    
        updateMiniCart();
        saveCartToLocalStorage();
    }

    function updateMiniCart() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function showCart() {
        updateCartDisplay();
        const cartElement = document.getElementById('cart');
        if (cartElement) {
            cartElement.style.display = 'block';
            cartElement.classList.add('show');
        }
        updateMiniCart();
    }

    function calculateDeliveryFee() {
        const city = document.getElementById('city')?.value.trim().toLowerCase() || '';
        return city === 'kumasi' ? 30 : city ? 50 : 0; // Return 0 if city is not set
    }

    function updateDeliveryFeeAndTotal() {
        const deliveryFee = calculateDeliveryFee();
        const subtotal = calculateSubtotal();
        const total = subtotal + deliveryFee;

        const deliveryFeeElement = document.querySelector('#cart p:nth-of-type(2)');
        const totalElement = document.querySelector('#cart p:nth-of-type(3)');

        if (deliveryFeeElement) {
            deliveryFeeElement.textContent = `Delivery Fee: ₵${deliveryFee.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `Total: ₵${total.toFixed(2)}`;
        }
    }
    
    function updateCartDisplay() {
        createCartElement();
        const cartElement = document.getElementById('cart');
        if (!cartElement) return;
    
        if (cartItems.length > 0) {
            const deliveryFee = calculateDeliveryFee();
            const subtotal = calculateSubtotal();
            const total = subtotal + deliveryFee;
    
            // Store current input values
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const address = document.getElementById('address')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
    
            cartElement.innerHTML = `
                <div class="cart-container">
                    <button id="close-cart" aria-label="Close cart">×</button>
                    <h2>Your Cart</h2>
                    <ul>
                        ${cartItems.map(item => `
                            <li class="cart-item">
                                ${item.name} - Color: ${item.color}, Size: ${item.size}
                                x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">+</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                    <p>Subtotal: ₵${subtotal.toFixed(2)}</p>
                    <p>Delivery Fee: ₵${deliveryFee.toFixed(2)}</p>
                    <p>Total: ₵${total.toFixed(2)}</p>
                    <h3>Shipping Details</h3>
                    <form id="shipping-form">
                        <input type="text" id="name" placeholder="Full Name" required value="${name}">
                        <input type="email" id="email" placeholder="Email Address" required value="${email}">
                        <input type="text" id="address" placeholder="Shipping Address" required value="${address}">
                        <input type="text" id="city" placeholder="City" required value="${city}">
                        <input type="text" id="phone" placeholder="Phone Number" required value="${phone}">
                        <input type="hidden" id="order-details" name="order-details" value="${JSON.stringify(cartItems)}">
                    </form>
                    <button id="checkout-button">Proceed to Checkout</button>
                </div>
            `;
            cartElement.style.display = 'block';
    
            const cityInput = document.getElementById('city');
            if (cityInput) {
                cityInput.addEventListener('input', updateDeliveryFeeAndTotal);
            }
        } else {
            cartElement.style.display = 'none';
        }
    }

    function updateItemQuantity(id, color, size, change) {
        const item = cartItems.find(item => item.id === id && item.color === color && item.size === size);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                const index = cartItems.indexOf(item);
                cartItems.splice(index, 1);
            }
            updateCartDisplay();
            updateMiniCart();
            saveCartToLocalStorage();
        }
    }

    function closeCart() {
        const cartElement = document.getElementById('cart');
        if (cartElement) {
            cartElement.style.display = 'none';
        }
    }

    function calculateSubtotal() {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function calculateTotal() {
        return calculateSubtotal() + calculateDeliveryFee();
    }

    function initiatePaystack() {
        const form = document.getElementById('shipping-form');
        if (!form || !form.checkValidity()) {
            alert('Please fill in all required fields');
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const phone = document.getElementById('phone').value;

        const handler = PaystackPop.setup({
            key: paystackPublicKey,
            email: email,
            amount: calculateTotal() * 100, // Paystack expects amount in pesewas
            currency: 'GHS',
            ref: '' + Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    { display_name: "Full Name", variable_name: "full_name", value: name },
                    { display_name: "Shipping Address", variable_name: "shipping_address", value: address },
                    { display_name: "City", variable_name: "city", value: city },
                    { display_name: "Phone", variable_name: "phone", value: phone },
                    { display_name: "Order Details", variable_name: "order_details", value: JSON.stringify(cartItems) }
                ]
            },
            callback: function(response) {
                alert('Payment complete! Reference: ' + response.reference);
                cartItems.length = 0; // Clear the cart
                updateCartDisplay();
                updateMiniCart();
                saveCartToLocalStorage();
            },
            onClose: function() {
                alert('Transaction was not completed, window closed.');
            },
        });
        handler.openIframe();
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cartItems.push(...JSON.parse(savedCart));
            updateCartDisplay();
            updateMiniCart();
        }
    }

    // Event listeners
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('add-to-cart')) {
            const productElement = e.target.closest('.product');
            addToCart(productElement);
        } else if (e.target && e.target.id === 'checkout-button') {
            initiatePaystack();
        } else if (e.target && e.target.id === 'close-cart') {
            closeCart();
        } else if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.getAttribute('data-id');
            const color = e.target.getAttribute('data-color');
            const size = e.target.getAttribute('data-size');
            const change = e.target.classList.contains('plus') ? 1 : -1;
            updateItemQuantity(id, color, size, change);
        }
    });

    document.getElementById('mini-cart').addEventListener('click', showCart);

    // Load cart from local storage when the page loads
    loadCartFromLocalStorage();
});