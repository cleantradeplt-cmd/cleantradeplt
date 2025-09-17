document.addEventListener('DOMContentLoaded', () => {
    
    const EMAILJS_PUBLIC_KEY = 'n7p26MlJDwiC8k-nx'; 
    
    // --- EMAILJS CONFIG ---
    const EMAILJS_SERVICE_ID = 'service_cr5cmmu';
    const EMAILJS_TEMPLATE_ID = 'template_d4bnjvq';

    const cartItemsList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');

    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('cleanTradeCart')) || [];

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const saveCart = () => {
        localStorage.setItem('cleanTradeCart', JSON.stringify(cart));
        renderCart();
    };

    const updateQuantity = (productId, newQuantity) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = Math.max(1, newQuantity); // Quantity cannot be less than 1
            saveCart();
        }
    };

    const removeItem = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    };

    const renderCart = () => {
        cartItemsList.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty. <a href="marketplace.html">Continue Shopping</a></p>';
            totalPriceEl.textContent = '$0.00';
            return;
        }

        const detailedCart = cart.map(cartItem => {
            const product = allProducts.find(p => p.id === cartItem.id);
            return { ...product, ...cartItem };
        });

        detailedCart.forEach(item => {
            const itemTotalPrice = item.pricePerUnit * item.quantity;
            totalPrice += itemTotalPrice;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>From: ${item.farmName}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <div class="cart-item-price">$${itemTotalPrice.toFixed(2)}</div>
                <button class="remove-item-btn" data-id="${item.id}">&times;</button>
            `;
            cartItemsList.appendChild(itemElement);
        });

        totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
    };

    const fetchAndDisplayCart = async () => {
        try {
            const response = await fetch('farms.json');
            const farms = await response.json();
            
            allProducts = farms.flatMap(farm =>
                Object.values(farm.categories).flatMap(category => category.products)
            );
            
            renderCart();
        } catch (error) {
            console.error("Failed to load product data:", error);
            cartItemsList.innerHTML = '<p>Error loading product details. Please try again.</p>';
        }
    };

    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.dataset.id;

        if (!productId) return;

        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            const currentItem = cart.find(item => item.id === productId);
            if (action === 'increase') {
                updateQuantity(productId, currentItem.quantity + 1);
            } else if (action === 'decrease') {
                updateQuantity(productId, currentItem.quantity - 1);
            }
        }

        if (target.classList.contains('remove-item-btn')) {
            if (confirm('Are you sure you want to remove this item?')) {
                removeItem(productId);
            }
        }
    });
    
    cartItemsList.addEventListener('change', (e) => {
        const target = e.target;
        const productId = target.dataset.id;
        if (target.classList.contains('quantity-input')) {
            const newQuantity = parseInt(target.value, 10);
            if (newQuantity > 0) {
                updateQuantity(productId, newQuantity);
            } else {
                target.value = 1; // Reset if invalid value
            }
        }
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty. Please add products before requesting a quote.');
            return;
        }

        // Prepare cart details for the email
        const detailedCart = cart.map(cartItem => {
            const product = allProducts.find(p => p.id === cartItem.id);
            return { ...product, ...cartItem };
        });
        
        const cartDetailsString = detailedCart.map(item => 
            `- ${item.name} (x${item.quantity} ${item.unit})`
        ).join('\n');
        
        const totalPriceValue = totalPriceEl.textContent;
        
        const templateParams = {
            title: `New Quote Request from ${document.getElementById('user_name').value}`,
            user_name: document.getElementById('user_name').value,
            user_email: document.getElementById('user_email').value,
            user_phone: document.getElementById('user_phone').value,
            user_address: `Purpose: ${document.getElementById('user_address').value}\nCountry: ${document.getElementById('user_country').value}`, // Combining purpose and country
            cart_details: cartDetailsString,
            total_price: totalPriceValue
        };
        
        // Send the email
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
               alert('SUCCESS! Your quote request has been sent.', response.status, response.text);
               // Clear cart and form after successful submission
               cart = [];
               localStorage.removeItem('cleanTradeCart');
               checkoutForm.reset();
               renderCart();
            }, (error) => {
               alert('FAILED... Please try again.', error);
            });
    });

    // Initial load
    fetchAndDisplayCart();
});