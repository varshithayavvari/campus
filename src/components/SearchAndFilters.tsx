import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Category } from '../types/food';

export type VegFilterType = 'all' | 'veg' | 'non-veg';
export type PriceFilterType = 'all' | 'under50' | '50to100' | 'above100';
export type SortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'prep-time';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  vegFilter: VegFilterType;
  onVegFilterChange: (v: VegFilterType) => void;
  priceFilter: PriceFilterType;
  onPriceFilterChange: (p: PriceFilterType) => void;
  sortOption: SortOption;
  onSortChange: (s: SortOption) => void;
  totalFilteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Items', emoji: '🍽️' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🥞' },
  { id: 'lunch', label: 'Lunch & Bowls', emoji: '🍛' },
  { id: 'snacks', label: 'Snacks', emoji: '🍟' },
  { id: 'beverages', label: 'Beverages & Chai', emoji: '☕' },
  { id: 'desserts', label: 'Desserts', emoji: '🍨' },
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  vegFilter,
  onVegFilterChange,
  priceFilter,
  onPriceFilterChange,
  sortOption,
  onSortChange,
  totalFilteredCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Bar: Search Input + Sorting Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="food-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search food by name, ingredients (e.g., Dosa, Paneer, Chai)..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Dietary Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Veg / Non-Veg Toggle Pill Bar */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onVegFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                vegFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onVegFilterChange('veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                vegFilter === 'veg'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              <span className="veg-badge scale-75" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => onVegFilterChange('non-veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                vegFilter === 'non-veg'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              <span className="non-veg-badge scale-75" />
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-8 pr-8 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated ★</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="prep-time">Fastest Prep Time</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* Category Horizontal Scrolling Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Price Sub-Filter & Result Count Strip */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-amber-500" />
            Budget:
          </span>
          <button
            onClick={() => onPriceFilterChange('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              priceFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Any Price
          </button>
          <button
            onClick={() => onPriceFilterChange('under50')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              priceFilter === 'under50'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Under ₹50
          </button>
          <button
            onClick={() => onPriceFilterChange('50to100')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              priceFilter === '50to100'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ₹50 – ₹100
          </button>
          <button
            onClick={() => onPriceFilterChange('above100')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              priceFilter === 'above100'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ₹100+
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-slate-900 dark:text-white tabular-nums">{totalFilteredCount}</strong> delicious items
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
