let allProducts = [];

function loadAllProducts() {
    // For now, we'll use the mock data from loadRelatedProducts
    allProducts = [
        { id: 'nube-001', name: 'Nube Dress', price: 7.00, image: 'images/meiwa9.JPG', description: 'A simple design to bring out your beauty' },
        { id: 'nube-002', name: 'Nube Dress 2', price: 7.00, image: 'images/meiwa9.JPG', description: 'Elegant and comfortable' },
        { id: 'meiwa-001', name: 'Meiwa Dress', price: 8.00, image: 'images/meiwa6.JPG', description: 'Stylish and modern' },
        { id: 'meiwa-002', name: 'Meiwa Dress 2', price: 7.50, image: 'images/meiwa3.JPG', description: 'Chic and versatile' }
    ];
    // In a real scenario, you would fetch this data from an API or load it from store.js
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts();
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    const itemDetails = getItemDetails(itemId);

    if (itemDetails) {
        displayProductDetails(itemDetails);
        displayRelatedProducts(itemId);
    } else {
        console.error('Product not found');
    }
});

function getItemDetails(itemId) {
    return allProducts.find(product => product.id === itemId) || null;
}

function displayProductDetails(product) {
    document.getElementById('main-image').src = product.image;
    document.getElementById('item-name').textContent = product.name;
    document.getElementById('item-price').textContent = `₵${product.price.toFixed(2)}`;
    document.getElementById('item-description').textContent = product.description;

    const colorSelector = createColorSelector(product.colors || ['white', 'red', 'blue', 'green']);
    const sizeSelector = createSizeSelector(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']);
    document.getElementById('color-selector').appendChild(colorSelector);
    document.getElementById('size-selector').appendChild(sizeSelector);

    document.getElementById('add-to-cart').addEventListener('click', function() {
        const selectedColor = document.querySelector('.color-option.selected').getAttribute('data-color');
        const selectedSize = document.querySelector('.size-option.selected').getAttribute('data-size');
        addToCart(product, selectedColor, selectedSize);
    });
}

function createColorSelector(colors) {
    const container = document.createElement('div');
    container.className = 'color-selector';
    const mutedColors = {
        white: '#FFFFFF',
        red: '#D32F2F',
        blue: '#1976D2',
        green: '#388E3C'
    };
    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = mutedColors[color] || color;
        colorOption.setAttribute('data-color', color);
        if (color === 'white') {
            colorOption.classList.add('white-option');
        }
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

function addToCart(item, color, size) {
    const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        color: color,
        size: size,
        quantity: 1
    };

    // This function should be implemented in your store.js
    // It should add the item to the cart and update the display
    if (typeof window.addToCartFromItemPage === 'function') {
        window.addToCartFromItemPage(cartItem);
    } else {
        console.error('addToCartFromItemPage function not found in store.js');
    }
}

function loadRelatedProducts() {
    // This function should load related products
    // For now, we'll use a mock implementation
    const relatedProductsContainer = document.getElementById('related-products');
    const mockRelatedProducts = [
        { id: 'nube-002', name: 'Nube Dress 2', price: 7.00, image: 'images/meiwa9.JPG' },
        { id: 'meiwa-001', name: 'Meiwa Dress', price: 8.00, image: 'images/meiwa6.JPG' },
        { id: 'meiwa-002', name: 'Meiwa Dress 2', price: 7.50, image: 'images/meiwa3.JPG' }
    ];

    mockRelatedProducts.forEach(product => {
        const productElement = createProductElement(product);
        relatedProductsContainer.appendChild(productElement);
    });
}

function displayRelatedProducts(currentProductId) {
    const container = document.getElementById('related-products');
    container.innerHTML = ''; // Clear existing content

    const relatedProducts = allProducts
        .filter(product => product.id !== currentProductId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Display 3 related products

    relatedProducts.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}


function createProductElement(product) {
    const element = document.createElement('div');
    element.className = 'product';
    element.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description || 'Stylish item from our collection'}</p>
        <p>Price: ₵${product.price.toFixed(2)}</p>
    `;
    element.addEventListener('click', function() {
        window.location.href = `item.html?id=${product.id}`;
    });
    return element;
}