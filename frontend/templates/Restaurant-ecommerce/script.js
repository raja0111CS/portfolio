let cart = [];
let totalPrice = 0;

const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout");

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const itemName = button.getAttribute("data-name");
    const itemPrice = parseFloat(button.getAttribute("data-price"));

    // Add item to cart
    cart.push({ name: itemName, price: itemPrice });
    totalPrice += itemPrice;

    // Update the cart UI
    updateCart();
  });
});

function updateCart() {
  // Clear the current cart display
  cartItemsList.innerHTML = "";

  // Add items to cart UI
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="item-name">${item.name}</span> - $${item.price.toFixed(2)}`;
    cartItemsList.appendChild(li);
  });

  // Update total price
  totalPriceElement.textContent = totalPrice.toFixed(2);

  // Enable checkout if cart has items
  checkoutButton.disabled = cart.length === 0;
}
