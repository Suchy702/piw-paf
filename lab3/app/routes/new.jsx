import { BookForm } from "../components/BookForm";

export function meta() {
  return [
    { title: "Dodaj nową książkę" },
    { name: "description", content: "Formularz dodawania nowej książki" },
  ];
}

export default function New() {
  return (
    <div className="new-book-container">
      <h1>Dodaj nową książkę</h1>
      <BookForm />
    </div>
  );
}