// Initial Data
let books = JSON.parse(localStorage.getItem('books')) || [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', status: 'Available' },
    { id: 2, title: 'Brief History of Time', author: 'Stephen Hawking', genre: 'Science', status: 'Available' },
    { id: 3, title: '1984', author: 'George Orwell', genre: 'Fiction', status: 'Available' }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterGenre = document.getElementById('filterGenre');
const booksList = document.getElementById('booksList');
const adminBooksList = document.getElementById('adminBooksList');
const addBookForm = document.getElementById('addBookForm');
const themeToggle = document.getElementById('themeToggle');
const userType = document.getElementById('userType');
const modal = document.getElementById('bookModal');
const closeModal = document.querySelector('.close');
const navLinks = document.querySelectorAll('.nav-links a');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Search and Filter
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = filterGenre.value;
    
    return books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
}

function displayBooks() {
    const filteredBooks = filterBooks();
    booksList.innerHTML = filteredBooks.map(book => `
        <div class="book-card" data-id="${book.id}">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Status: ${book.status}</p>
        </div>
    `).join('');

    // Add click event listeners to book cards
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => showBookDetails(card.dataset.id));
    });
}

// Modal Functions
function showBookDetails(bookId) {
    const book = books.find(b => b.id === parseInt(bookId));
    if (!book) return;

    document.getElementById('modalTitle').textContent = book.title;
    document.getElementById('modalAuthor').textContent = `Author: ${book.author}`;
    document.getElementById('modalGenre').textContent = `Genre: ${book.genre}`;
    document.getElementById('modalStatus').textContent = `Status: ${book.status}`;

    const borrowButton = document.getElementById('borrowButton');
    const returnButton = document.getElementById('returnButton');

    if (book.status === 'Available') {
        borrowButton.style.display = 'block';
        returnButton.style.display = 'none';
    } else {
        borrowButton.style.display = 'none';
        returnButton.style.display = 'block';
    }

    borrowButton.onclick = () => borrowBook(bookId);
    returnButton.onclick = () => returnBook(bookId);

    modal.style.display = 'block';
}

function borrowBook(bookId) {
    const book = books.find(b => b.id === parseInt(bookId));
    if (book && book.status === 'Available') {
        book.status = 'Borrowed';
        updateBooks();
        modal.style.display = 'none';
    }
}

function returnBook(bookId) {
    const book = books.find(b => b.id === parseInt(bookId));
    if (book && book.status === 'Borrowed') {
        book.status = 'Available';
        updateBooks();
        modal.style.display = 'none';
    }
}

// Admin Functions
function displayAdminBooks() {
    adminBooksList.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Status: ${book.status}</p>
            <button onclick="deleteBook(${book.id})">Delete</button>
        </div>
    `).join('');
}

function deleteBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    updateBooks();
}

function updateBooks() {
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    displayAdminBooks();
}

// Event Listeners
searchInput.addEventListener('input', displayBooks);
filterGenre.addEventListener('change', displayBooks);

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newBook = {
        id: Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        genre: document.getElementById('bookGenre').value,
        status: 'Available'
    };
    books.push(newBook);
    updateBooks();
    addBookForm.reset();
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

userType.addEventListener('change', () => {
    const adminSection = document.getElementById('admin');
    const adminLink = document.getElementById('adminLink');
    if (userType.value === 'admin') {
        adminSection.style.display = 'block';
        adminLink.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
        adminLink.style.display = 'none';
    }
});

// Initial Display
displayBooks();
displayAdminBooks();

// Hide admin section initially
document.getElementById('adminLink').style.display = 'none';
document.getElementById('admin').style.display = 'none';