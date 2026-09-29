import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MenuItem, CartItem, Order, StudentProfile, Coupon, ToastMessage, OrderStatus } from './types/food';
import { MENU_ITEMS, AVAILABLE_COUPONS } from './data/menuData';
import { ApiService, DEFAULT_PROFILE } from './services/apiService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OffersSection } from './components/OffersSection';
import { SearchAndFilters, VegFilterType, PriceFilterType, SortOption } from './components/SearchAndFilters';
import { FoodCard } from './components/FoodCard';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrdersListModal } from './components/OrdersListModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ProfileModal } from './components/ProfileModal';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BackToTop } from './components/BackToTop';
import { ToastContainer } from './components/Toast';
import { ChatBox } from './components/ChatBox';
import { Sparkles, Flame, SearchX } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Core Data states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // UI & Modal states
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'specials' | 'about'>('home');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegFilter, setVegFilter] = useState<VegFilterType>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Refs for smooth scrolling
  const menuRef = useRef<HTMLDivElement>(null);
  const specialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Helper: Toast Dispatcher
  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedTheme = ApiService.getTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setCart(ApiService.getCart());
    setFavoriteIds(ApiService.getFavorites());
    setOrders(ApiService.getOrders());
    setProfile(ApiService.getProfile());

    const savedCouponCode = ApiService.getSavedCoupon();
    if (savedCouponCode) {
      const found = AVAILABLE_COUPONS.find((c) => c.code === savedCouponCode);
      if (found) setAppliedCoupon(found);
    }
  }, []);

  // 2. Persist Cart changes
  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    ApiService.saveCart(newCart);
  };

  // 3. Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    ApiService.saveTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(
      `${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode Activated`,
      'Your display preference has been saved.',
      'info'
    );
  };

  // Add item to cart
  const handleAddToCart = (item: MenuItem) => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = cart.map((c, i) =>
        i === existingIndex ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updated = [...cart, { item, quantity: 1 }];
    }
    handleUpdateCart(updated);
    showToast(`Added to Tray`, `${item.name} is added to your order.`);
  };

  // Quantity stepper
  const handleUpdateQuantity = (item: MenuItem, delta: number) => {
    const existing = cart.find((c) => c.item.id === item.id);
    if (!existing) return;

    const newQuantity = existing.quantity + delta;
    if (newQuantity <= 0) {
      handleRemoveFromCart(item.id);
    } else {
      const updated = cart.map((c) =>
        c.item.id === item.id ? { ...c, quantity: newQuantity } : c
      );
      handleUpdateCart(updated);
    }
  };

  // Remove from cart
  const handleRemoveFromCart = (itemId: string) => {
    const itemToRemove = cart.find((c) => c.item.id === itemId);
    const updated = cart.filter((c) => c.item.id !== itemId);
    handleUpdateCart(updated);
    if (itemToRemove) {
      showToast(`Removed from Tray`, `${itemToRemove.item.name} was removed.`, 'info');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (item: MenuItem) => {
    let updated: string[];
    const isFav = favoriteIds.includes(item.id);
    if (isFav) {
      updated = favoriteIds.filter((id) => id !== item.id);
      showToast(`Removed from Favorites`, `${item.name} removed from your saved list.`, 'info');
    } else {
      updated = [...favoriteIds, item.id];
      showToast(`Saved to Favorites ❤️`, `${item.name} is saved for quick re-ordering.`);
    }
    setFavoriteIds(updated);
    ApiService.saveFavorites(updated);
  };

  // Apply Coupon
  const handleApplyCouponByCode = (code: string): { success: boolean; message: string } => {
    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      return { success: false, message: `Coupon "${code}" is invalid or expired.` };
    }
    const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Min order of ₹${found.minOrder} required for ${found.code} (Current: ₹${subtotal}).`,
      };
    }
    setAppliedCoupon(found);
    ApiService.saveCoupon(found.code);
    showToast(`Coupon Applied! 🎉`, `${found.discountPercent}% discount activated.`);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const handleApplyCouponDirectly = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    ApiService.saveCoupon(coupon.code);
    showToast(`Code ${coupon.code} Applied`, `${coupon.title} is ready at checkout.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    ApiService.saveCoupon(null);
    showToast(`Coupon Removed`, 'Standard canteen pricing restored.', 'info');
  };

  // Place Order handler
  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'pickupToken' | 'status'>) => {
    // Generate simple order ID like CB10245
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `CB${randomNum}`;
    const tokenNumber = `T-${Math.floor(10 + Math.random() * 89)}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      pickupToken: tokenNumber,
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    ApiService.saveOrders(updatedOrders);

    // Clear cart and checkout modal
    handleUpdateCart([]);
    setCheckoutModalOpen(false);
    setCartDrawerOpen(false);

    // Open live tracking screen
    setTrackedOrder(newOrder);

    showToast(
      `Order Placed! #${orderId}`,
      `Token ${tokenNumber} is sent to Kitchen Counter #2.`,
      'success'
    );

    return newOrder;
  };

  // Update order status (used by tracking modal & simulator)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    ApiService.saveOrders(updated);

    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder({ ...trackedOrder, status });
    }

    if (status === 'ready') {
      showToast(`Token #${orderId} Ready! 🔔`, `Please collect your food from Counter #2.`, 'success');
    }
  };

  // Reorder all items from a past order
  const handleReorder = (pastOrder: Order) => {
    const newItems: CartItem[] = [...cart];
    pastOrder.items.forEach((pastItem) => {
      const existing = newItems.find((c) => c.item.id === pastItem.item.id);
      if (existing) {
        existing.quantity += pastItem.quantity;
      } else {
        newItems.push({ item: pastItem.item, quantity: pastItem.quantity });
      }
    });
    handleUpdateCart(newItems);
    setCartDrawerOpen(true);
    showToast(`Items Reordered!`, `Items from Order #${pastOrder.id} added to your tray.`);
  };

  // Save student profile
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    ApiService.saveProfile(newProfile);
    showToast(`Profile Saved`, `College ID details updated successfully.`);
  };

  // Filtered & Sorted Menu Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesIngredients = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesIngredients) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Veg / Non-Veg
      if (vegFilter === 'veg' && !item.isVeg) return false;
      if (vegFilter === 'non-veg' && item.isVeg) return false;

      // 4. Price
      if (priceFilter === 'under50' && item.price >= 50) return false;
      if (priceFilter === '50to100' && (item.price < 50 || item.price > 100)) return false;
      if (priceFilter === 'above100' && item.price <= 100) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'prep-time') return a.prepTimeMinutes - b.prepTimeMinutes;
      // Default: Most Popular / Special first
      return (b.isPopular ? 1 : 0) + (b.isSpecial ? 1 : 0) - ((a.isPopular ? 1 : 0) + (a.isSpecial ? 1 : 0));
    });
  }, [searchQuery, selectedCategory, vegFilter, priceFilter, sortOption]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    vegFilter !== 'all' ||
    priceFilter !== 'all' ||
    sortOption !== 'popular';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setVegFilter('all');
    setPriceFilter('all');
    setSortOption('popular');
  };

  // Nav actions
  const scrollToMenu = () => {
    setActiveTab('menu');
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSpecials = () => {
    setActiveTab('specials');
    specialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    setActiveTab('about');
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusSearch = () => {
    scrollToMenu();
    setTimeout(() => {
      const el = document.getElementById('food-search-input');
      el?.focus();
    }, 300);
  };

  const handleNav = (tab: string) => {
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveTab('home');
    } else if (tab === 'menu') {
      scrollToMenu();
    } else if (tab === 'specials') {
      scrollToSpecials();
    } else if (tab === 'about') {
      scrollToAbout();
    }
  };

  // Cart total item count
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Favorite items objects
  const favoriteItems = MENU_ITEMS.filter((item) => favoriteIds.includes(item.id));

  // Today's Specials items
  const specialsItems = MENU_ITEMS.filter((item) => item.isSpecial);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] dark:bg-[#121316] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Navbar */}
      <Navbar
        cartCount={cartTotalCount}
        favoritesCount={favoriteIds.length}
        ordersCount={orders.length}
        activeTab={activeTab}
        theme={theme}
        onNavigate={handleNav}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenFavorites={() => setFavoritesModalOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onToggleTheme={toggleTheme}
        onFocusSearch={handleFocusSearch}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <Hero
          onExploreMenu={scrollToMenu}
          onViewSpecials={scrollToSpecials}
          onOpenChat={() => setChatOpen(true)}
        />

        {/* 2. Offers & Promo Section */}
        <OffersSection
          onApplyCoupon={handleApplyCouponDirectly}
          appliedCouponCode={appliedCoupon?.code}
        />

        {/* 3. Today's Specials Curated Showcase */}
        <section ref={specialsRef} className="py-12 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Chef's Daily Showcase</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                  Today's Specials
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Freshly prepared batch recommendations with campus discounts
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialsItems.slice(0, 4).map((item) => {
                const cartQty = cart.find((c) => c.item.id === item.id)?.quantity || 0;
                return (
                  <FoodCard
                    key={item.id}
                    item={item}
                    cartQuantity={cartQty}
                    isFavorite={favoriteIds.includes(item.id)}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onToggleFavorite={handleToggleFavorite}
                    onQuickView={(it) => setQuickViewItem(it)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Full Food Menu & Interactive Search / Filters */}
        <section ref={menuRef} id="menu-section" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Fresh From The Kitchen
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
                Canteen Food Menu
              </h2>
            </div>

            {/* Filter and Search Controls */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              vegFilter={vegFilter}
              onVegFilterChange={setVegFilter}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              sortOption={sortOption}
              onSortChange={setSortOption}
              totalFilteredCount={filteredItems.length}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Food Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => {
                  const cartQty = cart.find((c) => c.item.id === item.id)?.quantity || 0;
                  return (
                    <FoodCard
                      key={item.id}
                      item={item}
                      cartQuantity={cartQty}
                      isFavorite={favoriteIds.includes(item.id)}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onToggleFavorite={handleToggleFavorite}
                      onQuickView={(it) => setQuickViewItem(it)}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 p-8">
                <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Food Items Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any dishes matching your filters. Try clearing your search or switching categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. About & Operational Information */}
        <div ref={aboutRef}>
          <AboutSection />
        </div>

      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNav}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenFavorites={() => setFavoritesModalOpen(true)}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        cartCount={cartTotalCount}
        favoritesCount={favoriteIds.length}
        ordersCount={orders.length}
        onNavigate={handleNav}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenFavorites={() => setFavoritesModalOpen(true)}
      />

      {/* Floating Back-To-Top Button */}
      <BackToTop />

      {/* Modals & Slide-out Drawers */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onApplyCoupon={handleApplyCouponByCode}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutModalOpen(true);
        }}
        onExploreMenu={scrollToMenu}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        profile={profile}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackingModal
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      <OrdersListModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        orders={orders}
        onSelectOrderToTrack={(ord) => setTrackedOrder(ord)}
        onReorder={handleReorder}
        onExploreMenu={scrollToMenu}
      />

      <FavoritesModal
        isOpen={favoritesModalOpen}
        onClose={() => setFavoritesModalOpen(false)}
        favorites={favoriteItems}
        onAddToCart={handleAddToCart}
        onRemoveFavorite={handleToggleFavorite}
        onExploreMenu={scrollToMenu}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        orders={orders}
        favoritesCount={favoriteIds.length}
        onSaveProfile={handleSaveProfile}
      />

      <QuickViewModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        cartQuantity={
          quickViewItem ? cart.find((c) => c.item.id === quickViewItem.id)?.quantity || 0 : 0
        }
        isFavorite={quickViewItem ? favoriteIds.includes(quickViewItem.id) : false}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Canteen AI Chat Assistant (n8n Webhook Connected) */}
      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpen={() => setChatOpen(true)}
        initialWebhookUrl="https://varshitha16.app.n8n.cloud/webhook/c2f039a7-720b-41fa-8cbe-394d28b15ee8/chat"
      />

    </div>
  );
}
