import React, { useState } from 'react';
import { ShoppingBag, Heart, Clock, User, Sun, Moon, Search, Menu as MenuIcon, X, UtensilsCrossed, MessageSquare } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  ordersCount: number;
  activeTab: string;
  theme: 'light' | 'dark';
  onNavigate: (tab: string) => void;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenOrders: () => void;
  onOpenProfile: () => void;
  onToggleTheme: () => void;
  onFocusSearch: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  favoritesCount,
  ordersCount,
  activeTab,
  theme,
  onNavigate,
  onOpenCart,
  onOpenFavorites,
  onOpenOrders,
  onOpenProfile,
  onToggleTheme,
  onFocusSearch,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Campus<span className="text-amber-600 dark:text-amber-500">Bites</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 -mt-1 hidden sm:inline">
                College Food Hall
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
                activeTab === 'home' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
                activeTab === 'menu' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => handleNavClick('specials')}
              className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
                activeTab === 'specials' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
              }`}
            >
              Today's Specials
            </button>
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
            >
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                  {ordersCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenFavorites}
              className="flex items-center gap-1.5 transition-colors hover:text-amber-600 dark:hover:text-amber-400"
            >
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 tabular-nums">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-amber-600 dark:hover:text-amber-400 ${
                activeTab === 'about' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <button
              onClick={onFocusSearch}
              title="Search menu"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Search food"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle color theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* AI Chat Button */}
            <button
              onClick={onOpenChat}
              title="Chat with Canteen AI Support"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/80 rounded-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>AI Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </button>

            {/* Student Profile Button */}
            <button
              onClick={onOpenProfile}
              title="Student Profile"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Student ID</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-xl shadow-sm shadow-amber-600/30 transition-all duration-150"
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.4]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-slate-950 text-amber-300 tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Food Menu
          </button>
          <button
            onClick={() => handleNavClick('specials')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Today's Specials
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> My Orders & Tracking
            </span>
            {ordersCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full">
                {ordersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenFavorites();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Saved Favorites
            </span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenChat();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Canteen AI Chat</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">Online</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenProfile();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <User className="w-4 h-4 text-slate-500" /> Student Profile & College ID
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Canteen Timings & Location
          </button>
        </div>
      )}
    </header>
  );
};
