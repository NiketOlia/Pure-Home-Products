function getProductsFromLocalStorage() {
  const productsStr = localStorage.getItem('products');
  return productsStr ? JSON.parse(productsStr) : [];
}

function saveProductsToLocalStorage(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function getCategoriesFromLocalStorage() {
  const categoriesStr = localStorage.getItem('categories');
  return categoriesStr ? JSON.parse(categoriesStr) : ['all']; 
}

function saveCategoriesToLocalStorage(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}


const productsGrid = document.getElementById('productsGrid');
const categoryButtonsContainer = document.querySelector('.categories');
const priceSortSelect = document.getElementById('price-sort');
const cartItemsList = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartSidebar = document.querySelector('.cart-sidebar'); 
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartNotification = document.getElementById('cartNotification'); 
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const removeProductModal = document.getElementById('removeProductModal');
const productList = document.getElementById('productList');
const removeCategoryModal = document.getElementById('removeCategoryModal');
const categoryList = document.getElementById('categoryList'); 
const clearCartButton = document.getElementById('clearCartBtn');


let currentProducts = getProductsFromLocalStorage();
let currentCategories = getCategoriesFromLocalStorage();


function displayProducts(filteredProducts) {
  productsGrid.innerHTML = ''; 

  filteredProducts.forEach(product => {
    const productCard = `
      <div class="product-card" data-product-id="${product.id}"> 
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">Цена: ${product.price} руб.</p>
        <p>Доставка: ${product.delivery}</p>
        <button class="add-to-cart-btn">Добавить в корзину</button>
      </div>
    `;
    productsGrid.innerHTML += productCard;
  });


  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.parentElement.dataset.productId);
      addProductToCart(productId);
    });
  });
}

function addProductToCart(productId) {
  const productToAdd = currentProducts.find(product => product.id === productId);
  let cart = getCart();

  const existingCartItemIndex = cart.findIndex(item => item.id === productId);

  if (existingCartItemIndex !== -1) {
    cart[existingCartItemIndex].quantity++;
  } else {
    cart.push({
      id: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      imageUrl: productToAdd.imageUrl,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartDisplay();
  updateCartNotification();
}

function getCart() {
  const cartStr = localStorage.getItem('cart');
  return cartStr ? JSON.parse(cartStr) : []; 
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
  const cart = getCart();
  cartItemsList.innerHTML = ''; 

  let cartTotal = 0;

  const groupedCartItems = {};
  cart.forEach(item => {
    if (groupedCartItems[item.id]) {
      groupedCartItems[item.id].quantity++; 
    } else {
      groupedCartItems[item.id] = { ...item };
    }
  });
  const displayedCartItems = Object.values(groupedCartItems);

  displayedCartItems.forEach(item => {
    const cartItemElement = `
      <li data-product-id="${item.id}">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div>
          <p>${item.name}</p>
          <p>${item.price} руб. x ${item.quantity}</p> 
        </div>
        <button class="remove-from-cart-btn">Удалить</button>
      </li>
    `;
    cartItemsList.innerHTML += cartItemElement;
    cartTotal += item.price * item.quantity;
  });

  cartTotalElement.textContent = `Итого: ${cartTotal} руб.`;

  if (displayedCartItems.length > 3) {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.classList.add('cart-slider');
  } else {
  }
  
  const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
  removeFromCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      const productId = parseInt(listItem.dataset.productId);
      removeProductFromCart(productId);
    });
  });


  clearCartButton.style.display = cart.length > 0 ? 'block' : 'none'; 
}

function removeProductFromCart(productId) {
  let cart = getCart();

  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
    updateCartDisplay();
  }
}

function updateCategoryButtons() {

  categoryButtonsContainer.innerHTML = '';


  const allProductsButton = document.createElement('button');
  allProductsButton.dataset.category = 'all';
  allProductsButton.textContent = 'Все товары';
  allProductsButton.classList.add('category-btn');
  allProductsButton.classList.add('active');
  categoryButtonsContainer.appendChild(allProductsButton);


  currentCategories.forEach(category => {
    if (category !== 'all') {
      const categoryButton = document.createElement('button');
      categoryButton.dataset.category = category;
      categoryButton.textContent = category;
      categoryButton.classList.add('category-btn');
      categoryButtonsContainer.appendChild(categoryButton);
    }
  });


  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedCategory = button.dataset.category;
      filterAndDisplayProducts(selectedCategory);
    });
  });
}

function filterAndDisplayProducts(selectedCategory = 'all') {
  const filteredProducts = selectedCategory === 'all'
    ? currentProducts
    : currentProducts.filter(product => product.category === selectedCategory);

  const sortedProducts = sortProductsByPrice(filteredProducts, priceSortSelect.value);
  displayProducts(sortedProducts);
}

function sortProductsByPrice(productsToSort, sortType) {
  if (sortType === 'descending') {
    return productsToSort.slice().sort((a, b) => b.price - a.price);
  }
  if (sortType === 'ascending') {
    return productsToSort.slice().sort((a, b) => a.price - b.price); 
  } else {
    return productsToSort;
  }
}


function closeModal(modalId) {
  const modalToClose = document.getElementById(modalId);
  if (modalToClose) {
    modalToClose.style.display = 'none';
  }
}

