
        const deleteProductBtn = document.getElementById('delete-product-btn');
        const deleteProductModal = document.getElementById('delete-product-modal');
        const deleteProductSelect = document.getElementById('delete-product');
        const deleteProduct = document.getElementById('delete-product-btnc');
        deleteProduct.addEventListener('click', () => {
        const productName = deleteProductSelect.value;
        products = products.filter(product => product.name !== productName);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        deleteProductModal.style.display = 'none';
        });
        let products = [];
        function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cartItems.length;
        }

        document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', () => {
        const productName = product.querySelector('h3').textContent;
        const productCategory = product.querySelector('p:nth-child(2)').textContent.replace('Категория: ', '');
        const productPrice = product.querySelector('p:last-child').textContent.replace('Цена: ', '').replace(' руб.', '');
        const selectedProduct = products.find(p => p.name === productName && p.category === productCategory && p.price === parseFloat(productPrice));

        if (selectedProduct) {
            const modal = document.getElementById('product-card-modal');
            const cardName = document.getElementById('product-card-name');
            const cardCategory = document.getElementById('product-card-category');
            const cardPrice = document.getElementById('product-card-price');
            const cardDescription = document.getElementById('product-card-description');
            const cardImage = document.getElementById('product-card-image');

            cardName.textContent = selectedProduct.name;
            cardCategory.textContent = `Категория: ${selectedProduct.category}`;
            cardPrice.textContent = `Цена: ${selectedProduct.price} руб.`;
            cardDescription.textContent = selectedProduct.description || 'Описание отсутствует';
            cardImage.src = selectedProduct.imageUrl;

            modal.style.display = 'block';
        }
    });
});
    deleteProductBtn.addEventListener('click', () => {
        deleteProductSelect.innerHTML = '';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.text = product.name;
            deleteProductSelect.add(option);
        });
        deleteProductModal.style.display = 'block';
    }); 
        const addProductBtn = document.getElementById('add-product-btn');
        const addProductModal = document.getElementById('add-product-modal');
        const addProductForm = addProductModal.querySelector('form');

        addProductBtn.addEventListener
        addProductBtn.addEventListener('click', () => {
        addProductModal.style.display = 'block';});
//Создание карточки товара 
        addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productQuantity = parseInt(document.getElementById('product-quantity').value);
    const productDescription = document.getElementById('product-description').value;
    const productImageUrl = document.getElementById('product-image').value;

    const newProduct = {
        name: productName,
        category: productCategory,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
        description: productDescription,
        imageUrl: productImageUrl
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    addProductModal.style.display = 'none';
    addProductForm.reset();
});
//Создание карточки товара 

document.addEventListener('DOMContentLoaded', () => {
    products = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts();
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
    });
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.parentNode.querySelector('h3').textContent;
        const productCategory = button.parentNode.querySelector('p:nth-child(2)').textContent.replace('Категория: ', '');
        const productPrice = parseFloat(button.parentNode.querySelector('p:nth-child(3)').textContent.replace('Цена: ', '').replace(' руб.', ''));
        const productQuantity = parseInt(button.parentNode.querySelector('p:last-child').textContent.replace('Количество: ', ''));

        const product = products.find(p => p.name === productName && p.category === productCategory && p.price === productPrice);

        if (product) {
            product.quantity -= productQuantity;
            addToCart({ ...product, quantity: productQuantity });
            button.parentNode.querySelector('p:last-child').textContent = `Количество: ${product.quantity}`;
        }
    });
});

    updateCartCount();
    displayProducts();
            function displayProducts(category = 'all') {
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';

            const filteredProducts = category === 'all'
                ? products
                : products.filter(product => product.category === category);

            filteredProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.imageUrl || 'path/to/default/image.jpg'}" alt="${product.name}" />
                    <p>Категория: ${product.category}</p>
                    <p>Цена: ${product.price} руб.</p>
                    <p>Шт. ${product.quantity}</p>
                    <button class="add-to-cart">Добавить в корзину</button>
                `;
                productList.appendChild(productDiv);
            });
            addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

        }

        function addToCart(event) {
    const productNode = event.target.parentNode;
    const productName = productNode.querySelector('h3').textContent;
    const productPrice = parseFloat(productNode.querySelector('p:nth-child(3)').textContent.replace('Цена: ', '').replace(' руб.', ''));
    const productQuantity = parseInt(productNode.querySelector('p:nth-child(4)').textContent.replace('Количество: ', ''));
    const product = { name: productName, price: productPrice, quantity: productQuantity };

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let item = cartItems.find(item => item.name === productName);

    if (item) {
        item.quantity += productQuantity;
    } else {
        cartItems.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
} 

function filterProducts(category) {
    displayProducts(category);

const categoryLinks = document.querySelectorAll('#product-catalog ul li a');
categoryLinks.forEach(link => link.classList.remove('active'));

    const selectedLink = document.querySelector(`#product-catalog ul li a[data-category="${category}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }
}

