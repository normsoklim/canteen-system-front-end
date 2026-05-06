import React from 'react';
import type { Product, Category } from '../../../types/Product';

interface MenuSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onFilterChange: (filter: string, value: boolean) => void;
  onPriceChange: (value: number) => void;
  maxPrice: number;
  products: Product[];
  showOutOfStock: boolean;
  categories: Category[];
}

// Map known category names to emoji icons
const CATEGORY_ICONS: Record<string, string> = {
  rice: '🍚',
  noodle: '🍜',
  snack: '🥐',
  drink: '🥤',
  dessert: '🍮',
  burgers: '🍔',
  pizza: '🍕',
  soup: '🍲',
  default: '🍴',
};

function getCategoryIcon(name: string): string {
  const key = name.toLowerCase();
  for (const [pattern, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(pattern)) return icon;
  }
  return CATEGORY_ICONS.default;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({
  activeCategory,
  onCategoryChange,
  onFilterChange,
  onPriceChange,
  maxPrice,
  products,
  showOutOfStock,
  categories,
}) => {
  // Build category counts dynamically from products
  const categoryCounts: Record<string, number> = {
    all: products.length,
  };
  categories.forEach((cat) => {
    const key = cat.name.toLowerCase();
    categoryCounts[key] = products.filter(
      (p) => p.category.id === cat.id
    ).length;
  });

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian 🌿' },
    { id: 'halal', label: 'Halal ✅' },
    { id: 'spicy', label: 'Spicy 🌶️' },
    { id: 'gluten-free', label: 'Gluten Free' },
  ];

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <button
        className={`cat-link ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onCategoryChange('all')}
      >
        <span className="cat-icon">🍴</span> All Items
        <span className="cat-count" id="count-all">{categoryCounts.all}</span>
      </button>
      {categories.map((cat) => {
        const key = cat.name.toLowerCase();
        return (
          <button
            key={cat.id}
            className={`cat-link ${activeCategory === key ? 'active' : ''}`}
            onClick={() => onCategoryChange(key)}
          >
            <span className="cat-icon">{getCategoryIcon(cat.name)}</span>{' '}
            {cat.name}
            <span className="cat-count" id={`count-${key}`}>
              {categoryCounts[key] || 0}
            </span>
          </button>
        );
      })}

      <div className="filter-section">
        <div className="filter-label">Dietary</div>
        <label className="filter-chip">
          <input type="checkbox" onChange={(e) => onFilterChange('vegetarian', e.target.checked)} /> Vegetarian 🌿
        </label>
        <label className="filter-chip">
          <input type="checkbox" onChange={(e) => onFilterChange('halal', e.target.checked)} /> Halal ✅
        </label>
        <label className="filter-chip">
          <input type="checkbox" onChange={(e) => onFilterChange('spicy', e.target.checked)} /> Spicy 🌶️
        </label>
        <label className="filter-chip">
          <input type="checkbox" onChange={(e) => onFilterChange('gluten-free', e.target.checked)} /> Gluten Free
        </label>
      </div>
      <div className="filter-section">
        <div className="filter-label">Price Range</div>
        <div className="price-range">
          <div className="range-labels">
            <span>RM 2</span>
            <span id="rangeVal">RM {maxPrice}</span>
          </div>
          <input
            type="range"
            className="range-slider"
            min="2"
            max="20"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="filter-section">
        <div className="filter-label">Availability</div>
        <label className="filter-chip">
          <input
            type="checkbox"
            checked={!showOutOfStock}
            onChange={(e) => onFilterChange('available-only', !e.target.checked)}
          /> Available Only
        </label>
        <label className="filter-chip">
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={(e) => onFilterChange('include-out-of-stock', e.target.checked)}
          /> Include Out of Stock
        </label>
      </div>
    </div>
  );
};

export default MenuSidebar;
