import { createContext, useContext, useState } from "react";

const BookContext = createContext();

export const useBookContext = () => {
  return useContext(BookContext);
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy" },
    { id: 2, title: "Władca Pierścieni", author: "J.R.R. Tolkien", genre: "Fantasy" },
    { id: 3, title: "Zbrodnia i kara", author: "Fiodor Dostojewski", genre: "Klasyka" },
    { id: 4, title: "Duma i uprzedzenie", author: "Jane Austen", genre: "Romans" },
    { id: 5, title: "Rok 1984", author: "George Orwell", genre: "Dystopia" }
  ]);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1
    };
    setBooks([...books, newBook]);
  };

  return (
    <BookContext.Provider value={{ books, addBook }}>
      {children}
    </BookContext.Provider>
  );
};