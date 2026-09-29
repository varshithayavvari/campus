import React from 'react';
import { UtensilsCrossed, Heart, Coffee } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenOrders: () => void;
  onOpenFavorites: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenOrders, onOpenFavorites }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-12 pb-20 md:pb-12 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Campus<span className="text-amber-600 dark:text-amber-400">Bites</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official digital food ordering solution for campus cafeterias and student food halls. Built with clean code & student love.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Canteen Menu
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-600 transition-colors">
                  Breakfast Specials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-600 transition-colors">
                  Lunch & Rice Bowls
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-600 transition-colors">
                  Evening Snacks & Fries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-amber-600 transition-colors">
                  Chai, Coffee & Shakes
                </button>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Student Orders
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenOrders} className="hover:text-amber-600 transition-colors">
                  Track Active Order
                </button>
              </li>
              <li>
                <button onClick={onOpenFavorites} className="hover:text-amber-600 transition-colors">
                  Saved Favorite Meals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('specials')} className="hover:text-amber-600 transition-colors">
                  Today's Chef Specials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-600 transition-colors">
                  Operating Hours & Counter Map
                </button>
              </li>
            </ul>
          </div>

          {/* College Timings info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Food Safety & Hours
            </h4>
            <p className="text-xs text-slate-500">
              Open Daily: 8:00 AM – 8:30 PM <br />
              Hygiene Certification: FSSAI No. 10020042000812 <br />
              North Academic Block, Counter 2
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CampusBites. Developed for Student Canteens.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> and freshly brewed <Coffee className="w-3 h-3 text-amber-600" />
          </p>
        </div>
      </div>
    </footer>
  );
};
