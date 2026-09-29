import React from 'react';
import { Home, Utensils, Clock, Heart, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  cartCount: number;
  favoritesCount: number;
  ordersCount: number;
  onNavigate: (tab: string) => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenFavorites: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  cartCount,
  favoritesCount,
  ordersCount,
  onNavigate,
  onOpenCart,
  onOpenOrders,
  onOpenFavorites,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'home'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Menu */}
        <button
          onClick={() => onNavigate('menu')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'menu'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Utensils className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>

        {/* Orders */}
        <button
          onClick={onOpenOrders}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Orders</span>
          {ordersCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
              {ordersCount}
            </span>
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={onOpenFavorites}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Saved</span>
          {favoritesCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-300"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-slate-900 dark:bg-white text-amber-300 dark:text-slate-900 text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Tray</span>
        </button>
      </div>
    </div>
  );
};
