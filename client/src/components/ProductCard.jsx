import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ProductCard({ product }) {
  const {
    addToCartLocal,
    wishlist,
    toggleWishlist,
  } = useApp();

  const liked = wishlist.some(
    (item) => item._id === product._id
  );

  return (
    <article className="product-card">
      <button
        className={`heart ${liked ? "liked" : ""}`}
        onClick={() => toggleWishlist(product)}
      >
        <Heart size={19} fill={liked ? "currentColor" : "none"} />
      </button>

      <Link to={`/products/${product._id}`}>
        <div className="product-image">
          <span>{product.category || "Product"}</span>
        </div>

        <div className="product-info">
          <small>{product.brand}</small>

          <h3>{product.name}</h3>

          <p>
            {product.description?.slice(0, 85) || "Quality product"}
          </p>

          <strong>
            ?{Number(product.price || 0).toLocaleString("en-IN")}
          </strong>
        </div>
      </Link>

      <button
        className="add-cart"
        onClick={() => addToCartLocal(product)}
      >
        <ShoppingCart size={17} />
        Add to cart
      </button>
    </article>
  );
}
