import React, { useState, useEffect, useCallback } from "react";
import type { Product, Category } from "../../../types/Product";
import type { MenuFilter } from "../types";
import MenuSidebar from "../components/MenuSidebar";
import MenuItemCard from "../components/MenuItemCard";
import CartPanel from "../components/CartPanel";
import ToastNotification from "../components/ToastNotification";
import { useCartContext } from "../../../context/CartContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar/Page/Navbar";
import { fetchMenu, extractCategories } from "../menuService";
import { useAuth } from "../../auth/context/AuthContext";
import "../menu.css";

const MenuPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState(20);
  const [toasts, setToasts] = useState<
    Array<{ id: string; title: string; subtitle: string; icon: string }>
  >([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const { addToCart, getTotalItems } = useCartContext();
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Fetch menu from the real API
  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMenu();
      setProducts(data);
      setFilteredProducts(data);
      setCategories(extractCategories(data));
    } catch (err: any) {
      console.error("Failed to fetch menu:", err);
      setError(err.message || "Failed to load menu. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter((product) =>
        product.category.name.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply availability filter
    if (!showOutOfStock) {
      result = result.filter((product) => product.isAvailable);
    }
    
    // Apply price filter
    result = result.filter((product) => product.price <= maxPrice);

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popular") {
      result.sort((a, b) => {
        const aIsPopular = a.tag === "popular" ? 1 : 0;
        const bIsPopular = b.tag === "popular" ? 1 : 0;
        return bIsPopular - aIsPopular;
      });
    } else if (sortOption === "newest") {
      result.sort((a, b) => {
        const aIsNew = a.tag === "new" ? 1 : 0;
        const bIsNew = b.tag === "new" ? 1 : 0;
        return bIsNew - aIsNew;
      });
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, sortOption, maxPrice, products]);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    addToCart(product);

    // Add toast notification
    const newToast = {
      id: Date.now().toString(),
      title: `Added: ${product.name}`,
      subtitle: `RM ${product.price.toFixed(2)}`,
      icon: "🛒",
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleFilterChange = (filter: string, value: boolean) => {
    if (filter === 'include-out-of-stock') {
      setShowOutOfStock(value);
    } else if (filter === 'available-only') {
      setShowOutOfStock(!value); // If "Available Only" is checked, then showOutOfStock should be false
    }
    // For now, just log the other filter changes
    console.log(`Filter ${filter} changed to ${value}`);
  };

  const handlePriceChange = (value: number) => {
    setMaxPrice(value);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (loading) {
    return (
      <div className="menu-page">
        <Navbar onCartToggle={toggleCart} />
        <div className="page-hero">
          <h1>🍽️ Loading Menu</h1>
          <p>Loading delicious items for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <Navbar onCartToggle={toggleCart} />
        <div className="page-hero">
          <h1>⚠️ Oops!</h1>
          <p>{error}</p>
          <button
            className="search-btn"
            style={{ marginTop: "1rem" }}
            onClick={loadMenu}
          >
            <i className="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <Navbar onCartToggle={toggleCart} />

      <div className="page-hero">
        <h1>🍽️ Today's Menu</h1>
        <p>
          Fresh, delicious meals prepared daily. Order now and skip the queue.
        </p>
        <div className="hero-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search for dishes, drinks, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">
            <i className="fas fa-search"></i> Search
          </button>
        </div>
      </div>

      <div className="menu-layout">
        {/* SIDEBAR */}
        <MenuSidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          maxPrice={maxPrice}
          products={products}
          showOutOfStock={showOutOfStock}
          categories={categories}
        />

        {/* MAIN */}
        <div className="main-content">
          <div className="special-offer">
            <div className="offer-icon">🔥</div>
            <div className="offer-text">
              <strong>Lunch Combo Deal!</strong>
              <span>
                Order any rice + drink before 2PM and get 10% off. Use code:
                LUNCH10
              </span>
            </div>
          </div>

          <div className="sort-bar">
            <div className="result-count" id="resultCount">Showing {filteredProducts.length} items</div>
            <div className="sort-controls" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <select className="sort-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="view-toggle">
                <button
                  className={`view-btn ${!isListView ? "active" : ""}`}
                  id="gridViewBtn"
                  onClick={() => setIsListView(false)}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${isListView ? "active" : ""}`}
                  id="listViewBtn"
                  onClick={() => setIsListView(true)}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <div className={`items-grid ${isListView ? 'list-view' : ''}`} id="itemsGrid">
            {filteredProducts.map((product) => (
              <MenuItemCard
                key={product.id}
                product={product}
                isListView={isListView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default MenuPage;
