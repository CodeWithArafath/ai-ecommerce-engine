import React, { useEffect, useState } from "react";
import { Sparkles, Brain } from "lucide-react";

import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";

export default function Recommendations() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get("/ai/recommendations?limit=20")
            .then(res => {
                setProducts(
                    (res.data.recommendations || [])
                        .map(item => item.product || item)
                );
            })
            .catch(() => {})
            .finally(() => setLoading(false));

    }, []);

    return (
        <main className="page">

            <div className="ai-header">

                <div className="ai-icon">
                    <Brain size={30} />
                </div>

                <div>
                    <span className="eyebrow">
                        <Sparkles size={16} />
                        AI ENGINE
                    </span>

                    <h1>Recommended for You</h1>

                    <p>
                        Products ranked using relevance, popularity,
                        value, stock availability and personalization.
                    </p>
                </div>

            </div>

            {loading ? (
                <Loading />
            ) : (
                <div className="product-grid">
                    {products.map(product => (
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
