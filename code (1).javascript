let adminPassword = 'admin123'; // Change this to your desired password
let isAdminLoggedIn = false;

let products = JSON.parse(localStorage.getItem('products')) || [
    { name: 'Sports Hoodie', price: 200, desc: 'Comfortable and stylish', img: 'images/hoodie.jpg' },
    { name: 'Smartphone', price: 2500, desc: 'Latest technology', img: 'images/smartphone.jpg' },
    { name: 'Laptop', price: 5000, desc: 'Fast and reliable', img: 'images/laptop.jpg' },
    { name: 'Headphones', price: 300, desc: 'High-quality sound', img: 'images/headphones.jpg' }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let stats = JSON.parse(localStorage.getItem('stats')) || { views: 0, cartAdds: 0, checkouts: 0 };

// Track page views
stats.views++;
localStorage.setItem('stats', JSON.stringify(stats));
updateStatsDisplay();

function checkAdminAccess() {
    if (!isAdminLoggedIn) {
        const password = prompt('Enter admin password:');
        if (password === adminPassword) {
            isAdminLoggedIn = true;
            document.getElementById('admin').style.display = 'block';
            loadSiteContentForEdit();
        } else {
            alert('Incorrect password!');
            return false;
        }
    }
    return true;
}

function loadSiteContentForEdit() {
    document.getElementById('edit-title').value = document.getElementById('site-title').textContent;
    document.getElementById('edit-subtitle').value = document.getElementById('site-subtitle').textContent;
    document.getElementById('edit-home').value = document.getElementById('home-content').textContent;
    document.getElementById('edit-about').value = document.getElementById('about-content').textContent;
    document.getElementById('edit-services').value = document.getElementById('services-content').textContent;
    document.getElementById('edit-contact').value = document.getElementById('contact-content').textContent;
}

document.getElementById('site-edit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('site-title').textContent = document.getElementById('edit-title').value;
    document.getElementById('site-subtitle').textContent = document.getElementById('edit-subtitle').value;
    document.getElementById('home-content').textContent = document.getElementById('edit-home').value;
    document.getElementById('about-content').textContent = document.getElementById('edit-about').value;
    document.getElementById('services-content').textContent = document.getElementById('edit-services').value;
    document.getElementById('contact-content').textContent = document.getElementById('edit-contact').value;
    alert('Site updated!');
});

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
                ${isAdminLoggedIn ? `<button onclick="editProduct(${index})">Edit</button><button onclick="deleteProduct(${index})">Delete</button>` : ''}
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
    const img = photo ? URL.createObjectURL(photo) : 'images/default.jpg';
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
    stats.cartAdds++;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('stats', JSON.stringify(stats));
    updateCartDisplay();
    updateStatsDisplay();
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
    stats.checkouts++;
    localStorage.setItem('stats', JSON.stringify(stats));
    updateStatsDisplay();
    alert('Checkout feature coming soon! Integrate with PayPal.');
}

function updateStatsDisplay() {
    document.getElementById('stats-views').textContent = stats.views;
    document.getElementById('stats-cart').textContent = stats.cartAdds;
    document.getElementById('stats-checkouts').textContent = stats.checkouts;
}

function resetStats() {
    stats = { views: 0, cartAdds: 0, checkouts: 0 };
    localStorage.setItem('stats', JSON.stringify(stats));
    updateStatsDisplay();
}

function exportStats() {
    const data = `Page Views: ${stats.views}\nCart Additions: ${stats.cartAdds}\nCheckouts: ${stats.checkouts}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats.txt';
    a.click();
}

loadProducts();
updateCartDisplay();
