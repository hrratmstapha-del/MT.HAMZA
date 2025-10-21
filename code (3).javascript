let adminPassword = 'admin123'; // Change this password
let isAdminLoggedIn = false;
let isArabic = false; // Language flag

let products = JSON.parse(localStorage.getItem('products')) || [
    { name: 'Sports Hoodie', price: 200, desc: 'Comfortable and stylish', img: 'images/hoodie.jpg' },
    { name: 'Smartphone', price: 2500, desc: 'Latest technology', img: 'images/smartphone.jpg' },
    { name: 'Laptop', price: 5000, desc: 'Fast and reliable', img: 'images/laptop.jpg' },
    { name: 'Headphones', price: 300, desc: 'High-quality sound', img: 'images/headphones.jpg' }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let stats = JSON.parse(localStorage.getItem('stats')) || { views: 0, cartAdds: 0, checkouts: 0 };
let tickets = JSON.parse(localStorage.getItem('tickets')) || []; // For client problems

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
            loadTickets();
        } else {
            alert('Incorrect password!');
            return false;
        }
    }
    return true;
}

function toggleLanguage() {
    isArabic = !isArabic;
    const langButton = document.getElementById('lang-toggle');
    langButton.textContent = isArabic ? 'English' : 'العربية';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.body.dir = isArabic ? 'rtl' : 'ltr';
    updateLanguage();
}

function updateLanguage() {
    const translations = {
        en: {
            title: 'Mt. Hamza',
            subtitle: 'Discover a variety of products in Morocco – from clothing to electronics! Shop with attractive services for our valued clients.',
            homeTitle: 'Welcome to Mt. Hamza',
            homeContent: 'We offer a wide range of products in Morocco, including hoodies and electronics. Enjoy our attractive backgrounds and dedicated client services!',
            productsTitle: 'Our Products',
            servicesTitle: 'Client Services',
            servicesContent: 'At Mt. Hamza, we prioritize our clients with top-notch services:',
            aboutTitle: 'About Mt. Hamza',
            aboutContent: 'Founded in Morocco, Mt. Hamza offers diverse products at competitive prices. We\'re committed to quality and excellent client services.',
            contactTitle: 'Contact',
            contactContent: 'Email: info@mthamza.ma | Phone: +212 6 12 34 56 78 | Address: 123 Mountain St, Rabat, Morocco'
        },
        ar: {
            title: 'Mt. Hamza', // Keep as is, not translated
            subtitle: 'اكتشف مجموعة متنوعة من المنتجات في المغرب – من الملابس إلى الإلكترونيات! تسوق مع خدمات جذابة لعملائنا الكرام.',
            homeTitle: 'مرحباً بكم في Mt. Hamza', // Keep "Mt. Hamza" as is
            homeContent: 'نقدم مجموعة واسعة من المنتجات في المغرب، بما في ذلك الهوديز والإلكترونيات. استمتعوا بخلفياتنا الجذابة وخدمات العملاء المخصصة!',
            productsTitle: 'منتجاتنا',
            servicesTitle: 'خدمات العملاء',
            servicesContent: 'في Mt. Hamza، نعطي أولوية لعملائنا بخدمات عالية الجودة:', // Keep "Mt. Hamza" as is
            aboutTitle: 'عن Mt. Hamza', // Keep "Mt. Hamza" as is, translate "About" to "عن"
            aboutContent: 'تأسس Mt. Hamza في المغرب، ويقدم منتجات متنوعة بأسعار تنافسية. نحن ملتزمون بالجودة وخدمات العملاء الممتازة.', // Keep "Mt. Hamza" as is
            contactTitle: 'اتصل بنا',
            contactContent: 'البريد الإلكتروني: info@mthamza.ma | الهاتف: +212 6 12 34 56 78 | العنوان: 123 شارع الجبل، الرباط، المغرب'
        }
    };
    const lang = isArabic ? 'ar' : 'en';
    document.getElementById('site-title').textContent = translations[lang].title;
    document.getElementById('site-subtitle').textContent = translations[lang].subtitle;
    document.getElementById('home-title').textContent = translations[lang].homeTitle;
    document.getElementById('home-content').textContent = translations[lang].homeContent;
    document.getElementById('products-title').textContent = translations[lang].productsTitle;
    document.getElementById('services-title').textContent = translations[lang].servicesTitle;
    document.getElementById('services-content').textContent = translations[lang].servicesContent;
    document.getElementById('about-title').textContent = translations[lang].aboutTitle;
    document.getElementById('about-content').textContent = translations[lang].aboutContent;
    document.getElementById('contact-title').textContent = translations[lang].contactTitle;
    document.getElementById('contact-content').textContent = translations[lang].contactContent;
    loadProducts(); // Reload products to update any language-specific text
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

function loadTickets() {
    const ticketList = document.getElementById('ticket-list');
    ticketList.innerHTML = '';
    tickets.forEach((ticket, index) => {
        const li = document.createElement('li');
        li.textContent = `${ticket.client}: ${ticket.issue}`;
        ticketList.appendChild(li);
    });
}

document.getElementById('ticket-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const client = document.getElementById('ticket-client').value;
    const issue = document.getElementById('ticket-issue').value;
    tickets.push({ client, issue });
    localStorage.setItem('tickets', JSON.stringify(tickets));
    loadTickets();
    this.reset();
});

loadProducts();
updateCartDisplay();
