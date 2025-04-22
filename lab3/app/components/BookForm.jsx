import { useState } from "react";
import { useBookContext } from "../context/BookContext";
import { useNavigate } from "react-router";

export function BookForm() {
  const { addBook } = useBookContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Usuń błąd dla pola, które jest edytowane
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      addBook(formData);
      navigate("/");
    }
  };

  return (
    <div className="book-form-container">
      <h2>Dodaj nową książkę</h2>
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

        <button type="submit" className="submit-button">Dodaj książkę</button>
      </form>
    </div>
  );
}