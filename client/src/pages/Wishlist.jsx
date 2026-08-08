import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

export default function Wishlist() {
  const { wishlist } = useApp();

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">Saved</span>
        <h1>Wishlist</h1>
      </div>

      {!wishlist.length ? (
        <div className="empty">
          <h2>Your wishlist is empty</h2>
          <p>Save products you want to come back to.</p>
          <Link className="primary-btn" to="/products">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}
