import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getProduct } from "../../api/products";
import { useApp } from "../../context/AppContext";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    addToCartLocal,
    wishlist,
    toggleWishlist,
  } = useApp();

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(
          res.data.product ||
          res.data.data ||
          null
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="page loading">Loading...</main>;
  }

  if (!product) {
    return (
      <main className="page empty">
        <h2>Product not found</h2>
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  const liked = wishlist.some(
    (item) => item._id === product._id
  );

  return (
    <main className="page">
      <Link className="back-link" to="/products">
        <ArrowLeft size={17} />
        Back to products
      </Link>

      <section className="product-detail">
        <div className="detail-image">
          {product.category}
        </div>

        <div className="detail-content">
          <small>{product.brand}</small>

          <h1>{product.name}</h1>

          <p className="detail-description">
            {product.description}
          </p>

          <div className="detail-price">
            ?{Number(product.price || 0).toLocaleString("en-IN")}
          </div>

          <p>
            Stock: <strong>{product.stock ?? "Available"}</strong>
          </p>

          <div className="detail-actions">
            <button
              className="primary-btn"
              onClick={() => addToCartLocal(product)}
            >
              <ShoppingCart size={18} />
              Add to cart
            </button>

            <button
              className="secondary-btn"
              onClick={() => toggleWishlist(product)}
            >
              <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
              />
              {liked ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
