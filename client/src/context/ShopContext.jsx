import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCart,
    getWishlist
} from "../api/shopApi";

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState({
        items: [],
        total: 0
    });

    const [wishlist, setWishlist] = useState({
        products: []
    });

    const [cartCount, setCartCount] = useState(0);

    const refreshShopState = async () => {
        try {
            const cartData = await getCart();

            if (cartData?.cart) {
                setCart(cartData.cart);

                const count =
                    cartData.cart.items?.reduce(
                        (sum, item) =>
                            sum + Number(item.quantity || 0),
                        0
                    ) || 0;

                setCartCount(count);
            }
        } catch {
            // Authentication may not exist yet.
        }

        try {
            const wishlistData = await getWishlist();

            if (wishlistData?.wishlist) {
                setWishlist(wishlistData.wishlist);
            }
        } catch {
            // Authentication may not exist yet.
        }
    };

    useEffect(() => {
        refreshShopState();
    }, []);

    return (
        <ShopContext.Provider
            value={{
                cart,
                setCart,
                cartCount,
                setCartCount,
                wishlist,
                setWishlist,
                refreshShopState
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);
