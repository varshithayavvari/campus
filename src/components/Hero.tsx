import React from 'react';
import { HERO_IMAGE, CANTEEN_INFO } from '../data/menuData';
import { Sparkles, ArrowRight, Clock, ShieldCheck, MapPin, Flame, MessageSquare } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onViewSpecials: () => void;
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onViewSpecials, onOpenChat }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Subtle campus status announcement */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Canteen Open</span>
              <span className="text-amber-400/80">·</span>
              <span>Counter 2 & 4 Ready</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-display text-balance">
              Good Food. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 dark:from-amber-400 dark:to-orange-400">
                Great Campus.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed text-balance">
              Order your favorite campus meals quickly and enjoy more time with friends. Skip the canteen rush, track prep live, and pick up fresh piping hot food.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-xl shadow-md shadow-amber-600/25 transition-all duration-150 cursor-pointer"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewSpecials}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 active:scale-95 rounded-xl shadow-sm transition-all duration-150 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>View Today's Specials</span>
              </button>

              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-700/60 active:scale-95 rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
                  title="Ask Canteen AI Assistant"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Ask AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
              )}
            </div>

            {/* Trust Markers / Fast Stats */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-3 max-w-lg text-slate-600 dark:text-slate-400">
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums font-display">
                  ~12<span className="text-xs font-semibold text-slate-500 ml-0.5">min</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg Prep Time</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums font-display">
                  ₹20<span className="text-xs font-semibold text-slate-500 ml-0.5">start</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pocket Friendly</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-display">
                  4.9★
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hygiene Certified</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800/80 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-slate-100 dark:bg-slate-900">
              <img
                src={HERO_IMAGE}
                alt="Students enjoying fresh food at CampusBites canteen"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Live counter overlay pill */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Kitchen Live: Order Counter #2
                </span>
              </div>

              {/* Floating Chef Recommendation */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Chef's Top Pick</p>
                    <p className="text-sm font-bold text-white">Crispy Masala Dosa + Filter Coffee</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-400 tabular-nums">₹85</span>
              </div>
            </div>

            {/* Subtle glow effect behind hero */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />
          </div>

        </div>

        {/* Operational info bar */}
        <div className="mt-12 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Operating Hours: </span>
              <span>8:00 AM – 8:30 PM (Mon-Sat)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-900 dark:text-white">Pickup Location: </span>
              <span>North Academic Block, Ground Floor</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Hygiene Standards: </span>
              <span>100% Contactless Tokens & Sanitized Kitchen</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
