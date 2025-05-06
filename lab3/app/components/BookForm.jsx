import { useState, useEffect } from "react";
import { useBookContext } from "../context/BookContext";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router";

export function BookForm({ isEditing = false }) {
  const { addBook, updateBook, books } = useBookContext();
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    price: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const bookToEdit = books.find(book => book.id === id);
      if (bookToEdit) {
        setFormData({
          title: bookToEdit.title || "",
          author: bookToEdit.author || "",
          genre: bookToEdit.genre || "",
          description: bookToEdit.description || "",
          price: bookToEdit.price || ""
        });
      } else {
        navigate('/');
      }
    }
  }, [isEditing, id, books, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tytuł jest wymagany";
    if (!formData.author.trim()) newErrors.author = "Autor jest wymagany";
    if (!formData.genre.trim()) newErrors.genre = "Gatunek jest wymagany";
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Cena musi być liczbą";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Musisz być zalogowany, aby dodać lub edytować książkę");
      return;
    }
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const bookData = {
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null
        };
        
        if (isEditing) {
          await updateBook(id, bookData);
        } else {
          await addBook(bookData);
        }
        
        navigate('/');
      } catch (error) {
        alert(`Błąd podczas ${isEditing ? 'aktualizacji' : 'dodawania'} książki: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="book-form-container">
      <h2>{isEditing ? 'Edytuj książkę' : 'Dodaj nową książkę'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Tytuł:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Autor:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Gatunek:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
          {errors.genre && <span className="error">{errors.genre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Opis (opcjonalnie):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Cena (opcjonalnie):</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="np. 29.99"
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Zapisywanie...' 
            : (isEditing ? 'Zapisz zmiany' : 'Dodaj książkę')
          }
        </button>
      </form>
    </div>
  );
}