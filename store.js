const paystackPublicKey = 'pk_live_d14897378376801dca7720b66df6e59570a5d8f9';

document.addEventListener('DOMContentLoaded', function() {
    const cartItems = [];
    let cartElement = null;

    function createCartElement() {
        if (!cartElement) {
            cartElement = document.createElement('div');
            cartElement.id = 'cart';
            cartElement.style.display = 'none'; // Hide the cart initially
            document.body.appendChild(cartElement);
        }
    }

    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);
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
                                ${item.name} x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                    <p>Subtotal: ₵${subtotal.toFixed(2)}</p>
                    <p>Delivery Fee: ₵${deliveryFee.toFixed(2)}</p>
                    <p>Total: ₵${total.toFixed(2)}</p>
                    <form id="shipping-form">
                        <input type="text" id="name" placeholder="Full Name" required value="${name}">
                        <input type="email" id="email" placeholder="Email Address" required value="${email}">
                        <input type="text" id="address" placeholder="Shipping Address" required value="${address}">
                        <input type="text" id="city" placeholder="City" required value="${city}">
                        <input type="text" id="phone" placeholder="Phone Number" required value="${phone}">
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

    function updateItemQuantity(id, change) {
        const item = cartItems.find(item => item.id === id);
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
                    { display_name: "Phone", variable_name: "phone", value: phone }
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
            const product = {
                id: e.target.getAttribute('data-item-id'),
                name: productElement.querySelector('h3').textContent,
                price: parseFloat(e.target.getAttribute('data-item-price')),
                description: productElement.querySelector('p').textContent,
                image: productElement.querySelector('img').src
            };
            addToCart(product);
            console.log('Product added to cart:', product);
        } else if (e.target && e.target.id === 'checkout-button') {
            initiatePaystack();
        } else if (e.target && e.target.id === 'close-cart') {
            closeCart();
        } else if (e.target.classList.contains('quantity-btn')) {
            const id = e.target.getAttribute('data-id');
            const change = e.target.classList.contains('plus') ? 1 : -1;
            updateItemQuantity(id, change);
        }
    });

    document.getElementById('mini-cart').addEventListener('click', showCart);

    // Load cart from local storage when the page loads
    loadCartFromLocalStorage();
});