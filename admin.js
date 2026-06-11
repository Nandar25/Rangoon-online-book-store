let books = [];
let orders = [];

const addBookForm = document.getElementById('add-book-form');
const adminBookList = document.getElementById('admin-book-list');
const resetDataButton = document.getElementById('reset-data-btn');

const statTotalBooks = document.getElementById('stat-total-books');
const statTotalOrders = document.getElementById('stat-total-orders');
const statBestSeller = document.getElementById('stat-best-seller');
const statPopularAuthor = document.getElementById('stat-popular-author');

function loadAdminData() {
    console.log("Admin Portal: Loading data...");
    
    const savedBooks = localStorage.getItem('bookstore_books');
    if (savedBooks) {
        books = JSON.parse(savedBooks);
    }
    
    const savedOrders = localStorage.getItem('bookstore_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    calculateStats();
    renderInventory();
}

function calculateStats() {
    console.log("Calculating statistics...");
    
    statTotalBooks.innerText = books.length;
    
    statTotalOrders.innerText = orders.length;
    
    if (books.length > 0) {
        let bestSeller = books[0];
        books.forEach(book => {
            if ((book.soldCount || 0) > (bestSeller.soldCount || 0)) {
                bestSeller = book;
            }
        });
        statBestSeller.innerText = bestSeller.soldCount > 0 ? bestSeller.title : "No sales yet";
    }
    
    if (books.length > 0) {
        const authorSales = {};
        
        books.forEach(book => {
            const author = book.author;
            const sales = book.soldCount || 0;
            
            authorSales[author] = (authorSales[author] || 0) + sales;
        });
        
        let popularAuthor = "";
        let maxSales = -1;
        
        for (const author in authorSales) {
            if (authorSales[author] > maxSales) {
                maxSales = authorSales[author];
                popularAuthor = author;
            }
        }
        
        statPopularAuthor.innerText = maxSales > 0 ? popularAuthor : "No sales yet";
    }
}

function renderInventory() {
    console.log("Rendering inventory list...");
    adminBookList.innerHTML = '';
    
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <img src="${book.image}" alt="${book.title}" referrerPolicy="no-referrer">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <p class="price">$${book.price.toFixed(2)}</p>
            <p>Stock: ${book.stock || 0}</p>
            <p>Sold: ${book.soldCount || 0}</p>
            <button class="btn-remove delete-book-btn" data-id="${book.id}" style="margin-top: 10px; color: red;">Delete Book</button>
        `;
        adminBookList.appendChild(bookDiv);
    });
}

function validateBookForm(title, author, price, stock) {
    if (title.trim() === "") {
        alert("Book title cannot be empty.");
        return false;
    }
    if (author.trim() === "") {
        alert("Author name cannot be empty.");
        return false;
    }
    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price greater than 0.");
        return false;
    }
    if (isNaN(stock) || stock < 0) {
        alert("Stock cannot be negative.");
        return false;
    }
    return true;
}

function addNewBook(event) {
    event.preventDefault();
    console.log("Adding new book...");
    
    const title = document.getElementById('new-title').value;
    const author = document.getElementById('new-author').value;
    const price = parseFloat(document.getElementById('new-price').value);
    const stock = parseInt(document.getElementById('new-stock').value);
    const category = document.getElementById('new-category').value;
    const description = document.getElementById('new-description').value;
    const image = document.getElementById('new-image').value || "https://picsum.photos/seed/book/200/300";
    
    if (!validateBookForm(title, author, price, stock)) return;

    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        price: price,
        stock: stock,
        category: category,
        description: description,
        image: image,
        soldCount: 0
    };
    
    books.push(newBook);
    localStorage.setItem('bookstore_books', JSON.stringify(books));
    console.log("New book added:", newBook);
    
    addBookForm.reset();
    calculateStats();
    renderInventory();
    alert(`"${title}" has been added to the shop!`);
}

function deleteBook(bookId) {
    const bookToDelete = books.find(b => b.id === bookId);
    if (confirm(`Are you sure you want to delete "${bookToDelete ? bookToDelete.title : 'this book'}"?`)) {
        books = books.filter(b => b.id !== bookId);
        localStorage.setItem('bookstore_books', JSON.stringify(books));
        console.log(`Book ID ${bookId} deleted.`);
        renderInventory();
        calculateStats();
        alert("Book deleted successfully.");
    }
}

function resetDemoData() {
    if (confirm("This will delete all your custom books, orders, and basket. Are you sure?")) {
        console.log("Resetting demo data...");
        localStorage.clear();
        alert("Data reset! The page will now reload.");
        window.location.reload();
    }
}

addBookForm.addEventListener('submit', addNewBook);

adminBookList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-book-btn')) {
        const bookId = parseInt(event.target.getAttribute('data-id'));
        deleteBook(bookId);
    }
});

if (resetDataButton) {
    resetDataButton.addEventListener('click', resetDemoData);
}

loadAdminData();
