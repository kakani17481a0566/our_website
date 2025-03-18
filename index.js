// Global cart object to store cart items
let cart = [];
let selectedPaymentMethod = "razorpay"; // Default payment method is Razorpay

// Function to update the cart display and cart summary
function updateCart() {
  let cartDetails = document.getElementById("cart-details");
  let payButton = document.getElementById("pay-button");

  if (cart.length === 0) {
    cartDetails.innerHTML = "Your cart is currently empty.";
    document.getElementById("cart-summary").style.display = "none";
    payButton.disabled = true;
  } else {
    let cartHTML = "";
    let totalItems = 0;
    let subtotal = 0;

    // Iterate through the cart and generate HTML
    cart.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.totalAmount;

      cartHTML += `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 50px; height: 50px;">
          <div class="cart-item-details">
            <h5>${item.name}</h5>
            <p>₹${item.price.toFixed(2)} each</p>
          </div>
          <div class="cart-item-actions d-flex">
            <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-name="${item.name}" style="width: 60px;">
            <button class="btn btn-danger ms-2 remove-item" data-name="${item.name}">Remove</button>
          </div>
          <div class="cart-item-total">
            <strong>₹${item.totalAmount.toFixed(2)}</strong>
          </div>
        </div>
      `;
    });

    // Update cart details and summary
    document.getElementById("cart-items").innerHTML = cartHTML;

    document.getElementById("total-items").textContent = totalItems;
    document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `₹50.00`;
    let totalAmount = subtotal + 50; // Adding shipping
    document.getElementById("total-amount").innerHTML = `<strong>₹${totalAmount.toFixed(2)}</strong>`;

    // Show the cart summary and enable the payment button
    document.getElementById("cart-summary").style.display = "block";
    payButton.disabled = false;
  }
}

// Add product to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    let productId = this.getAttribute('data-product');
    let quantity = parseInt(document.getElementById(`quantity${productId}`).value);
    let price = parseFloat(this.closest('form').getAttribute('data-price'));
    let name = this.closest('form').getAttribute('data-name');
    let image = this.closest('.card').querySelector('.carousel-item img').src;

    // Check if the product already exists in the cart
    let existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
      existingProduct.quantity += quantity;
      existingProduct.totalAmount = existingProduct.quantity * price;
    } else {
      cart.push({
        name: name,
        quantity: quantity,
        price: price,
        totalAmount: quantity * price,
        image: image
      });
    }

    // Update the cart after adding a new item
    updateCart();
  });
});

// Update item quantity in the cart
document.getElementById("cart-items").addEventListener('change', function(event) {
  if (event.target && event.target.classList.contains('quantity-input')) {
    let productName = event.target.getAttribute('data-name');
    let newQuantity = parseInt(event.target.value);
    let product = cart.find(item => item.name === productName);

    if (product) {
      product.quantity = newQuantity;
      product.totalAmount = newQuantity * product.price;
      updateCart();
    }
  }
});

// Remove item from cart
document.getElementById("cart-items").addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('remove-item')) {
    let productName = event.target.getAttribute('data-name');
    cart = cart.filter(item => item.name !== productName);
    updateCart();
  }
});

// Handle payment method selection
document.querySelectorAll('input[name="payment_method"]').forEach(input => {
  input.addEventListener('change', function() {
    selectedPaymentMethod = this.value;
  });
});

// Proceed to Payment button functionality
document.getElementById("pay-button").addEventListener("click", function() {
  let totalAmount = cart.reduce((acc, item) => acc + item.totalAmount, 0) + 50; // Adding shipping

  if (selectedPaymentMethod === "razorpay") {
    var options = {
      key: 'YOUR_RAZORPAY_KEY', // Enter your Razorpay Key here
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      name: "CricketGloveStore",
      description: "Premium Cricket Gloves",
      image: "https://www.cricketglovestore.com/logo.png", // Replace with your logo
      order_id: generateOrderId(),
      handler: function (response) {
        // Handle successful payment
        alert("Payment successful! Your order ID: " + response.razorpay_order_id);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "1234567890"
      }
    };
    
    var rzp1 = new Razorpay(options);
    rzp1.open();
  } else if (selectedPaymentMethod === "cod") {
    alert("Order placed successfully with Cash on Delivery method.");
  }
});

// Generate a dummy order ID
function generateOrderId() {
  return "ORD" + new Date().getTime();
}
