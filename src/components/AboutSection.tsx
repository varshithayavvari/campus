import React from 'react';
import { CANTEEN_INFO } from '../data/menuData';
import { ShieldCheck, Clock, Zap, HeartHandshake, MapPin, Coffee, Utensils, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Why CampusBites Bento Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Campus Dining Redefined
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              Why CampusBites?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Designed specifically for fast-paced college life. No more standing in 30-minute crowded canteen queues between lectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero-Wait Pre-Ordering
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Place your food order during the last 5 minutes of your lecture. Your tray will be ready and steaming hot when you reach Counter 2.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                FSSAI Certified Hygiene
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Highest food safety standards with regular oil quality testing, filtered drinking water, sanitized stainless steel cookware, and fresh ingredients daily.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Student-First Pricing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Wholesome meals starting at just ₹20 with semester discounts, combo meal coupons, and hostel late-night tea support.
              </p>
            </div>

          </div>
        </div>

        {/* Canteen Location & Timings Details Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-100 dark:to-slate-900 border border-amber-500/20 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Today's Counter Schedule</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
                {CANTEEN_INFO.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Serving over 2,500 students and faculty members daily. Our chefs prepare fresh batches every 45 minutes to ensure peak crunch and warmth.
              </p>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Timings: </strong>{CANTEEN_INFO.timings}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Location: </strong>{CANTEEN_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Active Counters: </strong>{CANTEEN_INFO.activeCounters}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Feedback */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Canteen Help Desk & Catering
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Need bulk snacks for a college hackathon, club event, or seminar? Reach the manager directly:
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1 font-mono">
                <div>Phone: <strong>{CANTEEN_INFO.helpline}</strong></div>
                <div>UPI ID: <strong>{CANTEEN_INFO.upiId}</strong></div>
              </div>
              <div className="text-[11px] text-slate-400">
                Student Canteen Committee Meeting: Every Friday 4:00 PM
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
