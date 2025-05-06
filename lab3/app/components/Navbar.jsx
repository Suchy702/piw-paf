import { Link } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { useBookContext } from "../context/BookContext";

export function Navbar() {
  const { currentUser, signInWithGoogle, logOut } = useAuthContext();
  const { showOnlyMyBooks, toggleMyBooks } = useBookContext();

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <h1>EasyBook</h1>
        <ul className="nav-links">
          <li><Link to="/">Strona główna</Link></li>
          <li><Link to="/new">Dodaj książkę</Link></li>
          
          {currentUser && (
            <li>
              <button 
                onClick={toggleMyBooks} 
                className={`my-books-btn ${showOnlyMyBooks ? 'active' : ''}`}
              >
                {showOnlyMyBooks ? 'Wszystkie książki' : 'Moje książki'}
              </button>
            </li>
          )}
          
          <li className="auth-buttons">
            {currentUser ? (
              <div className="user-info">
                <span className="user-email">{currentUser.displayName || currentUser.email}</span>
                <button onClick={logOut} className="logout-btn">Wyloguj</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="login-btn">
                Zaloguj z Google
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}