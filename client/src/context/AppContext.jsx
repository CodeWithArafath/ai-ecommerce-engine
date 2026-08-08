import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext(null);

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(
    () => readStorage("user", null)
  );

  const [cart, setCart] = useState(
    () => readStorage("cart", [])
  );

  const [wishlist, setWishlist] = useState(
    () => readStorage("wishlist", [])
  );

  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const addToCartLocal = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity:
                  (item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCartLocal = (id) => {
    setCart((current) =>
      current.filter(
        (item) => item._id !== id
      )
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCartLocal(id);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => item._id === product._id
      );

      return exists
        ? current.filter(
            (item) => item._id !== product._id
          )
        : [...current, product];
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity || 1),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        (item.quantity || 1),
    0
  );

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        wishlist,
        setWishlist,
        cartCount,
        cartTotal,
        addToCartLocal,
        removeFromCartLocal,
        updateQuantity,
        toggleWishlist,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
