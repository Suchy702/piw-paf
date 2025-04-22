import { Link } from "react-router";

export function Navbar() {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <h1>EasyBook</h1>
        <ul className="nav-links">
          <li><Link to="/">Strona główna</Link></li>
          <li><Link to="/new">Dodaj książkę</Link></li>
        </ul>
      </div>
    </nav>
  );
}