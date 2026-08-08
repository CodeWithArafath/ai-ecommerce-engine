import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    searchProducts(query, { limit: 24 })
      .then((res) => {
        const data = res.data;

        setResults(
          data.results?.map((item) => item.product) ||
          data.products ||
          []
        );
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">AI Search</span>
        <h1>Results for "{query}"</h1>
        <p>Products ranked using the AI search engine.</p>
      </div>

      {loading ? (
        <div className="loading">Searching...</div>
      ) : results.length ? (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No products found</h2>
          <p>Try another search term.</p>
        </div>
      )}
    </main>
  );
}
