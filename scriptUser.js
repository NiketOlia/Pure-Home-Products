const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart');
cartBtn.addEventListener('click', showCart);

function showCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';

    cartItems.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.name} - ${item.price} руб. x ${item.quantity}`;
        cartList.appendChild(itemElement);
    });

    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
}
const closeBtns = document.getElementsByClassName('close');
for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
}
