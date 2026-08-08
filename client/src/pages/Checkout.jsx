import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useApp } from "../context/AppContext";

export default function Checkout() {

    const { cart, loadShopData } = useApp();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "cod"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const items = cart?.items || [];

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.product?.price || 0) *
            Number(item.quantity || 0),
        0
    );

    const change = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submit = async e => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.post("/shop/checkout", {
                paymentMethod: form.paymentMethod,
                shippingAddress: {
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode
                }
            });

            await loadShopData();

            navigate("/orders");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Checkout failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page">

            <div className="page-header">
                <h1>Checkout</h1>
                <p>Complete your order securely.</p>
            </div>

            <div className="checkout-layout">

                <form
                    className="checkout-form"
                    onSubmit={submit}
                >

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <h2>Shipping Address</h2>

                    <div className="form-grid">

                        <input
                            name="name"
                            placeholder="Full name"
                            value={form.name}
                            onChange={change}
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={change}
                            required
                        />

                        <input
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={change}
                            required
                        />

                        <input
                            name="state"
                            placeholder="State"
                            value={form.state}
                            onChange={change}
                            required
                        />

                        <input
                            name="pincode"
                            placeholder="Pincode"
                            value={form.pincode}
                            onChange={change}
                            required
                        />

                    </div>

                    <textarea
                        name="address"
                        placeholder="Full address"
                        value={form.address}
                        onChange={change}
                        required
                    />

                    <h2>Payment Method</h2>

                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={form.paymentMethod === "cod"}
                            onChange={change}
                        />
                        Cash on Delivery
                    </label>

                    <button
                        className="primary-button full"
                        disabled={loading || !items.length}
                    >
                        {loading
                            ? "Placing Order..."
                            : "Place Order"}
                    </button>

                </form>

                <aside className="summary">

                    <h2>Summary</h2>

                    {items.map(item => (
                        <div
                            className="summary-row"
                            key={item.product?._id}
                        >
                            <span>
                                {item.product?.name} × {item.quantity}
                            </span>
                            <span>
                                ₹{(
                                    Number(item.product?.price || 0) *
                                    Number(item.quantity || 0)
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}

                    <hr />

                    <div className="summary-total">
                        <span>Total</span>
                        <strong>
                            ₹{total.toLocaleString("en-IN")}
                        </strong>
                    </div>

                </aside>

            </div>

        </main>
    );
}
