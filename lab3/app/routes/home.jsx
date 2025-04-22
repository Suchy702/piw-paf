import { BookList } from "../components/BookList";

export function meta() {
  return [
    { title: "EasyBook" },
    { name: "description", content: "Aplikacja do przeglądania i zarządzania książkami" },
  ];
}

export default function Home() {
  return (
    <div className="home-container">
      <BookList />
    </div>
  );
}
