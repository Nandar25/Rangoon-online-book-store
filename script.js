const initialBooks = [
    {
        id: 1,
        title: "The Great Adventure",
        author: "John Doe",
        price: 19.99,
        category: "Fiction",
        description: "An epic journey through unknown lands.",
        image: "https://picsum.photos/seed/adventure/200/300",
        soldCount: 15,
        stock: 10
    },
    {
        id: 2,
        title: "Learning JavaScript",
        author: "Jane Smith",
        price: 29.99,
        category: "Science",
        description: "A practical guide to modern web development.",
        image: "https://picsum.photos/seed/js/200/300",
        soldCount: 42,
        stock: 10
    },
    {
        id: 3,
        title: "History of the World",
        author: "Robert Brown",
        price: 24.50,
        category: "History",
        description: "A comprehensive look at human civilization.",
        image: "https://picsum.photos/seed/history/200/300",
        soldCount: 8,
        stock: 10
    },
    {
        id: 4,
        title: "Cooking Masterclass",
        author: "Chef Mario",
        price: 15.00,
        category: "Fiction",
        description: "Delicious recipes wrapped in a heartwarming story.",
        image: "https://picsum.photos/seed/cooking/200/300",
        soldCount: 25,
        stock: 10
    },
    {
        id: 5,
        title: "The Silent Forest",
        author: "Emily White",
        price: 12.99,
        category: "Fiction",
        description: "A mystery set in the deep woods of Oregon.",
        image: "https://picsum.photos/seed/forest/200/300",
        soldCount: 30,
        stock: 10
    },
    {
        id: 6,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 14.99,
        category: "Fiction",
        description: "Between life and death there is a library.",
        image: "https://picsum.photos/seed/midnight/200/300",
        soldCount: 50,
        stock: 12
    },
    {
        id: 7,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 22.00,
        category: "History",
        description: "A brief history of humankind.",
        image: "https://picsum.photos/seed/sapiens/200/300",
        soldCount: 100,
        stock: 5
    },
    {
        id: 8,
        title: "Atomic Habits",
        author: "James Clear",
        price: 18.50,
        category: "Non-Fiction",
        description: "An easy and proven way to build good habits.",
        image: "https://picsum.photos/seed/habits/200/300",
        soldCount: 85,
        stock: 20
    },
    {
        id: 9,
        title: "Brief Answers to the Big Questions",
        author: "Stephen Hawking",
        price: 25.00,
        category: "Science",
        description: "The final book from the world's most famous cosmologist.",
        image: "https://picsum.photos/seed/hawking/200/300",
        soldCount: 40,
        stock: 8
    },
    {
        id: 10,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 13.00,
        category: "Fiction",
        description: "A fable about following your dream.",
        image: "https://picsum.photos/seed/alchemist/200/300",
        soldCount: 200,
        stock: 15
    }
];

let books = [];
let basket = [];

const bookListElement = document.getElementById('book-list');
const basketItemsElement = document.getElementById('basket-items');
const totalPriceElement = document.getElementById('total-price');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessage = document.getElementById('confirmation-message');
const closeModalButton = document.getElementById('close-modal');
const modalOkButton = document.getElementById('modal-ok-button');

function loadData() {
    console.log("Loading data...");
    
    const savedBooks = localStorage.getItem('bookstore_books');
    if (savedBooks) {
        books = JSON.parse(savedBooks);
        console.log("Loaded books from localStorage:", books);
    } else {
        books = initialBooks;
        localStorage.setItem('bookstore_books', JSON.stringify(books));
        console.log("No saved books found. Using initial sample books.");
    }
    
    const savedBasket = localStorage.getItem('bookstore_basket');
    if (savedBasket) {
        basket = JSON.parse(savedBasket);
        console.log("Loaded basket from localStorage:", basket);
    }
    
    renderBooks(books);
    renderBasket();
}

