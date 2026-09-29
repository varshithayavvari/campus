import React from 'react';
import { Order } from '../types/food';
import { X, Clock, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

interface OrdersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrderToTrack: (order: Order) => void;
  onReorder: (order: Order) => void;
  onExploreMenu: () => void;
}

export const OrdersListModal: React.FC<OrdersListModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrderToTrack,
  onReorder,
  onExploreMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                My Orders & History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track live status or re-order your favorite campus meals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">No Previous Orders Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Your past canteen orders and live tokens will appear right here once you order.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreMenu();
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const totalItemCount = order.items.reduce((s, it) => s + it.quantity, 0);
                const isOngoing = order.status !== 'completed';

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                          #{order.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono">
                          Token: {order.pickupToken}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            order.status === 'completed'
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              : order.status === 'ready'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {order.status === 'ready' ? 'Ready for Pickup' : order.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                        {order.items.map((it) => `${it.quantity}x ${it.item.name}`).join(', ')}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                          Total: ₹{order.total}
                        </span>
                        <span>·</span>
                        <span>{totalItemCount} items</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectOrderToTrack(order);
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isOngoing
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isOngoing ? 'Track Live' : 'View Receipt'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onReorder(order);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
                        title="Add these items to your cart again"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
