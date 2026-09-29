import React, { useState } from 'react';
import { MenuItem } from '../types/food';
import { X, Star, Clock, Flame, ShieldAlert, Plus, Minus, Heart, Utensils } from 'lucide-react';

interface QuickViewModalProps {
  item: MenuItem | null;
  onClose: () => void;
  cartQuantity: number;
  isFavorite: boolean;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  onToggleFavorite: (item: MenuItem) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  item,
  onClose,
  cartQuantity,
  isFavorite,
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Hero Image */}
          <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800">
            {!imageError ? (
              <img
                src={item.image}
                alt={item.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-amber-500">
                <Utensils className="w-12 h-12 mb-2" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'} />
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                    {item.category}
                  </span>
                  {item.calories && (
                    <>
                      <span>·</span>
                      <span className="text-xs text-slate-200">{item.calories}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-black font-display">{item.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300 block">Price</span>
                <span className="text-2xl font-black text-amber-400 font-display tabular-nums">
                  ₹{item.price}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {item.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">({item.ratingCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Prep: <strong className="text-slate-900 dark:text-white">{item.prepTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Fresh from Canteen Wok</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Key Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens warning if any */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-semibold">Contains: </span>
                  <span>{item.allergens.join(', ')}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleFavorite(item)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
              isFavorite
                ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
          </button>

          {cartQuantity === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart (₹{item.price})</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-amber-600 text-white rounded-xl p-1.5 px-3">
              <button
                onClick={() => onUpdateQuantity(item, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xs font-black tabular-nums">
                {cartQuantity} in Cart (₹{cartQuantity * item.price})
              </span>
              <button
                onClick={() => onUpdateQuantity(item, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