function showRemoveProductModal() {
  closeModal('removeProductModal');
  closeModal('removeCategoryModal'); 
  productList.innerHTML = ''; 
  currentProducts.forEach(product => {
    const productItem = `
      <li data-product-id="${product.id}">
        ${product.name} 
        <button onclick="removeProduct(${product.id})">Удалить</button>
      </li>
    `;
    productList.innerHTML += productItem;
  });
  removeProductModal.style.display = 'block';
}

function closeRemoveProductModal() {
  removeProductModal.style.display = 'none';
}

function removeProduct(productId) {
  currentProducts = currentProducts.filter(p => p.id !== productId);
  saveProductsToLocalStorage(currentProducts); 
  closeRemoveProductModal();
  filterAndDisplayProducts(); 
  updateAdminSelects(); 
  closeAdminPanel();
}

function showRemoveCategoryModal() {
  closeModal('removeProductModal');
  closeModal('removeCategoryModal');
  categoryList.innerHTML = '';
  currentCategories.forEach(category => {
    if (category !== 'all') { 
      const categoryItem = `
        <li data-category="${category}">
          ${category}
          <button onclick="removeCategory('${category}')">Удалить</button>
        </li>
      `;
      categoryList.innerHTML += categoryItem;
    }
  });
  removeCategoryModal.style.display = 'block';
}

function closeRemoveCategoryModal() {
  removeCategoryModal.style.display = 'none';
}

function removeCategory(categoryToRemove) {
  currentCategories = currentCategories.filter(cat => cat !== categoryToRemove);
  saveCategoriesToLocalStorage(currentCategories);
  closeRemoveCategoryModal();
  closeAdminPanel();
  updateCategoryButtons(); 
  filterAndDisplayProducts(); 
  updateAdminSelects();
  closeAdminPanel();
}

function addCategory() {
  const newCategoryName = prompt("Введите название новой категории:");
  if (newCategoryName) {
    currentCategories.push(newCategoryName);
    saveCategoriesToLocalStorage(currentCategories);
    updateCategoryButtons(); 
    updateAdminSelects(); 
    alert(`Категория "${newCategoryName}" добавлена!`);
  }
  
}

function addProduct() {
  const newProductName = document.getElementById('productName').value;
  const newProductCategory = document.getElementById('productCategory').value;
  const newProductImageUrl = document.getElementById('productImageUrl').value;
  const newProductPrice = parseFloat(document.getElementById('productPrice').value);
  const newProductDescription = document.getElementById('productDescription').value;
  const newProductDelivery = document.getElementById('productDelivery').value;

  if (newProductName && newProductCategory && newProductImageUrl && newProductPrice && newProductDescription && newProductDelivery) {
    const newProductId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newProductId,
      name: newProductName,
      category: newProductCategory,
      imageUrl: newProductImageUrl,
      price: newProductPrice,
      description: newProductDescription,
      delivery: newProductDelivery
    };

    currentProducts.push(newProduct);
    saveProductsToLocalStorage(currentProducts); 
    alert(`Товар "${newProductName}" добавлен!`);
    closeAdminPanel();
    filterAndDisplayProducts(); 
    updateAdminSelects(); 
  } else {
    alert('Пожалуйста, заполните все поля!');
  }
}

function updateAdminSelects() {
  const productCategorySelect = document.getElementById('productCategory');


  productCategorySelect.innerHTML = '';


  const categories = new Set(currentCategories);


  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    productCategorySelect.appendChild(option);
  });

}

function updateCartNotification() {
  const cart = getCart();
  const cartQuantity = cart.length;

  if (cartQuantity > 0) {
    cartNotification.textContent = cartQuantity;
    cartNotification.classList.add('active'); 
  } else {
    cartNotification.classList.remove('active'); 
  }
}

adminBtn.addEventListener('click', () => {
  adminPanel.style.display = 'flex';
  updateAdminSelects();
});

function closeAdminPanel() {
  adminPanel.style.display = 'none';
}

cartToggleBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('active'); 
});

closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('active'); 
});

priceSortSelect.addEventListener('change', () => {
  filterAndDisplayProducts();
});


updateCartNotification();
updateCategoryButtons();
filterAndDisplayProducts();


function clearCart() {
  localStorage.removeItem('cart');
  updateCartDisplay();
  updateCartNotification();
}



clearCartButton.addEventListener('click', clearCart);

fetch('products.json') 
  .then(response => response.json())
  .then(data => {
    currentProducts = data;
    saveProductsToLocalStorage(currentProducts);
    updateCategoryButtons();
    filterAndDisplayProducts();
  })
  .catch(error => console.error('Ошибка загрузки данных:', error));

  fetch('category.json')
  .then(response => response.json())
  .then(data => {
    currentCategories = data;
    saveCategoriesToLocalStorage(currentCategories);
    updateCategoryButtons();
    filterAndDisplayProducts();
  })
  .catch(error => console.error('Ошибка загрузки данных:', error));

  document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cartItems');

    window.removeFromCart = (id) => {
        const items = cartItems.querySelectorAll('li');
        items.forEach(item => {
            if (item.querySelector('button').getAttribute('onclick').includes(id)) {
                item.remove();
            }
        });
    };
});