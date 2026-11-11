import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    const isActive =
      location.pathname === path || (path === "/categorias" && location.pathname === "/");
    return isActive
      ? "bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition"
      : "text-indigo-100 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition";
  };

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <span className="text-white text-xl font-bold tracking-tight">Food Store Manager</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/categorias" className={getLinkClasses("/categorias")}>
              Categorías
            </Link>
            <Link to="/productos" className={getLinkClasses("/productos")}>
              Productos
            </Link>
            <Link to="/ingredientes" className={getLinkClasses("/ingredientes")}>
              Ingredientes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;