import { useState } from "react";
import { useBookContext } from "../context/BookContext";
import { Link } from "react-router";

export function BookList() {
  const { books, loading, isBookOwner, deleteBook } = useBookContext();
  const [authorFilter, setAuthorFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const authors = [...new Set(books.map(book => book.author))];
  const genres = [...new Set(books.map(book => book.genre))];

  const filteredBooks = books.filter(book => {
    return (authorFilter === "" || book.author === authorFilter) &&
           (genreFilter === "" || book.genre === genreFilter);
  });

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      try {
        await deleteBook(id);
      } catch (error) {
        alert(`Błąd podczas usuwania: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div className="loading">Ładowanie książek...</div>;
  }

  return (
    <div className="book-list-container">
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="author-filter">Filtruj po autorze:</label>
          <select 
            id="author-filter" 
            value={authorFilter} 
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="">Wszyscy autorzy</option>
            {authors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="genre-filter">Filtruj po gatunku:</label>
          <select 
            id="genre-filter" 
            value={genreFilter} 
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">Wszystkie gatunki</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <h2>Lista książek</h2>
      {filteredBooks.length === 0 ? (
        <p>Nie znaleziono książek spełniających kryteria.</p>
      ) : (
        <ul className="book-list">
          {filteredBooks.map(book => (
            <li key={book.id} className="book-item">
              <h3>{book.title}</h3>
              <p><strong>Autor:</strong> {book.author}</p>
              <p><strong>Gatunek:</strong> {book.genre}</p>
              {book.userName && <p><strong>Dodano przez:</strong> {book.userName}</p>}
              
              {isBookOwner(book.userId) && (
                <div className="book-actions">
                  <Link to={`/edit/${book.id}`} className="edit-btn">Edytuj</Link>
                  <button onClick={() => handleDelete(book.id)} className="delete-btn">Usuń</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}