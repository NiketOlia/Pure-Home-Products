const deleteProductBtn = document.getElementById('delete-product-btn');
const deleteProductModal = document.getElementById('delete-product-modal');
const deleteProductSelect = document.getElementById('delete-product');
const deleteProductConfirmBtn = document.getElementById(
  'delete-product-btnc'
);

deleteProductConfirmBtn.addEventListener('click', () => {
  const productName = deleteProductSelect.value;
  products = products.filter((product) => product.name !== productName);
  localStorage.setItem('products', JSON.stringify(products));
  removeFromCart(productName);
  displayProducts();
  deleteProductModal.style.display = 'none';
});

let products = [];

function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

document.addEventListener('DOMContentLoaded', () => {
  products = JSON.parse(localStorage.getItem('products')) || [];
  displayProducts();
  loadCategories();
});

const cartBtn = document.getElementById('cart');
const cartModal = document.getElementById('cart-modal');
cartBtn.addEventListener('click', showCart);

const closeBtns = document.getElementsByClassName('close');
for (let i = 0; i < closeBtns.length; i++) {
  closeBtns[i].addEventListener('click', () => {
    addProductModal.style.display = 'none';
    cartModal.style.display = 'none';
    addCategoryModal.style.display = 'none';
    deleteModal.style.display = 'none';
    productCardModal.style.display = 'none';
  });
}
const productCardModal = document.getElementById('product-card-modal');

// --- ФУНКЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ ---
function addToCart(product) {
  console.log('Adding product:', product);
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let existingItem = cartItems.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cartItems.push(product);
  }
  console.log('Cart items:', cartItems);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartCount();
}

// --- ФУНКЦИЯ ОТОБРАЖЕНИЯ КОРЗИНЫ ---
function showCart() {
  console.log('Showing cart');
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartList.innerHTML = '';
  let totalPrice = 0;

  if (cartItems.length === 0) {
    cartList.innerHTML = '<li>Корзина пуста</li>';
  } else {
    cartItems.forEach((item) => {
      console.log('Processing cart item:', item);
      const itemElement = document.createElement('li');
      itemElement.textContent = `${item.name} - ${item.price} руб. x ${item.quantity}`;
      cartList.appendChild(itemElement);
      totalPrice += item.price * item.quantity;
    });
    cartTotal.textContent = totalPrice;
  }

  const cartModal = document.getElementById('cart-modal');
  cartModal.style.display = 'block';
}

updateCartCount();
displayProducts();

function displayProducts(category = 'all') {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  const filteredProducts =
    category === 'all'
      ? products
      : products.filter((product) => product.category === category);

  filteredProducts.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${
                      product.imageUrl || 'path/to/default/image.jpg'
                    }" alt="${product.name}" />
                    <p>Категория: ${product.category}</p>
                    <p>Цена: ${product.price} руб.</p>
                    <p>Количество: ${product.quantity}</p>
                    <input type="number" min="1"  value="1" class="product-quantity"> 
                    <button class="add-to-cart">Добавить в корзину</button>
                `;
    productList.appendChild(productDiv);

    // --- ОБРАБОТЧИК ДЛЯ КНОПКИ "ДОБАВИТЬ В КОРЗИНУ" ---
    const addToCartButton = productDiv.querySelector('.add-to-cart');
addToCartButton.addEventListener('click', () => {
  const productDiv = addToCartButton.closest('.product'); // Используем addToCartButton
  const productName = productDiv.querySelector('h3').textContent;
  const productPrice = parseFloat(
    productDiv
      .querySelector('p:nth-child(3)')
      .textContent.replace('Цена: ', '')
      .replace(' руб.', '')
  );
  const productQuantityInput = productDiv.querySelector('.product-quantity');
  const productQuantity = parseInt(productQuantityInput.value);

  addToCart({
    name: productName,
    price: productPrice,
    quantity: productQuantity,
  });

  productQuantityInput.value = 1;
});
  });
}

function filterProducts(category) {
  displayProducts(category);
  const categoryLinks = document.querySelectorAll(
    '#product-catalog ul li a'
  );
  categoryLinks.forEach((link) => link.classList.remove('active'));
  const selectedLink = document.querySelector(
    `#product-catalog ul li a[data-category="${category}"]`
  );
  if (selectedLink) {
    selectedLink.classList.add('active');
  }
}

function clearCart() {
  localStorage.removeItem('cartItems');
  updateCartCount();
  showCart();
}
const clearCartBtn = document.getElementById('clear-cart-btn');
clearCartBtn.addEventListener('click', clearCart);

const addCategoryBtn = document.getElementById('add-category-btn');
const addCategoryModal = document.getElementById('add-category-modal');
const addCategoryForm = document.getElementById('add-category-form');
const deleteModal = document.getElementById('delete-product-modal');

addCategoryBtn.addEventListener('click', () => {
  addCategoryModal.style.display = 'block';
});

