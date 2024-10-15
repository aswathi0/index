// Retrieve stored username, ads, cart from localStorage
let currentUsername = localStorage.getItem('username') || '';
let ads = JSON.parse(localStorage.getItem('ads')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display existing ads on page load
ads.forEach(ad => {
    displayAd(ad.title, ad.description, ad.price, ad.imageURL, ad.username, ad.dateTime, ad.contact, ad.location);
});

// Set the username if it exists
if (currentUsername) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('listings').style.display = 'block';
    document.getElementById('post-ad').style.display = 'block';
    document.getElementById('logout').style.display = 'inline';
}

// Handle ad submission
document.getElementById('ad-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;
    const now = new Date();
    const dateTime = now.toLocaleString();
    const imageURL = URL.createObjectURL(imageFile);

    const ad = { title, description, price, imageURL, username: currentUsername, dateTime, contact, location };
    displayAd(title, description, price, imageURL, currentUsername, dateTime, contact, location);
    saveAd(ad);
    document.getElementById('ad-form').reset();
});

// Function to display the ad
function displayAd(title, description, price, imageURL, username, dateTime, contact, location) {
    const adContainer = document.getElementById('ad-container');
    const newListing = document.createElement('div');
    newListing.classList.add('listing');

    newListing.innerHTML = `
        <h3>${title}</h3>
        <img src="${imageURL}" alt="${title}" style="width: 100px;">
        <p>${description}</p>
        <p>Price: $${price}</p>
        <p>Posted by: ${username}</p>
        <p>Date: ${dateTime}</p>
        <p>Contact: ${contact}</p>
        <p>Location: ${location}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
        <button class="delete-btn">Delete Ad</button>
    `;

    adContainer.appendChild(newListing);

    // Add functionality to add to cart
    newListing.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        addToCart(title, price, imageURL);
    });

    // Add delete functionality
    newListing.querySelector('.delete-btn').addEventListener('click', function() {
        deleteAd(title);
        newListing.remove();
    });
}

// Function to save the ad to localStorage
function saveAd(ad) {
    ads.push(ad);
    localStorage.setItem('ads', JSON.stringify(ads));
}

// Function to delete the ad
function deleteAd(title) {
    ads = ads.filter(ad => ad.title !== title);
    localStorage.setItem('ads', JSON.stringify(ads));
}

// Function to add items to the cart
function addToCart(title, price, imageURL) {
    const item = { title, price, imageURL };
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    displayCartItems();
}

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
            <img src="${item.imageURL}" alt="${item.title}" style="width: 100px;">
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Show payment form if there are items in the cart
    document.getElementById('payment-form').style.display = cart.length > 0 ? 'block' : 'none';
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = cart.length;
    displayCartItems();
}

// Search function
function filterAds() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const adContainer = document.getElementById('ad-container');
    adContainer.innerHTML = ''; // Clear current listings

    ads.forEach(ad => {
        if (ad.title.toLowerCase().includes(searchTerm) || ad.description.toLowerCase().includes(searchTerm)) {
            displayAd(ad.title, ad.description, ad.price, ad.imageURL, ad.username, ad.dateTime, ad.contact, ad.location);
        }
    });
}

// Show login form when clicking the login link
document.getElementById('login-link').addEventListener('click', function() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('listings').style.display = 'none';
    document.getElementById('post-ad').style.display = 'none';
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    currentUsername = username;

    document.getElementById('login').style.display = 'none';
    document.getElementById('listings').style.display = 'block';
    document.getElementById('post-ad').style.display = 'block';
    document.getElementById('logout').style.display = 'inline';
    document.getElementById('login-form').reset();
});

// Logout functionality
document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('username');
    currentUsername = '';
    ads = [];
    localStorage.removeItem('ads');
    cart = [];
    localStorage.removeItem('cart');
    document.getElementById('cart-count').innerText = 0;
    document.getElementById('login').style.display = 'block';
    document.getElementById('listings').style.display = 'none';
    document.getElementById('post-ad').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
});

// Show cart when clicking the cart link
document.getElementById('cart-link').addEventListener('click', function() {
    document.getElementById('cart').style.display = 'block';
    document.getElementById('listings').style.display = 'none';
    document.getElementById('post-ad').style.display = 'none';
    displayCartItems();
});

// Checkout button functionality
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        document.getElementById('payment-form').style.display = 'block';
    } else {
        alert("Your cart is empty!");
    }
});

// Handle payment form submission
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert("Payment processed successfully!");
    // Clear cart after payment
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').innerText = 0;
    displayCartItems();
    document.getElementById('payment-form').style.display = 'none';
});
