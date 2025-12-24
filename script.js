// Simple product renderer for Phytomed
// Renders products into .products-grid on products and index pages

const products = [
    {
        id: 1,
        title: 'PhytoBlend Herbal Tea',
        price: 15.00,
        category: 'Herbal Teas',
        image: 'images/tonic bottle.jpeg',
        description: 'A soothing blend of premium medicinal herbs',
        cures: 'Immune support, digestive health, relaxation',
        uses: 'Steep 1 teabag in hot water for 5-7 minutes. Drink 2-3 times daily for best results.'
    },
    {
        id: 2,
        title: 'PhytoImmune Capsules',
        price: 25.00,
        category: 'Immune Support',
        image: 'images/hero.jpg',
        description: 'Powerful immune system booster in convenient capsule form',
        cures: 'Immune enhancement, cold prevention, antioxidant support',
        uses: 'Take 1-2 capsules daily with water, preferably with meals.'
    },
    {
        id: 3,
        title: 'PhytoSkin Balm',
        price: 25.00,
        category: 'Skin Care',
        image: 'images/hero.jpg',
        description: 'Natural botanical balm for skin rejuvenation',
        cures: 'Dry skin, skin irritation, eczema relief, natural moisturizing',
        uses: 'Apply a small amount to affected skin areas 2-3 times daily. Massage gently until absorbed.'
    }
];

function formatPrice(p) {
    return '$' + p.toFixed(2);
}

function renderProductsGrid(container) {
    container.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-image" src="${p.image}" alt="${p.title}" data-id="${p.id}" style="cursor: pointer;">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function wireAddToCart(container) {
    container.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart')) {
            const id = Number(e.target.dataset.id);
            addToCart(id);
        }
    });
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        return [];
    }
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id, qty: 1 });
    setCart(cart);
}

function updateCartCount() {
    const countEls = document.querySelectorAll('.cart-count');
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    countEls.forEach(el => el.textContent = total);
}

function setupFilters() {
    const category = document.getElementById('category-filter');
    const sort = document.getElementById('sort-filter');
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    function applyFilters() {
        let list = products.slice();
        const catVal = category ? category.value : 'all';
        if (catVal && catVal !== 'all') {
            list = list.filter(p => p.category === catVal);
        }
        if (sort && sort.value === 'price-low') list.sort((a, b) => a.price - b.price);
        if (sort && sort.value === 'price-high') list.sort((a, b) => b.price - a.price);
        grid.innerHTML = '';
        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `\n                <img class="product-image" src="${p.image}" alt="${p.title}" data-id="${p.id}" style="cursor: pointer;">\n                <div class="product-info">\n                    <div class="product-title">${p.title}</div>\n                    <div class="product-price">${formatPrice(p.price)}</div>\n                    <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>\n                </div>\n            `;
            grid.appendChild(card);
        });
    }

    if (category) category.addEventListener('change', applyFilters);
    if (sort) sort.addEventListener('change', applyFilters);
}

function ensureModalHTML() {
    if (document.getElementById('product-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-body">
                <img id="modal-image" src="" alt="">
                <div class="modal-details">
                    <h2 id="modal-title"></h2>
                    <p id="modal-description"></p>
                    <div class="modal-section">
                        <h3>What it cures:</h3>
                        <p id="modal-cures"></p>
                    </div>
                    <div class="modal-section">
                        <h3>How to use:</h3>
                        <p id="modal-uses"></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-title').textContent = product.title;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-cures').textContent = product.cures;
    document.getElementById('modal-uses').textContent = product.uses;

    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
}

function wireProductImageClicks(container) {
    container.addEventListener('click', (e) => {
        if (e.target.matches('.product-image')) {
            const id = Number(e.target.dataset.id);
            openProductModal(id);
        }
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    ensureModalHTML();
    const grid = document.querySelector('.products-grid');
    if (grid) {
        renderProductsGrid(grid);
        wireAddToCart(grid);
        wireProductImageClicks(grid);
        setupFilters();
    }
    updateCartCount();

    // Modal close handlers
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.querySelector('.modal-close').addEventListener('click', closeProductModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
    }
});
