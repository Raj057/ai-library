const Book = require('../models/Book');  // Import the Book model
const Student = require('../models/Student');  // Import the Student model
const BorrowedBook = require('../models/BorrowedBooks');  // Import the BorrowedBooks model

// Helper function to check borrowed books by student ID
const checkBorrowedBooks = async (studentId) => {
  try {
    // Find all borrowed books for the student where return_date is null (not returned)
    const borrowedBooks = await BorrowedBook.find({ student_id: studentId, return_date: null }).populate('book_id');
    
    if (!borrowedBooks || borrowedBooks.length === 0) {
      return { message: 'No borrowed books found for this student.' };
    }

    // Map the borrowed books and include additional information (due date, fine)
    return borrowedBooks.map(borrowedBook => ({
      title: borrowedBook.book_id.title,
      author: borrowedBook.book_id.author,
      genre: borrowedBook.book_id.genre,
      section: borrowedBook.book_id.section,
      column: borrowedBook.book_id.column,
      borrow_date: borrowedBook.borrow_date,
      due_date: borrowedBook.due_date,
      fine: borrowedBook.fine,  // Fine should be calculated based on due date
    }));
  } catch (error) {
    console.error('Error checking borrowed books:', error);
    throw error;
  }
};

// Helper function to search for books by title
const searchBookByTitle = async (title) => {
  try {
    const books = await Book.find({ title: new RegExp(title, 'i') });
    const summary = await generateBookSummary(book);  // Case-insensitive search using regex
    return books.map(book => ({
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      section: book.section,
      column: book.column,
      available_copies: book.available_copies,
      summary: summary,  // Include available copies in the search results
    }));
    

  } catch (error) {
    console.error('Error searching books by title:', error);
    throw error;
  }
};

// Helper function to search for books by author
const searchBookByAuthor = async (author) => {
  try {
    const books = await Book.find({ author: new RegExp(author, 'i') });  // Case-insensitive search using regex
    return books.map(book => ({
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      section: book.section,
      column: book.column,
      available_copies: book.available_copies,
    }));
  } catch (error) {
    console.error('Error searching books by author:', error);
    throw error;
  }
};


const generateBookSummary = async (book) => {
  try {
    const response = await axios.post('http://localhost:5000/api/llm/generateSummary', {
      title: book.title,
      author: book.author,
      genre: book.genre,
    });
    return response.data.summary;
  } catch (error) {
    console.error('Error generating book summary:', error);
    throw new Error('Could not generate book summary');
  }
};


// Helper function to search for books by genre
const searchBookByGenre = async (genre) => {
  try {
    // Use a case-insensitive regular expression to match the genre
    const books = await Book.find({ genre: new RegExp(`^${genre}$`, 'i') });
    return books.map(book => ({
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      section: book.section,
      column: book.column,
      available_copies: book.available_copies,
    }));
  } catch (error) {
    console.error('Error searching books by genre:', error);
    throw error;
  }
};

// Helper function to check pending fines for a student
const checkPendingFines = async (studentId) => {
  try {
    // Find all borrowed books for the student where return_date is null (not returned)
    const borrowedBooks = await BorrowedBook.find({ student_id: studentId, return_date: null });

    let totalFine = 0;

    borrowedBooks.forEach(borrowedBook => {
      const now = new Date();
      const daysLate = Math.floor((now - borrowedBook.due_date) / (1000 * 60 * 60 * 24));  // Calculate days late

      if (daysLate > 0) {
        totalFine += daysLate * 10;  // Fine of $10 per day late
      }
    });

    return { totalFine };
  } catch (error) {
    console.error('Error checking pending fines:', error);
    throw error;
  }
};

// Helper function to get all books in the library
const getAllBooks = async () => {
  try {
    const allBooks = await Book.find({});
    return allBooks;
  } catch (error) {
    console.error('Error fetching all books:', error);
    throw new Error('Could not fetch all books');
  }
};

// Helper function to handle borrowing a book
const borrowBook = async (studentId, bookId) => {
  try {
    const book = await Book.findOne({ book_id: bookId });
    
    if (!book || book.available_copies <= 0) {
      return { error: 'Book not available for borrowing.' };
    }

    // Check if the student has already borrowed this book and not returned it
    const alreadyBorrowed = await BorrowedBook.findOne({ student_id: studentId, book_id: bookId, return_date: null });
    if (alreadyBorrowed) {
      return { error: 'This book is already borrowed and not yet returned.' };
    }

    // Borrow the book: decrease available copies, add entry to borrowed_books
    book.available_copies -= 1;
    await book.save();

    const borrowedBook = new BorrowedBook({
      student_id: studentId,
      book_id: book._id,
      borrow_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 10)),  // Due in 10 days
    });

    await borrowedBook.save();

    return { message: 'Book borrowed successfully' };
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
};


// Helper function to get available books
const getAvailableBooks = async () => {
  try {
    const availableBooks = await Book.find({ available_copies: { $gt: 0 } });
    return availableBooks;
  } catch (error) {
    console.error('Error fetching available books:', error);
    throw new Error('Could not fetch available books');
  }
};

// Helper function to get the location of a book or books by a particular author
const getBookLocation = async ({ title, author, genre }) => {
  try {
    let query = {};
    if (title) {
      query.title = title;
    }
    if (author) {
      query.author = author;
    }
    if (genre) {
      query.genre = new RegExp(`^${genre}$`, 'i'); // Case-insensitive search for genre
    }

    const books = await Book.find(query, 'title author genre section column');
    return books;
  } catch (error) {
    console.error('Error fetching book location:', error);
    throw new Error('Could not fetch book location');
  }
};

// Helper function to handle returning a book
const returnBook = async (studentId, bookId) => {
  try {
    const book = await Book.findOne({ book_id: bookId });
    const borrowedBook = await BorrowedBook.findOne({ student_id: studentId, book_id: book._id, return_date: null });

    if (!borrowedBook) {
      return { error: 'No record of this book being borrowed.' };
    }

    // Mark as returned
    borrowedBook.return_date = new Date();

    // Calculate and apply any fine for overdue return
    const now = new Date();
    const daysLate = Math.floor((now - borrowedBook.due_date) / (1000 * 60 * 60 * 24));
    if (daysLate > 0) {
      borrowedBook.fine = daysLate * 10;  // Fine of $10 per day late
    }

    await borrowedBook.save();

    // Increase available copies for the book
    book.available_copies += 1;
    await book.save();

    return { message: 'Book returned successfully', fine: borrowedBook.fine };
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};

const getGeneralKnowledge = async ({author, title}) => {
  const x = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(title)}`)

  const data = await x.json()

  return ({db:true, data})
}

module.exports = {
  checkBorrowedBooks,
  searchBookByTitle,
  searchBookByAuthor,
  searchBookByGenre,
  checkPendingFines,
  borrowBook,
  getAvailableBooks,
  getBookLocation,
  getAllBooks,
  returnBook,
  getGeneralKnowledge
};
