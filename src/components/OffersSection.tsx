import React, { useState } from 'react';
import { AVAILABLE_COUPONS } from '../data/menuData';
import { Coupon } from '../types/food';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';

interface OffersSectionProps {
  onApplyCoupon: (coupon: Coupon) => void;
  appliedCouponCode?: string | null;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onApplyCoupon, appliedCouponCode }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyAndApply = (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopiedCode(coupon.code);
    onApplyCoupon(coupon);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-8 border-b border-slate-200/60 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Pocket Savers</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Student Deals & Meal Coupons
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any code to apply automatically at checkout
          </p>
        </div>

        {/* Coupon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_COUPONS.map((coupon) => {
            const isApplied = appliedCouponCode === coupon.code;
            const isCopied = copiedCode === coupon.code;

            return (
              <div
                key={coupon.code}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm ${
                  isApplied
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold tracking-wider border border-amber-200/60 dark:border-amber-800/60">
                      <Tag className="w-3 h-3" />
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {coupon.discountPercent}% OFF
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Min order: <strong className="text-slate-700 dark:text-slate-200 tabular-nums">₹{coupon.minOrder}</strong>
                  </span>

                  <button
                    onClick={() => handleCopyAndApply(coupon)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isApplied
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Applied</span>
                      </>
                    ) : isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
