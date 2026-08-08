import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCartLocal,
  } = useApp();

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">Shopping</span>
        <h1>Your cart</h1>
      </div>

      {!cart.length ? (
        <div className="empty">
          <h2>Your cart is empty</h2>
          <p>Add products to start shopping.</p>
          <Link className="primary-btn" to="/products">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item._id}>
                <div className="cart-image">
                  {item.category}
                </div>

                <div className="cart-info">
                  <small>{item.brand}</small>
                  <h3>{item.name}</h3>
                  <strong>
                    ?{Number(item.price).toLocaleString("en-IN")}
                  </strong>

                  <div className="quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          (item.quantity || 1) - 1
                        )
                      }
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          (item.quantity || 1) + 1
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    removeFromCartLocal(item._id)
                  }
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </section>

          <aside className="summary">
            <h2>Order summary</h2>

            <div>
              <span>Subtotal</span>
              <strong>
                ?{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <hr />

            <div>
              <span>Total</span>
              <strong>
                ?{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <Link className="primary-btn full" to="/orders">
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
