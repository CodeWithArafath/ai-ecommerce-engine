import { useState } from "react";

import {
    aiSearch
} from "../api/productApi";

import ProductCard from "../components/ProductCard";

const AISearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const data =
                await aiSearch(query, 20);

            setResults(data.results || []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page">
            <div className="ai-search-hero">
                <p className="eyebrow">
                    AI POWERED
                </p>

                <h1>
                    What are you looking for?
                </h1>

                <p>
                    Search naturally. Our intelligent
                    search engine understands product
                    keywords and semantic intent.
                </p>

                <div className="search-box">
                    <input
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                search();
                            }
                        }}
                        placeholder="Try: laptop, shoes, electronics..."
                    />

                    <button
                        className="primary-btn"
                        onClick={search}
                    >
                        AI Search
                    </button>
                </div>
            </div>

            {loading && (
                <div className="loading">
                    Finding the best products...
                </div>
            )}

            {!loading && results.length > 0 && (
                <section className="section">
                    <div className="section-heading">
                        <h2>
                            Results for "{query}"
                        </h2>
                    </div>

                    <div className="product-grid">
                        {results.map((item) => (
                            <ProductCard
                                key={item.product?._id}
                                product={
                                    item.product
                                }
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default AISearch;
