import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";

export default function Navbar() {
  const { cartCount, wishlist, user, logout } = useApp();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="navbar">
      <Link className="logo" to="/">
        AI<span>Shop</span>
      </Link>

      <form className="searchbar" onSubmit={submit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products with AI..."
        />
        <button>
          <Search size={19} />
        </button>
      </form>

      <nav>
        <Link to="/products">Products</Link>

        <Link className="nav-icon" to="/wishlist">
          <Heart size={20} />
          {wishlist.length > 0 && (
            <b>{wishlist.length}</b>
          )}
        </Link>

        <Link className="nav-icon" to="/cart">
          <ShoppingCart size={20} />
          {cartCount > 0 && <b>{cartCount}</b>}
        </Link>

        {user ? (
          <button className="nav-user" onClick={logout}>
            <User size={18} />
            Logout
          </button>
        ) : (
          <Link className="nav-user" to="/login">
            <User size={18} />
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
