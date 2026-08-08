import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
