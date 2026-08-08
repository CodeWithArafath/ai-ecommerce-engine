import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Orders() {
  const { cart, cartTotal, setCart } = useApp();

  const checkout = () => {
    if (!cart.length) return;

    const orders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    orders.unshift({
      id: Date.now(),
      items: cart,
      total: cartTotal,
      status: "Placed",
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    setCart([]);
    localStorage.setItem("cart", "[]");

    alert("Order placed successfully!");
  };

  const orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">Orders</span>
        <h1>Checkout & orders</h1>
      </div>

      {cart.length > 0 && (
        <section className="checkout-card">
          <h2>Current order</h2>

          <p>
            {cart.length} product(s) · ?
            {cartTotal.toLocaleString("en-IN")}
          </p>

          <button
            className="primary-btn"
            onClick={checkout}
          >
            Place order
          </button>
        </section>
      )}

      <section className="orders-list">
        {orders.length ? (
          orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <strong>Order #{order.id}</strong>
                <p>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <strong>
                ?{Number(order.total).toLocaleString("en-IN")}
              </strong>

              <span>{order.status}</span>
            </article>
          ))
        ) : (
          <div className="empty">
            <h2>No orders yet</h2>
            <Link to="/products">Start shopping</Link>
          </div>
        )}
      </section>
    </main>
  );
}
