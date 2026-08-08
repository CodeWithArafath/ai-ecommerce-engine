import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function AI() {
    const { addToCart } = useCart();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            const response = await api.get(
                "/ai/recommendations?limit=8"
            );

            setRecommendations(
                response.data.recommendations || []
            );
        } catch {
            setRecommendations([]);
        }
    };

    const search = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        try {
            setLoading(true);

            const response = await api.get(
                "/ai/search",
                {
                    params: {
                        q: query,
                        limit: 12
                    }
                }
            );

            setResults(response.data.results || []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="hero">
                <h1>AI Shopping Assistant</h1>

                <p>
                    Search products using natural language.
                </p>

                <form
                    className="search"
                    onSubmit={search}
                >
                    <input
                        value={query}
                        onChange={e =>
                            setQuery(e.target.value)
                        }
                        placeholder="Try: laptop, shoes, mobiles..."
                    />

                    <button>
                        {loading ? "Searching..." : "AI Search"}
                    </button>
                </form>
            </div>

            {results.length > 0 && (
                <>
                    <h2>Search Results</h2>

                    <div className="grid">
                        {results.map(item => {
                            const product = item.product;

                            return (
                                <div
                                    className="card"
                                    key={product._id}
                                >
                                    <span className="category">
                                        {product.category}
                                    </span>

                                    <h3>{product.name}</h3>

                                    <p>{product.brand}</p>

                                    <p className="price">
                                        ₹{Number(
                                            product.price || 0
                                        ).toFixed(2)}
                                    </p>

                                    <div className="actions">
                                        <Link
                                            className="secondary"
                                            to={`/products/${product._id}`}
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() =>
                                                addToCart(product)
                                            }
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            <h2 className="section-title">
                AI Recommendations
            </h2>

            <div className="grid">
                {recommendations.map(item => {
                    const product =
                        item.product || item;

                    return (
                        <div
                            className="card"
                            key={product._id}
                        >
                            <span className="category">
                                {product.category}
                            </span>

                            <h3>{product.name}</h3>

                            <p>{product.brand}</p>

                            <p className="price">
                                ₹{Number(
                                    product.price || 0
                                ).toFixed(2)}
                            </p>

                            <button
                                onClick={() =>
                                    addToCart(product)
                                }
                            >
                                Add to Cart
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
