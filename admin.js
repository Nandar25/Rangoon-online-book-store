/**
 * admin.js
 * This file handles the logic for the Admin Portal.
 * It allows adding new books and calculates simple statistics.
 */

// --- 1. STATE ---
let books = [];
let orders = [];

// --- 2. DOM ELEMENTS ---
const addBookForm = document.getElementById('add-book-form');
const adminBookList = document.getElementById('admin-book-list');
const resetDataButton = document.getElementById('reset-data-btn');

// Stats Elements
const statTotalBooks = document.getElementById('stat-total-books');
const statTotalOrders = document.getElementById('stat-total-orders');
const statBestSeller = document.getElementById('stat-best-seller');
const statPopularAuthor = document.getElementById('stat-popular-author');

// --- 3. FUNCTIONS ---

// --------------------------------------------------
// STEP 1: Load data
// --------------------------------------------------
/**
 * Loads data from localStorage.
 */
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

// --------------------------------------------------
// STEP 2: Calculate Statistics
// --------------------------------------------------
/**
 * Calculates and displays simple business statistics.
 */
function calculateStats() {
    console.log("Calculating statistics...");
    
    // 1. Total Books
    statTotalBooks.innerText = books.length;
    
    // 2. Total Orders
    statTotalOrders.innerText = orders.length;
    
    // 3. Best Selling Book
    if (books.length > 0) {
        let bestSeller = books[0];
        books.forEach(book => {
            if ((book.soldCount || 0) > (bestSeller.soldCount || 0)) {
                bestSeller = book;
            }
        });
        statBestSeller.innerText = bestSeller.soldCount > 0 ? bestSeller.title : "No sales yet";
    }
    
    // 4. Most Popular Author (Based on total sales)
    // TEACHING NOTE: We use an object to sum up sales for each author.
    if (books.length > 0) {
        const authorSales = {};
        
        books.forEach(book => {
            const author = book.author;
            const sales = book.soldCount || 0;
            
            // If author is already in our object, add to their total.
            // If not, start at current book's sales.
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
        
        // Only show if there are actual sales
        statPopularAuthor.innerText = maxSales > 0 ? popularAuthor : "No sales yet";
    }
}

// --------------------------------------------------
// STEP 3: Show Inventory
// --------------------------------------------------
/**
 * Displays the current books in the admin view.
 */
function renderInventory() {
    console.log("Rendering inventory list...");
    adminBookList.innerHTML = '';
    
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        // TEACHING NOTE: Using data-id for the delete button
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

// --------------------------------------------------
// STEP 4: Add New Book
// --------------------------------------------------

/**
 * Validates the new book form.
 */
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

/**
 * Adds a new book to the list.
 */
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
    
    // 1. Validate
    if (!validateBookForm(title, author, price, stock)) return;

    // 2. Create object
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
    
    // 3. Save
    books.push(newBook);
    localStorage.setItem('bookstore_books', JSON.stringify(books));
    console.log("New book added:", newBook);
    
    // 4. Update UI
    addBookForm.reset();
    calculateStats();
    renderInventory();
    alert(`"${title}" has been added to the shop!`);
}

/**
 * Deletes a book from the inventory.
 */
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

// --------------------------------------------------
// STEP 5: Reset Demo Data
// --------------------------------------------------
/**
 * Resets the entire app to its original state.
 */
function resetDemoData() {
    if (confirm("This will delete all your custom books, orders, and basket. Are you sure?")) {
        console.log("Resetting demo data...");
        localStorage.clear();
        alert("Data reset! The page will now reload.");
        window.location.reload();
    }
}

// --------------------------------------------------
// STEP 6: Event Listeners
// --------------------------------------------------

// Handle form submission
addBookForm.addEventListener('submit', addNewBook);

// Listen for clicks on the inventory list (Event Delegation)
adminBookList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-book-btn')) {
        const bookId = parseInt(event.target.getAttribute('data-id'));
        deleteBook(bookId);
    }
});

// Reset button
if (resetDataButton) {
    resetDataButton.addEventListener('click', resetDemoData);
}

// --- 7. INITIALIZE ---
loadAdminData();
