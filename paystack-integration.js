let cart = [];

function addToCart(product) {
  cart.push(product);
  updateCartDisplay();
}

function updateCartDisplay() {
  // Update your cart display here
}

function initiatePaystack() {
  let handler = PaystackPop.setup({
    key: 'YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your public key
    email: document.getElementById('email').value,
    amount: calculateTotal() * 100, // Paystack expects amount in kobo
    currency: 'GHS',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference
    callback: function(response) {
      alert('Payment complete! Reference: ' + response.reference);
      // Clear cart and update display here
    },
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    },
  });
  handler.openIframe();
}

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price, 0);
}