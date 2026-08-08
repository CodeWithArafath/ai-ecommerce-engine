import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 24 })
      .then((res) => {
        setProducts(
          res.data.products ||
          res.data.data?.products ||
          []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>All products</h1>
          <p>Browse products from the AI commerce engine.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
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
