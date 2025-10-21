let products = JSON.parse(localStorage.getItem('products')) || [
    { name: 'Sports Hoodie', price: 200, desc: 'Comfortable and stylish', img: 'images/hoodie.jpg' }, // افترض وجود hoodie.jpg
    { name: 'Smartphone', price: 2500, desc: 'Latest technology', img: 'images/smartphone.jpg' },
    { name: 'Laptop', price: 5000, desc: 'Fast and reliable', img: 'images/laptop.jpg' },
    { name: 'Headphones', price: 300, desc: 'High-quality sound', img: 'images/headphones.jpg' }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.desc} – ${product.price} MAD</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
    localStorage.setItem('products', JSON.stringify(products));
}

document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const desc = document.getElementById('product-desc').value;
    const photo = document.getElementById('product-photo').files[0];
    const img = photo ? URL.createObjectURL(photo) : 'images/default.jpg'; // افترض وجود default.jpg
    products.push({ name, price, desc, img });
    loadProducts();
    this.reset();
});

function editProduct(index) {
    const product = products[index];
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-desc').value = product.desc;
    deleteProduct(index);
}

function deleteProduct(index) {
    products.splice(index, 1);
    loadProducts();
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} MAD`;
        cartItems.appendChild(li);
        total += item.price;
    });
    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    document.getElementById('cart').classList.toggle('show');
}

function checkout() {
    alert('Checkout feature coming soon! Integrate with PayPal.');
}

function linkFacebook() {
    window.open('https://adsmanager.facebook.com', '_blank');
}

function linkPayPal() {
    window.open('https://www.paypal.com/buttons', '_blank');
}

loadProducts();
updateCartDisplay();
