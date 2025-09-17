document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');
    const searchBar = document.getElementById('search-bar');
    const pageTitle = document.getElementById('page-title');
    
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    
    const cartCountEl = document.getElementById('cart-count');

    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('cleanTradeCart')) || [];

    // --- CART LOGIC ---
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    };

    const saveCart = () => {
        localStorage.setItem('cleanTradeCart', JSON.stringify(cart));
        updateCartCount();
    };
    
    const addToCart = (productId) => {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart();
        alert('Product added to cart!');
    };


    // --- DATA FETCHING & PROCESSING ---
    const fetchData = async () => {
        try {
            const response = await fetch('farms.json');
            const farms = await response.json();
            
            // Flatten the data into a single products array for easier filtering
            allProducts = farms.flatMap(farm =>
                Object.entries(farm.categories).flatMap(([category, categoryData]) =>
                    categoryData.products.map(product => ({
                        ...product,
                        farmName: farm.farmName,
                        farmStory: farm.farmStory,
                        category: category
                    }))
                )
            );
            
            initializePage();

        } catch (error) {
            console.error('Failed to load farm data:', error);
            productGrid.innerHTML = '<p>Could not load products. Please try again later.</p>';
        }
    };
    
    // --- RENDERING & DISPLAY ---
    const renderProducts = (products) => {
        productGrid.innerHTML = '';
        if (products.length === 0) {
            productGrid.innerHTML = '<p>No products found matching your search.</p>';
            return;
        }
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;
            
            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-card-info">
                    <h3>${product.name}</h3>
                    <p>${product.description.substring(0, 80)}...</p>
                    <span class="product-farm-name">From: ${product.farmName}</span>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    const openModal = (product) => {
        document.getElementById('modal-img').src = product.imageUrl;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-desc').textContent = product.description;
        document.getElementById('modal-farm-name').textContent = product.farmName;
        document.getElementById('modal-farm-story').textContent = product.farmStory;
        
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        // Clone and replace to remove old event listeners
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
        newBtn.addEventListener('click', () => addToCart(product.id));

        modalOverlay.classList.add('active');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    // --- INITIALIZATION & EVENT LISTENERS ---
    const initializePage = () => {
        const pageCategory = document.body.dataset.category;
        let productsToDisplay = allProducts;
        
        if (pageCategory) {
            productsToDisplay = allProducts.filter(p => p.category.toLowerCase() === pageCategory);
            if(pageTitle) pageTitle.textContent = pageCategory.charAt(0).toUpperCase() + pageCategory.slice(1);
        }
        
        renderProducts(productsToDisplay);

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = productsToDisplay.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.farmName.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    };

    productGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const productId = card.dataset.productId;
            const product = allProducts.find(p => p.id === productId);
            if (product) openModal(product);
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- Initial Load ---
    fetchData();
    updateCartCount();
});