// --- ФУНКЦИЯ ДОБАВЛЕНИЯ КАТЕГОРИИ ---
function addCategory(categoryName) {
  const categoryList = document.getElementById('product-catalog').querySelector(
    'ul'
  );
  const newCategory = document.createElement('li');
  const newCategoryLink = document.createElement('a');
  newCategoryLink.href = '#';
  newCategoryLink.dataset.category = categoryName.toLowerCase();
  newCategoryLink.textContent = categoryName;
  newCategoryLink.classList.add('category-link', 'new-category-link');
  newCategory.appendChild(newCategoryLink);
  categoryList.appendChild(newCategory);
  const addProductCategorySelect =
    document.getElementById('product-category');
  const newOption = document.createElement('option');
  newOption.value = categoryName.toLowerCase();
  newOption.textContent = categoryName;
  addProductCategorySelect.appendChild(newOption);
  const deleteCategorySelect = document.getElementById('delete-category');
  const newDeleteOption = document.createElement('option');
  newDeleteOption.value = categoryName.toLowerCase();
  newDeleteOption.textContent = categoryName;
  deleteCategorySelect.appendChild(newDeleteOption);
  newCategoryLink.addEventListener('click', (event) => {
    event.preventDefault();
    categoryLinks.forEach((link) => link.classList.remove('active'));
    event.target.classList.add('active');
    const category = event.target.dataset.category;
    displayProducts(category);
  });
}

// --- ФУНКЦИЯ ЗАГРУЗКИ КАТЕГОРИЙ ---
function loadCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const categorySelect = document.getElementById('product-category');
  const categorySelectDelete = document.getElementById('delete-category');

  categories.forEach((categoryName) => {
    addCategory(categoryName);
  });
}

// --- ОБРАБОТЧИК ФОРМЫ ДОБАВЛЕНИЯ КАТЕГОРИИ ---
addCategoryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const categoryName = document.getElementById('category-name').value.trim();

  if (categoryName) {
    addCategory(categoryName);

    // Сохраняем новую категорию в localStorage
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.push(categoryName);
    localStorage.setItem('categories', JSON.stringify(categories));

    addCategoryModal.style.display = 'none';
    addCategoryForm.reset();
  }
});

document.getElementById('category-block').addEventListener('click', (event) => {
  if (event.target.classList.contains('category-link')) {
    event.preventDefault();
    document.querySelectorAll('.category-link').forEach((link) =>
      link.classList.remove('active')
    );
    event.target.classList.add('active');
    const category = event.target.dataset.category;
    displayProducts(category);
  }
});

const deleteCategoryBtn = document.getElementById('delete-category-btn');

deleteCategoryBtn.addEventListener('click', () => {
    const categoryToDelete = document.getElementById('delete-category').value;
  
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories = categories.filter((category) => category !== categoryToDelete);
    localStorage.setItem('categories', JSON.stringify(categories));
  
    products = products.filter(
      (product) => product.category !== categoryToDelete
    );
    localStorage.setItem('products', JSON.stringify(products));
  
    removeProductsFromCartByCategory(categoryToDelete);
  
    const categoryLink = document.querySelector(
      `a[data-category="${categoryToDelete}"]`
    );
    if (categoryLink) {
      categoryLink.parentNode.remove();
    }
    const categoryOption = document.querySelector(
      `#product-category option[value="${categoryToDelete}"]`
    );
    if (categoryOption) {
      categoryOption.remove();
    }
    const deleteCategoryOption = document.querySelector(
      `#delete-category option[value="${categoryToDelete}"]`
    );
    if (deleteCategoryOption) {
      deleteCategoryOption.remove();
    }
  
    displayProducts();
    deleteModal.style.display = 'none';
  });

function removeFromCart(productName) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter((item) => item.name !== productName);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
  }

  function removeProductsFromCartByCategory(categoryToDelete) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(
      (item) => item.category !== categoryToDelete
    );
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
  }



window.addEventListener('click', (event) => {
  if (event.target === addCategoryModal) {
    addCategoryModal.style.display = 'none';
  }
});

const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = addProductModal.querySelector('form');

addProductBtn.addEventListener('click', () => {
  addProductModal.style.display = 'block';
});
addProductForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const productName = document.getElementById('product-name').value;
  const productCategory = document.getElementById('product-category').value;
  const productPrice = parseFloat(
    document.getElementById('product-price').value
  );
  const productQuantity = parseInt(
    document.getElementById('product-quantity').value
  );
  const productDescription =
    document.getElementById('product-description').value;
  const productImageUrl = document.getElementById('product-image').value;

  const newProduct = {
    name: productName,
    category: productCategory,
    price: productPrice,
    quantity: productQuantity,
    description: productDescription,
    imageUrl: productImageUrl,
  };

  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));

  addProductModal.style.display = 'none';
  addProductForm.reset();

  // Повторно отображаем товары выбранной категории
  displayProducts(newProduct.category);
  addProductForm.reset();
});
deleteProductBtn.addEventListener('click', () => {
  deleteProductSelect.innerHTML = '';
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.name;
    option.text = product.name;
    deleteProductSelect.add(option);
  });
  deleteProductModal.style.display = 'block';
});