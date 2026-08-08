import { Link } from "react-router-dom";
import { Sparkles, Search, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <div className="eyebrow">
            <Sparkles size={16} />
            AI-powered shopping
          </div>

          <h1>
            Find exactly what
            <br />
            <span>you need.</span>
          </h1>

          <p>
            Search thousands of products using intelligent
            AI-powered search and personalized recommendations.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn" to="/products">
              <ShoppingBag size={18} />
              Explore products
            </Link>

            <Link className="secondary-btn" to="/search?q=laptop">
              <Search size={18} />
              Try AI search
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <Sparkles size={34} />
          <h3>AI Recommendations</h3>
          <p>
            Discover products ranked according to relevance,
            popularity, price and availability.
          </p>
        </div>
      </section>

      <section className="feature-grid">
        <div>
          <strong>10,000+</strong>
          <span>Products</span>
        </div>

        <div>
          <strong>AI Search</strong>
          <span>Smart discovery</span>
        </div>

        <div>
          <strong>Smart Ranking</strong>
          <span>Personalized results</span>
        </div>

        <div>
          <strong>Fast API</strong>
          <span>Real-time backend</span>
        </div>
      </section>
    </main>
  );
}
