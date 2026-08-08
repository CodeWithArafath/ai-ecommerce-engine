import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    ShoppingCart
} from "lucide-react";

import api from "../services/api";
import { useApp } from "../context/AppContext";
import Loading from "../components/Loading";

export default function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    const {
        addToCart,
        toggleWishlist
    } = useApp();

    useEffect(() => {

        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data.product);
            })
            .catch(() => setProduct(null));

    }, [id]);

    if (!product) {
        return <Loading />;
    }

    const image =
        product.images?.[0] ||
        product.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000";

    const add = async () => {

        try {
            await addToCart(product._id, quantity);
            setMessage("Added to cart successfully");
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <main className="page">

            <Link to="/products" className="back-link">
                <ArrowLeft size={18} />
                Back to products
            </Link>

            <div className="details">

                <div className="details-image">
                    <img src={image} alt={product.name} />
                </div>

                <div className="details-content">

                    <span className="category">
                        {product.category}
                    </span>

                    <h1>{product.name}</h1>

                    <div className="details-price">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                    </div>

                    <p className="details-description">
                        {product.description}
                    </p>

                    <div className="detail-meta">
                        <span>
                            Brand: <strong>{product.brand}</strong>
                        </span>

                        <span>
                            Stock: <strong>{product.stock}</strong>
                        </span>
                    </div>

                    <div className="quantity">

                        <button
                            onClick={() =>
                                setQuantity(Math.max(quantity - 1, 1))
                            }
                        >
                            −
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={() =>
                                setQuantity(
                                    Math.min(
                                        quantity + 1,
                                        Number(product.stock || 1)
                                    )
                                )
                            }
                        >
                            +
                        </button>

                    </div>

                    <div className="details-actions">

                        <button
                            className="primary-button"
                            onClick={add}
                        >
                            <ShoppingCart size={19} />
                            Add to Cart
                        </button>

                        <button
                            className="secondary-button"
                            onClick={async () => {
                                try {
                                    await toggleWishlist(product._id);
                                    setMessage("Wishlist updated");
                                } catch (error) {
                                    setMessage(error.message);
                                }
                            }}
                        >
                            <Heart size={19} />
                            Wishlist
                        </button>

                    </div>

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                </div>

            </div>

        </main>
    );
}
