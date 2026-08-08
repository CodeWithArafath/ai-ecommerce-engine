import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const submit = (event) => {
        event.preventDefault();

        const value = query.trim();

        if (!value) {
            navigate("/products");
            return;
        }

        navigate(
            `/products?q=${encodeURIComponent(value)}`
        );
    };

    return (
        <form
            onSubmit={submit}
            className="search-bar"
        >
            <input
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
                placeholder="Search products..."
            />

            <button type="submit">
                Search
            </button>
        </form>
    );
}