displayProducts();
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

addCategoryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const categoryName = document.getElementById('category-name').value;
    const categoryList = document.getElementById('product-catalog').querySelector('ul');
    const newCategory = document.createElement('li');
    const newCategoryLink = document.createElement('a');
    newCategoryLink.href = '#';
    newCategoryLink.dataset.category = categoryName.toLowerCase();
    newCategoryLink.textContent = categoryName;
    newCategoryLink.classList.add('category-link', 'new-category-link');
    newCategory.appendChild(newCategoryLink);
    categoryList.appendChild(newCategory);
    const addProductCategorySelect = document.getElementById('product-category');
    const newOption = document.createElement('option');
    newOption.value = categoryName.toLowerCase();
    newOption.textContent = categoryName;
    addProductCategorySelect.appendChild(newOption);
    const deleteCategorySelect = document.getElementById('delete-category');
    const newDeleteOption = document.createElement('option');
    newDeleteOption.value = categoryName.toLowerCase();
    newDeleteOption.textContent = categoryName;
    deleteCategorySelect.appendChild(newDeleteOption);
    addCategoryModal.style.display = 'none';
    addCategoryForm.reset();
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.push(categoryName.toLowerCase());
    localStorage.setItem('categories', JSON.stringify(categories));
    addCategoryModal.style.display = 'none';
    addCategoryForm.reset();
    newCategoryLink.addEventListener('click', (event) => {
        event.preventDefault();
        categoryLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
        const category = event.target.dataset.category;
        displayProducts(category);
    });
});

const categoryLinks = document.querySelectorAll('.category-link');

// Объедините обработчики в одной области видимости для всех категорий
document.getElementById('category-block').addEventListener('click', (event) => {
    // Проверяем, что клик был сделан по элементу с классом 'category-link'
    if (event.target.classList.contains('category-link')) {
        event.preventDefault();

        // Удаляем класс 'active' со всех ссылок
        document.querySelectorAll('.category-link').forEach(link => link.classList.remove('active'));

        // Добавляем класс 'active' к выбранной категории
        event.target.classList.add('active');

        // Отображаем продукты соответствующей категории
        const category = event.target.dataset.category;
        displayProducts(category);
    }
});

const deleteCategoryBtn = document.getElementById('delete-category-btn');

deleteCategoryBtn.addEventListener('click', () => {
    const categoryToDelete = document.getElementById('delete-category').value;


    const categoryLink = document.querySelector(`a[data-category="${categoryToDelete}"]`);
    if (categoryLink) {
        categoryLink.parentNode.remove();
    }


    const categoryOption = document.querySelector(`#product-category option[value="${categoryToDelete}"]`);
    if (categoryOption) {
        categoryOption.remove();
    }


    const deleteCategoryOption = document.querySelector(`#delete-category option[value="${categoryToDelete}"]`);
    if (deleteCategoryOption) {
        deleteCategoryOption.remove();
    }

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories = categories.filter(category => category !== categoryToDelete);
    localStorage.setItem('categories', JSON.stringify(categories));

    products = products.filter(product => product.category !== categoryToDelete);
    localStorage.setItem('products', JSON.stringify(products));

    displayProducts();
    deleteModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === addCategoryModal) {
        addCategoryModal.style.display = 'none';
    }
});
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


document.addEventListener('DOMContentLoaded', () => {
    // Загрузка сохранённых товаров
    products = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts();

    // Загрузка сохранённых категорий
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categorySelect = document.getElementById('product-category');
    const categorySelectDelete = document.getElementById('delete-category');
    categories.forEach(categoryName => {
        const categoryList = document.getElementById('product-catalog').querySelector('ul');
        const newCategory = document.createElement('li');
        const newCategoryLink = document.createElement('a');
        newCategoryLink.href = '#';
        newCategoryLink.dataset.category = categoryName;
        newCategoryLink.textContent = categoryName;
        newCategoryLink.classList.add('category-link');
        newCategory.appendChild(newCategoryLink);
        categoryList.appendChild(newCategory);

        // Добавляем категории в список для удаления
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelectDelete.appendChild(option);

        // Добавление в форму добавления товаров
        const optionToAdd = document.createElement('option');
        optionToAdd.value = categoryName;
        optionToAdd.textContent = categoryName;
        categorySelect.appendChild(optionToAdd);

    });
    
    displayProducts();
});
