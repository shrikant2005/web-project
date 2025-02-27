let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, price) {
    cart.push({ product, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product} has been added to your cart.`);
    displayCart(); 
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `${item.product} - $${item.price.toFixed(2)} <button class="remove-button" onclick="removeFromCart(${index})">Remove</button>`;
        cartItemsContainer.appendChild(div);
        totalPrice += item.price;
    });
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert('Please add some products to your cart before checking out!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

if (document.getElementById('cart-items')) {
    displayCart();
}

if (document.getElementById('payment-form')) {
    const stripe = Stripe('your-publishable-key-here'); 
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (paymentMethod === 'stripe') {
            const response = await fetch('#', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: calculateTotalPrice() * 100 }), 
            });

            const { clientSecret, error } = await response.json();

            if (error) {
                errorMessage.textContent = error;
                errorMessage.classList.remove('hidden');
                submitButton.disabled = false;
            } else {
                const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                    },
                });

                if (stripeError) {
                    errorMessage.textContent = stripeError.message;
                    errorMessage.classList.remove('hidden');
                    submitButton.disabled = false;
                } else {
                    successMessage.classList.remove('hidden');
                    localStorage.removeItem('cart');
                }
            }
        } else if (paymentMethod === 'paypal') {
        } else if (paymentMethod === 'google-pay') {
        } else if (paymentMethod === 'apple-pay') {
        }
    });

    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + item.price, 0);
    }

   
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: calculateTotalPrice().toFixed(2)
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                successMessage.classList.remove('hidden');
                localStorage.removeItem('cart');
            });
        },
        onError: function(err) {
            errorMessage.textContent = err;
            errorMessage.classList.remove('hidden');
        }
    }).render('#paypal-button-container');

   
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('stripe-element').classList.add('hidden');
            document.getElementById('paypal-button-container').classList.add('hidden');
            document.getElementById('google-pay-button-container').classList.add('hidden');
            document.getElementById('apple-pay-button-container').classList.add('hidden');

            if (radio.value === 'stripe') {
                document.getElementById('stripe-element').classList.remove('hidden');
            } else if (radio.value === 'paypal') {
                document.getElementById('paypal-button-container').classList.remove('hidden');
            } else if (radio.value === 'google-pay') {
                document.getElementById('google-pay-button-container').classList.remove('hidden');
            } else if (radio.value === 'apple-pay') {
                document.getElementById('apple-pay-button-container').classList.remove('hidden');
            }
        });
    });
}


if (document.getElementById('contact-form')) {
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Thank you for reaching out. We will get back to you shortly.');
        contactForm.reset();
    });
}

const products = [
    { name: 'LG Refrigerator', category: 'electronics', price: 125000, image: 'img/lg_refrigerator.jpg' },
    { name: 'MAC DESKTOP', category: 'laptops', price: 154000, image: 'img/mac_desktop.jpg '},
    { name: 'LG Washing Machine', category: 'electronics', price: 36000, image: 'img/lg_washingmachine.jpg' },
    { name: 'Nikai Mixer Grinder', category: 'electronics', price: 3000, image: 'img/nikai_grinder.jpg' },
    { name: 'Oster Oven', category: 'electronics', price: 2000, image: 'img/oster_oven.jpg' },
    { name: 'Women Dress', category: 'clothing', price: 3500, image: 'img/dress2_women.jpg' },
    { name: 'Women Dress', category: 'clothing', price: 3000, image: 'img/dress_women.jpg' },
    { name: 'Men Suit', category: 'clothing', price: 5000, image: 'img/suits_men.jpg' },
    { name: 'Sofa', category: 'home-kitchen', price: 7000, image: 'img/sofa.jpg' },
    { name: 'Grinder', category: 'home-kitchen', price: 3000, image: 'img/nikai_grinder.jpg' },
    { name: 'Bed Sheet', category: 'home-kitchen', price: 400, image: 'img/bedsheet.jpg' },
    { name: 'Remote control Helicopter', category: 'toys-games', price: 2500, image: 'img/helicopter.jpg' },
    { name: 'Car', category: 'toys-games', price: 500, image: 'img/car_toy.jpg' },
    { name: 'Doll', category: 'toys-games', price: 300, image: 'img/doll.jpg' },
    { name: 'Puzzle', category: 'toys-games', price: 150, image: 'img/puzzles.jpg' },
    { name: 'Dell', category: 'laptops', price: 15000, image: 'img/dell.jpg' },
    { name: 'HP Pavilion', category: 'laptops', price: 70000, image: 'img/HP_pavilion.jpg' },
    { name: 'Samsung', category: 'laptops', price: 60000, image: 'img/samsung-laptop.jpg' },
    { name: 'Samsung A70', category: 'mobile-phones', price: 30000, image: 'img/samsung_phone.jpg' },
    { name: 'iphone 14(256GB)', category: 'mobile-phones', price: 62000, image: 'img/iphone_14(256GB).jpg' },
    { name: 'Realme Q2', category: 'mobile-phones', price: 20000, image: 'img/Realme_Q2.jpg' },
    { name: 'mi', category: 'mobile-phones', price: 15000, image: 'img/mi_phone.jpg' },
    { name: 'Sony HD Camera', category: 'cameras', price: 120000, image: 'img/sony_hd_Camera.jpg' },
    { name: 'Nikon D750', category: 'cameras', price: 164000, image: 'img/nikon_D750.jpg' },
    { name: 'Amcrest TVL960H CCTV ', category: 'cameras', price: 20000, image: 'img/Amcrest-TVL-960H-camera.jpg' },
    { name: 'Canon SX70 HS', category: 'cameras', price: 125000, image: 'img/canon_SX70_hs.jpg' },
    { name: 'T-Shirt (MEN)', category: 'clothing', price: 2000, image: 'img/men_t_shirt.jpg' },
    { name: 'T-Shirt (Female)', category: 'clothing', price: 3000, image: 'img/cloths.jpg' },
    { name: 'Men Suit', category: 'mens-clothing', price: 5000, image: 'img/suits_men.jpg' },
    { name: 'T-Shirt (MEN)', category: 'mens-clothing', price: 2000, image: 'img/men_t_shirt.jpg' },
    { name: 'Shirt', category: 'mens-clothing', price: 2500, image: 'img/men_shirt.jpg' },
    { name: 'Shirt', category: 'mens-clothing', price: 3000, image: 'img/men_shirt2.jpg' },
    { name: 'T-Shirt', category: 'mens-clothing', price: 1000, image: 'img/men_tshirt.jpg' },
    { name: 'Suit', category: 'mens-clothing', price: 5000, image: 'img/mens_suit.jpg' },
    { name: 'T-Shirt', category: 'mens-clothing', price: 1000, image: 'img/men_tshirt2.jpg' },
    { name: 'T-Shirt (Female)', category: 'womens-clothing', price: 3000, image: 'img/cloths.jpg' },
    { name: 'Dress', category: 'womens-clothing', price: 3500, image: 'img/dress2_women.jpg' },
    { name: 'Dress', category: 'womens-clothing', price: 3000, image: 'img/dress_women.jpg' },
    { name: 'Fancy Dress', category: 'womens-clothing', price: 4500, image: 'img/women_fancydress.jpg' },
    { name: 'Shirt', category: 'womens-clothing', price: 2500, image: 'img/women_shirt.jpg' },
    { name: 'T-Shirt', category: 'womens-clothing', price: 1000, image: 'img/women_tshirt.jpg' },
    { name: 'Dress', category: 'womens-clothing', price: 2000, image: 'img/women_dress.jpg' },
    { name: 'Heel shoe', category: 'shoes', price: 2000, image: 'img/wome_shoe.jpg' },
    { name: 'Pink Heel Shoe', category: 'shoes', price: 4000, image: 'img/heel_shoe(pink).jpg' },
    { name: 'Heel Shoe', category: 'shoes', price: 3000, image: 'img/heel_shoe.jpg' },
    { name: 'Adids', category: 'shoes', price: 3000, image: 'img/adids_shoe.jpg' },
    { name: 'Sport Shoe', category: 'shoes', price: 1500, image: 'img/sport_shoe.jpg' },
    { name: 'Double Bed', category: 'furniture', price: 25000, image: 'img/bed_furniture.jpg' },
    { name: 'Bed', category: 'furniture', price: 10000, image: 'img/bed2_furniture.jpg' },
    { name: 'Side Table', category: 'furniture', price: 5000, image: 'img/table_furniture.jpg' },
    { name: 'ShowCase', category: 'furniture', price: 15000, image: 'img/furniture.jpg' },
    { name: 'Canon Printer With Ink', category: 'printers-ink', price: 31000, image: 'img/canon_printer.jpg' },
    { name: 'Canon Printer', category: 'printers-ink', price: 35000, image: 'img/canon2_printer.jpg' },
    { name: 'Canon Ink', category: 'printers-ink', price: 800, image: 'img/canon_ink.jpg' },
    { name: 'HP Ink', category: 'printers-ink', price: 1000, image: 'img/hp_ink.jpg' },
    { name: 'HP M2727NF Printer', category: 'printers-ink', price: 33000, image: 'img/hpM2727nf_printer.jpg' },
    { name: 'HP 6510 Printer', category: 'printers-ink', price: 20000, image: 'img/hp6510_printer.jpg' },
    
    
   
];

function displayProducts(category) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        if (category === 'all' || product.category === category) {
            const productItem = document.createElement('div');
            productItem.classList.add('product');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        }
    });
}


document.getElementById('category').addEventListener('change', function() {
    const selectedCategory = this.value;
    displayProducts(selectedCategory);
});


displayProducts('all');

