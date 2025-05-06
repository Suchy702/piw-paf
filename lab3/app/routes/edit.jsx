import { BookForm } from "../components/BookForm";
import { useAuthContext } from "../context/AuthContext";
import { useBookContext } from "../context/BookContext";
import { useParams, Navigate } from "react-router";
import { useEffect, useState } from "react";

export function meta() {
  return [
    { title: "Edytuj książkę" },
    { name: "description", content: "Edycja istniejącej książki" },
  ];
}

export default function Edit() {
  const { id } = useParams();
  const { currentUser } = useAuthContext();
  const { books, isBookOwner } = useBookContext();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const book = books.find(book => book.id === id);
    if (book) {
      setIsOwner(isBookOwner(book.userId));
    }
    setLoading(false);
  }, [id, books, currentUser, isBookOwner]);

  if (loading) {
    return <div className="loading">Sprawdzanie uprawnień...</div>;
  }

  if (!currentUser || !isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="edit-book-container">
      <h1>Edytuj książkę</h1>
      <BookForm isEditing={true} />
    </div>
  );
}