function renderBooks(booksToRender) {
    console.log("Rendering books on screen...");
    bookListElement.innerHTML = '';

    if (booksToRender.length === 0) {
        bookListElement.innerHTML = '<p class="no-results">No books found matching your search. Try another keyword!</p>';
        return;
    }

    booksToRender.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}" referrerPolicy="no-referrer">
            <span class="category">${book.category}</span>
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <p class="price">$${book.price.toFixed(2)}</p>
            <p class="stock">Stock: ${book.stock || 0}</p>
            <p>${book.description}</p>
            <button class="btn-add" data-id="${book.id}" ${book.stock <= 0 ? 'disabled' : ''}>
                ${book.stock <= 0 ? 'Out of Stock' : 'Add to Basket'}
            </button>
        `;
        
        bookListElement.appendChild(bookCard);
    });
}

function addToBasket(bookId) {
    const bookToAdd = books.find(b => b.id === bookId);
    const existingItem = basket.find(item => item.id === bookId);
    const currentQtyInBasket = existingItem ? existingItem.quantity : 0;

    if (bookToAdd.stock <= currentQtyInBasket) {
        alert(`Sorry, we only have ${bookToAdd.stock} copies of "${bookToAdd.title}" in stock.`);
        return;
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        basket.push({ ...bookToAdd, quantity: 1 });
    }
    
    console.log(`Added "${bookToAdd.title}" to basket.`, basket);
    alert(`"${bookToAdd.title}" added to your basket!`);
    
    saveBasket();
    renderBasket();
}

function renderBasket() {
    console.log("Updating basket display...");
    basketItemsElement.innerHTML = '';
    
    if (basket.length === 0) {
        basketItemsElement.innerHTML = '<p>Your basket is empty.</p>';
        totalPriceElement.innerText = '0.00';
        checkoutSection.style.display = 'none';
        return;
    }

    let total = 0;
    basket.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'basket-item';
        itemDiv.innerHTML = `
            <div class="basket-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="btn-remove" data-id="${item.id}">Remove</button>
            </div>
            <div class="basket-item-controls">
                <button class="btn-qty" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="btn-qty" data-id="${item.id}" data-change="1">+</button>
            </div>
        `;
        basketItemsElement.appendChild(itemDiv);
    });
    
    totalPriceElement.innerText = total.toFixed(2);
    checkoutSection.style.display = 'block';
}

function updateQuantity(bookId, change) {
    const item = basket.find(i => i.id === bookId);
    const book = books.find(b => b.id === bookId);

    if (item && book) {
        if (change > 0 && item.quantity >= book.stock) {
            alert(`Sorry, only ${book.stock} copies available.`);
            return;
        }

        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromBasket(bookId);
        } else {
            console.log(`Updated quantity for "${book.title}" to ${item.quantity}`);
            saveBasket();
            renderBasket();
        }
    }
}

function removeFromBasket(bookId) {
    const itemToRemove = basket.find(item => item.id === bookId);
    basket = basket.filter(item => item.id !== bookId);
    console.log(`Removed "${itemToRemove ? itemToRemove.title : 'item'}" from basket.`);
    saveBasket();
    renderBasket();
}

function saveBasket() {
    localStorage.setItem('bookstore_basket', JSON.stringify(basket));
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    console.log(`Filtering books... Search: "${searchTerm}", Category: "${selectedCategory}"`);

    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                             book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    renderBooks(filtered);
}

function validateCheckoutForm(name, email, address) {
    if (name.trim() === "") {
        alert("Please enter your full name.");
        return false;
    }
    if (email.trim() === "" || !email.includes("@")) {
        alert("Please enter a valid email address.");
        return false;
    }
    if (address.trim() === "") {
        alert("Please enter your shipping address.");
        return false;
    }
    return true;
}

function saveOrder(name, email, total) {
    const orders = JSON.parse(localStorage.getItem('bookstore_orders') || '[]');
    const newOrder = {
        id: Date.now(),
        customer: name,
        email: email,
        items: [...basket],
        total: total,
        date: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('bookstore_orders', JSON.stringify(orders));
    console.log("Order saved successfully:", newOrder);
}

function updateBookStock() {
    basket.forEach(item => {
        const book = books.find(b => b.id === item.id);
        if (book) {
            book.soldCount = (book.soldCount || 0) + item.quantity;
            book.stock = (book.stock || 0) - item.quantity;
        }
    });
    localStorage.setItem('bookstore_books', JSON.stringify(books));
    renderBooks(books);
}

function showOrderConfirmation(name, email, total) {
    confirmationMessage.innerText = `Thank you, ${name}! Your order for $${total.toFixed(2)} has been placed. We've sent a confirmation to ${email}.`;
    confirmationModal.style.display = 'block';
}

function clearBasket() {
    basket = [];
    saveBasket();
    renderBasket();
    checkoutForm.reset();
    console.log("Basket cleared after order.");
}

function handleCheckout(event) {
    event.preventDefault();
    console.log("Processing checkout...");

    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const address = document.getElementById('cust-address').value;
    const total = parseFloat(totalPriceElement.innerText);

    if (!validateCheckoutForm(name, email, address)) return;

    saveOrder(name, email, total);
    updateBookStock();
    showOrderConfirmation(name, email, total);
    clearBasket();
}

bookListElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-add')) {
        const bookId = parseInt(event.target.getAttribute('data-id'));
        addToBasket(bookId);
    }
});

basketItemsElement.addEventListener('click', (event) => {
    const target = event.target;
    const bookId = parseInt(target.getAttribute('data-id'));

    if (target.classList.contains('btn-remove')) {
        removeFromBasket(bookId);
    } else if (target.classList.contains('btn-qty')) {
        const change = parseInt(target.getAttribute('data-change'));
        updateQuantity(bookId, change);
    }
});

searchInput.addEventListener('input', filterBooks);
categoryFilter.addEventListener('change', filterBooks);

checkoutForm.addEventListener('submit', handleCheckout);

closeModalButton.onclick = () => confirmationModal.style.display = 'none';
modalOkButton.onclick = () => confirmationModal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === confirmationModal) confirmationModal.style.display = 'none';
};

loadData();
