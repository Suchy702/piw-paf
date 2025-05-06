import { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "./AuthContext";

const BookContext = createContext();

export const useBookContext = () => {
  return useContext(BookContext);
};

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyMyBooks, setShowOnlyMyBooks] = useState(false);
  const { currentUser } = useAuthContext();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const booksCollection = collection(db, "books");
      const querySnapshot = await getDocs(booksCollection);
      const booksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksList);
    } catch (error) {
      console.error("Błąd pobierania książek:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (bookData) => {
    try {
      if (!currentUser) throw new Error("Musisz być zalogowany, aby dodać książkę");
      
      const newBook = {
        ...bookData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "books"), newBook);
      
      setBooks(prevBooks => [...prevBooks, {
        id: docRef.id,
        ...newBook,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      return docRef.id;
    } catch (error) {
      console.error("Błąd dodawania książki:", error);
      throw error;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      if (!currentUser) throw new Error("Musisz być zalogowany, aby edytować książkę");
      
      const bookRef = doc(db, "books", id);
      
      await updateDoc(bookRef, {
        ...bookData,
        updatedAt: serverTimestamp()
      });
      
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === id ? { 
            ...book, 
            ...bookData, 
            updatedAt: new Date() 
          } : book
        )
      );
    } catch (error) {
      console.error("Błąd aktualizacji książki:", error);
      throw error;
    }
  };

  const deleteBook = async (id) => {
    try {
      if (!currentUser) throw new Error("Musisz być zalogowany, aby usunąć książkę");
      
      await deleteDoc(doc(db, "books", id));
      
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (error) {
      console.error("Błąd usuwania książki:", error);
      throw error;
    }
  };

  const toggleMyBooks = () => {
    setShowOnlyMyBooks(prev => !prev);
  };

  const filteredBooks = showOnlyMyBooks && currentUser
    ? books.filter(book => book.userId === currentUser.uid)
    : books;

  const isBookOwner = (bookUserId) => {
    return currentUser && currentUser.uid === bookUserId;
  };

  return (
    <BookContext.Provider value={{
      books: filteredBooks,
      loading,
      addBook,
      updateBook,
      deleteBook,
      showOnlyMyBooks,
      toggleMyBooks,
      isBookOwner,
      fetchBooks
    }}>
      {children}
    </BookContext.Provider>
  );
};