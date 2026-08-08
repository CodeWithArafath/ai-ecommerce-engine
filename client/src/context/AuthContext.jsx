import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    registerUser
} from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");

        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));

            if (user._id) {
                localStorage.setItem("userId", user._id);
            }

            if (user.id) {
                localStorage.setItem("userId", user.id);
            }
        }
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const result = await loginUser({
                email,
                password
            });

            if (result.token) {
                localStorage.setItem("token", result.token);
            }

            const loggedUser =
                result.user ||
                result.data?.user ||
                null;

            if (loggedUser) {
                setUser(loggedUser);
            }

            return result;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        setLoading(true);

        try {
            const result = await registerUser(data);

            if (result.token) {
                localStorage.setItem("token", result.token);
            }

            const registeredUser =
                result.user ||
                result.data?.user ||
                null;

            if (registeredUser) {
                setUser(registeredUser);
            }

            return result;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
