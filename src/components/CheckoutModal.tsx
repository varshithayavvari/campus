import React, { useState } from 'react';
import { CartItem, Coupon, StudentProfile, Order } from '../types/food';
import { X, Clock, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  profile: StudentProfile;
  onPlaceOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'pickupToken' | 'status'>) => Promise<Order>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  profile,
  onPlaceOrder,
}) => {
  const [name, setName] = useState(profile.name || 'Aarav Sharma');
  const [collegeId, setCollegeId] = useState(profile.collegeId || 'CB2024-CS089');
  const [phone, setPhone] = useState(profile.phone || '9876543210');
  const [pickupTime, setPickupTime] = useState('As soon as ready (approx. 12 mins)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const packagingFee = 5;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee);
  const maxPrepTime = cart.reduce((max, curr) => Math.max(max, curr.item.prepTimeMinutes), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your student name.');
      return;
    }
    if (!collegeId.trim()) {
      setError('Please provide your College Roll / ID.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number for pickup SMS/Token.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Calculate estimated ready time string
      const now = new Date();
      now.setMinutes(now.getMinutes() + (maxPrepTime || 12));
      const estTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await onPlaceOrder({
        items: cart,
        subtotal,
        discount,
        packagingFee,
        total: grandTotal,
        studentName: name.trim(),
        collegeId: collegeId.trim(),
        phone: phone.trim(),
        pickupTime,
        notes: notes.trim(),
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        estimatedReadyTime: estTimeStr
      });
      // onPlaceOrder handles the screen transition to order confirmation/tracking
    } catch {
      setError('Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Canteen Pickup Checkout
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick up directly from Counter #2 upon token notification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                College ID / Roll Number *
              </label>
              <input
                type="text"
                required
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="e.g. CB2024-CS089"
                className="w-full px-3.5 py-2 text-xs uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Pickup Slot *
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                <option value="As soon as ready (approx. 12 mins)">As soon as ready (~12 mins)</option>
                <option value="Morning Break (11:15 AM - 11:30 AM)">Morning Break (11:15 AM)</option>
                <option value="Lunch Break (1:15 PM - 1:45 PM)">Lunch Break (1:15 PM)</option>
                <option value="Afternoon Tea (3:45 PM - 4:15 PM)">Afternoon Tea (3:45 PM)</option>
                <option value="Evening Library Break (5:30 PM)">Evening Snack (5:30 PM)</option>
              </select>
            </div>
          </div>

          {/* Special Kitchen Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra mint chutney, less spicy, no onions"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Order Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Summary ({cart.reduce((s, c) => s + c.quantity, 0)} Items)
            </h4>
            
            <div className="max-h-28 overflow-y-auto space-y-1 divide-y divide-slate-200/60 dark:divide-slate-700/60 text-xs">
              {cart.map((c) => (
                <div key={c.item.id} className="pt-1 first:pt-0 flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{c.quantity}x {c.item.name}</span>
                  <span className="font-semibold tabular-nums">₹{c.item.price * c.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Payable at Counter / Online:</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 font-display tabular-nums">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pay on pickup or scan college UPI QR at Counter #2. Order token is generated immediately.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-md shadow-amber-600/25 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Token...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (₹{grandTotal})</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
