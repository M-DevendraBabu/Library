import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { booksAPI } from "../services/api";

const BookManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0743273565",
      category: "Fiction",
      status: "Available",
      copies: 15,
      borrowed: 12,
      location: "Shelf A-12",
      addedDate: "2024-01-01",
      rating: 4.5,
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524935",
      category: "Dystopian",
      status: "Borrowed",
      copies: 8,
      borrowed: 8,
      location: "Shelf B-05",
      addedDate: "2024-01-02",
      rating: 4.8,
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0446310789",
      category: "Fiction",
      status: "Available",
      copies: 12,
      borrowed: 5,
      location: "Shelf A-08",
      addedDate: "2024-01-03",
      rating: 4.9,
    },
    {
      id: 4,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "978-0316769488",
      category: "Fiction",
      status: "Reserved",
      copies: 10,
      borrowed: 7,
      location: "Shelf C-15",
      addedDate: "2024-01-04",
      rating: 4.3,
    },
    {
      id: 5,
      title: "Brave New World",
      author: "Aldous Huxley",
      isbn: "978-0060850524",
      category: "Dystopian",
      status: "Available",
      copies: 7,
      borrowed: 3,
      location: "Shelf B-12",
      addedDate: "2024-01-05",
      rating: 4.6,
    },
    {
      id: 6,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0141439518",
      category: "Classic",
      status: "Maintenance",
      copies: 9,
      borrowed: 0,
      location: "Shelf D-03",
      addedDate: "2024-01-06",
      rating: 4.7,
    },
    {
      id: 7,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "978-0547928227",
      category: "Fantasy",
      status: "Available",
      copies: 20,
      borrowed: 18,
      location: "Shelf E-01",
      addedDate: "2024-01-07",
      rating: 4.9,
    },
    {
      id: 8,
      title: "Moby Dick",
      author: "Herman Melville",
      isbn: "978-1503280786",
      category: "Classic",
      status: "Available",
      copies: 6,
      borrowed: 2,
      location: "Shelf D-08",
      addedDate: "2024-01-08",
      rating: 4.4,
    },
  ]);

  const stats = {
    totalBooks: books.reduce((acc, book) => acc + book.copies, 0),
    availableBooks: books.filter((b) => b.status === "Available").length,
    borrowedBooks: books.reduce((acc, book) => acc + book.borrowed, 0),
    categories: [...new Set(books.map((b) => b.category))].length,
  };

  useEffect(() => {
    booksAPI
      .getAll({ limit: 100 })
      .then((res) => {
        if (res.data?.books && res.data.books.length > 0) {
          const mapped = res.data.books.map((b, idx) => ({
            id: b._id || idx + 1,
            _id: b._id,
            title: b.title,
            author: b.author,
            isbn: b.isbn || `978-${1000000000 + idx}`,
            category: b.category
              ? b.category.charAt(0).toUpperCase() + b.category.slice(1)
              : "Fiction",
            status:
              b.status || (b.availableCopies > 0 ? "Available" : "Borrowed"),
            copies: b.totalCopies || 1,
            borrowed:
              (b.totalCopies || 1) -
              (b.availableCopies !== undefined ? b.availableCopies : 0),
            location: b.location || "Shelf A-12",
            addedDate: b.createdAt
              ? b.createdAt.split("T")[0]
              : "2024-01-01",
            rating: b.rating || 4.5,
          }));
          setBooks(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleBackToDashboard = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
  };

  const handleAddBook = () => {
    setSelectedBook({
      id: 0,
      title: "",
      author: "",
      isbn: "",
      category: "",
      status: "Available",
      copies: 1,
      location: "",
      addedDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveBook = (e) => {
    e.preventDefault();
    if (selectedBook.id && selectedBook._id) {
      // Update existing book in API
      booksAPI
        .update(selectedBook._id, {
          title: selectedBook.title,
          author: selectedBook.author,
          category: selectedBook.category?.toLowerCase(),
          totalCopies: Number(selectedBook.copies),
          location: selectedBook.location,
        })
        .catch(() => {});
      setBooks(books.map((b) => (b.id === selectedBook.id ? selectedBook : b)));
    } else {
      // Add new book in API
      booksAPI
        .create({
          title: selectedBook.title,
          author: selectedBook.author,
          isbn:
            selectedBook.isbn || `978-${Date.now().toString().slice(-10)}`,
          category: (selectedBook.category || "fiction").toLowerCase(),
          totalCopies: Number(selectedBook.copies) || 1,
          availableCopies: Number(selectedBook.copies) || 1,
          location: selectedBook.location || "Shelf A-01",
        })
        .then((res) => {
          if (res.data?.book) {
            const b = res.data.book;
            setBooks((prev) => [
              ...prev,
              {
                id: b._id,
                _id: b._id,
                title: b.title,
                author: b.author,
                isbn: b.isbn,
                category: b.category,
                status: b.status,
                copies: b.totalCopies,
                borrowed: 0,
                location: b.location,
                addedDate: new Date().toISOString().split("T")[0],
                rating: 4.5,
              },
            ]);
          }
        })
        .catch(() => {
          const newBook = {
            ...selectedBook,
            id: Math.max(...books.map((b) => b.id)) + 1,
            borrowed: 0,
            rating: 4.0,
          };
          setBooks([...books, newBook]);
        });
    }
    setSelectedBook(null);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const target = books.find((b) => b.id === bookId);
      if (target?._id) {
        booksAPI.delete(target._id).catch(() => {});
      }
      setBooks(books.filter((book) => book.id !== bookId));
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesFilter =
      activeFilter === "all" ||
      book.status.toLowerCase() === activeFilter ||
      book.category.toLowerCase() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      <style jsx="true">{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          padding: 20px;
        }

        .page-header {
          background: white;
          padding: 25px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left h1 {
          margin: 0 0 10px 0;
          color: #2d3748;
          font-size: 28px;
        }

        .header-left p {
          margin: 0;
          color: #718096;
        }

        .header-actions {
          display: flex;
          gap: 15px;
        }

        .back-btn {
          padding: 10px 20px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }

        .primary-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card.blue {
          border-top: 4px solid #3b82f6;
        }
        .stat-card.green {
          border-top: 4px solid #10b981;
        }
        .stat-card.purple {
          border-top: 4px solid #8b5cf6;
        }
        .stat-card.orange {
          border-top: 4px solid #f59e0b;
        }

        .stat-icon {
          font-size: 36px;
          opacity: 0.8;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 32px;
          color: #1e293b;
        }

        .stat-info p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .search-filter-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
        }

        .search-bar {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-bar input {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .search-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 10px 20px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #475569;
          transition: all 0.3s;
        }

        .filter-tab:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-color: transparent;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .book-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
          position: relative;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .book-cover {
          height: 180px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 48px;
          font-weight: bold;
          position: relative;
        }

        .book-status {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: white;
        }

        .book-status.available {
          color: #166534;
        }
        .book-status.borrowed {
          color: #dc2626;
        }
        .book-status.reserved {
          color: #d97706;
        }
        .book-status.maintenance {
          color: #4b5563;
        }

        .book-content {
          padding: 20px;
        }

        .book-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 5px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .book-author {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .book-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #94a3b8;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .book-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
        }

        .stars {
          color: #f59e0b;
        }

        .rating-value {
          font-size: 14px;
          color: #64748b;
        }

        .book-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .action-btn.edit {
          background: linear-gradient(135deg, #93c5fd, #3b82f6);
          color: white;
        }

        .action-btn.delete {
          background: linear-gradient(135deg, #fca5a5, #ef4444);
          color: white;
        }

        .action-btn.view {
          background: linear-gradient(135deg, #a7f3d0, #10b981);
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #475569;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: #e2e8f0;
          color: #475569;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .save-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .empty-state .icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .books-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="header-left">
          <h1>📚 Book Management</h1>
          <p>
            Manage library inventory, add new books, and update existing records
          </p>
        </div>
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <button className="primary-btn" onClick={handleAddBook}>
            <span>+</span> Add New Book
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.availableBooks}</h3>
            <p>Available Books</p>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <h3>{stats.borrowedBooks}</h3>
            <p>Currently Borrowed</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍 Search</button>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Books
          </button>
          <button
            className={`filter-tab ${activeFilter === "available" ? "active" : ""}`}
            onClick={() => setActiveFilter("available")}
          >
            Available
          </button>
          <button
            className={`filter-tab ${activeFilter === "borrowed" ? "active" : ""}`}
            onClick={() => setActiveFilter("borrowed")}
          >
            Borrowed
          </button>
          <button
            className={`filter-tab ${activeFilter === "fiction" ? "active" : ""}`}
            onClick={() => setActiveFilter("fiction")}
          >
            Fiction
          </button>
          <button
            className={`filter-tab ${activeFilter === "dystopian" ? "active" : ""}`}
            onClick={() => setActiveFilter("dystopian")}
          >
            Dystopian
          </button>
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                <span>{book.title.charAt(0)}</span>
                <div className={`book-status ${book.status.toLowerCase()}`}>
                  {book.status}
                </div>
              </div>
              <div className="book-content">
                <h3 className="book-title" title={book.title}>
                  {book.title}
                </h3>
                <p className="book-author">by {book.author}</p>

                <div className="book-details">
                  <div className="detail-item">
                    <span className="detail-label">ISBN</span>
                    <span className="detail-value">{book.isbn}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{book.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Copies</span>
                    <span className="detail-value">{book.copies}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{book.location}</span>
                  </div>
                </div>

                <div className="book-rating">
                  <span className="stars">
                    {"⭐".repeat(Math.floor(book.rating))}
                    {"☆".repeat(5 - Math.floor(book.rating))}
                  </span>
                  <span className="rating-value">{book.rating}/5</span>
                </div>

                <div className="book-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => setSelectedBook(book)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    🗑️ Delete
                  </button>
                  <button className="action-btn view">👁️ View</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>No books found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button
              className="primary-btn"
              onClick={handleAddBook}
              style={{ marginTop: "20px" }}
            >
              + Add Your First Book
            </button>
          </div>
        )}
      </div>

      {selectedBook && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedBook.id ? "Edit Book" : "Add New Book"}</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedBook(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveBook}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={selectedBook.title || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                      type="text"
                      id="author"
                      value={selectedBook.author || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          author: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="isbn">ISBN *</label>
                    <input
                      type="text"
                      id="isbn"
                      value={selectedBook.isbn || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          isbn: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={selectedBook.category || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Dystopian">Dystopian</option>
                      <option value="Classic">Classic</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Science">Science</option>
                      <option value="Biography">Biography</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={selectedBook.status || "Available"}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="copies">Copies</label>
                    <input
                      type="number"
                      id="copies"
                      value={selectedBook.copies || 1}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          copies: parseInt(e.target.value),
                        })
                      }
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      value={selectedBook.location || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., Shelf A-12"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setSelectedBook(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {selectedBook.id ? "Update" : "Add"} Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagementPage;
