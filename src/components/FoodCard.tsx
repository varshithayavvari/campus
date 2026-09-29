import React, { useState } from 'react';
import { MenuItem } from '../types/food';
import { Star, Clock, Plus, Minus, Heart, Eye, Flame, Utensils } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  cartQuantity: number;
  isFavorite: boolean;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  onToggleFavorite: (item: MenuItem) => void;
  onQuickView: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  cartQuantity,
  isFavorite,
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
  onQuickView,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
      
      {/* Top Media Slot */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Zero-broken-image policy fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-200/50 dark:to-slate-800 text-amber-600 dark:text-amber-400">
            <Utensils className="w-10 h-10 mb-2 opacity-70" />
            <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-300">
              {item.name}
            </span>
          </div>
        )}

        {/* Dietary Tag (Veg / Non-Veg Indicator) */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
          <span
            className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          />
        </div>

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(item)}
          className="absolute top-3 right-12 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 transition-all hover:scale-105"
          title="Quick preview & ingredients"
          aria-label={`Quick view ${item.name}`}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(item)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95 ${
            isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-500 hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          aria-label={`Favorite ${item.name}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Popular / Special Marker */}
        {(item.isSpecial || item.isPopular) && (
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{item.isSpecial ? "Today's Special" : 'Bestseller'}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata Row: Category & Prep Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="capitalize font-medium text-slate-600 dark:text-slate-300">
              {item.category}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{item.prepTime}</span>
            </div>
          </div>

          {/* Item Name */}
          <h3
            onClick={() => onQuickView(item)}
            className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
          >
            {item.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Rating and Price Baseline */}
        <div>
          <div className="flex items-center justify-between py-1 mb-2">
            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">₹</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-display tabular-nums">
                {item.price}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 tabular-nums">
                {item.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                ({item.ratingCount})
              </span>
            </div>
          </div>

          {/* Action Button: Add to Cart OR Quantity Controller */}
          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-600 hover:text-white dark:bg-amber-500/15 dark:hover:bg-amber-500 dark:hover:text-slate-950 border border-amber-500/25 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-amber-600 text-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => onUpdateQuantity(item, -1)}
                className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-amber-700 active:scale-95 transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="text-xs font-extrabold px-3 tabular-nums">
                {cartQuantity} in Cart
              </span>
              <button
                onClick={() => onUpdateQuantity(item, 1)}
                className="w-8 h-7 flex items-center justify-center rounded-lg hover:bg-amber-700 active:scale-95 transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
