import React, { useState } from 'react';
import { CartItem, Coupon } from '../types/food';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Clock, Sparkles } from 'lucide-react';
import { AVAILABLE_COUPONS } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onUpdateQuantity: (item: CartItem['item'], delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  onExploreMenu,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  // Discount calculation
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  
  // Nominal packaging / token fee for campus counter orders
  const packagingFee = subtotal > 0 ? 5 : 0;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee);

  // Estimated max prep time
  const maxPrepTime = cart.reduce((max, curr) => Math.max(max, curr.item.prepTimeMinutes), 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim().toUpperCase());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Canteen Tray</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cart.length === 0 ? 'Tray is empty' : `${cart.length} item types in tray`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 animate-pulse">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Your Tray is Empty!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Hungry? Browse our delicious hot dosas, rolls, crispy fries and chai to add to your order.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreMenu();
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all"
                >
                  Explore Today's Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {cart.map((cartItem) => {
                    const itemTotal = cartItem.item.price * cartItem.quantity;
                    return (
                      <div
                        key={cartItem.item.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Title and pricing */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={cartItem.item.isVeg ? 'veg-badge scale-75' : 'non-veg-badge scale-75'} />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {cartItem.item.name}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ₹{cartItem.item.price} each
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(cartItem.item, -1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-600"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(cartItem.item, 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-600"
                                aria-label="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Item Subtotal & Trash */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                ₹{itemTotal}
                              </span>
                              <button
                                onClick={() => onRemoveItem(cartItem.item.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Estimated Prep Notice */}
                {maxPrepTime > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      Estimated ready time: <strong>~{maxPrepTime} mins</strong> from order confirmation.
                    </span>
                  </div>
                )}

                {/* Promo Coupon Form */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError(null);
                        }}
                        placeholder="Promo code (e.g. CAMPUS10)"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono tracking-wider bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1.5 ml-1">
                      {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)</span>
                      </div>
                      <button
                        onClick={onRemoveCoupon}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer: Totals & Proceed */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Tray Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    ₹{subtotal}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Student Discount</span>
                    <span className="font-semibold tabular-nums">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Canteen Packaging & Token</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    ₹{packagingFee}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-base text-amber-600 dark:text-amber-400 font-display tabular-nums">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] rounded-xl shadow-md shadow-amber-600/25 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
