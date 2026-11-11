import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoriasPage from "./pages/CategoriasPage";
import ProductsPage from "./pages/ProductsPage";
import IngredientesPage from "./pages/IngredientesPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<CategoriasPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/ingredientes" element={<IngredientesPage />} />
      </Routes>
    </div>
  );
}

export default App;