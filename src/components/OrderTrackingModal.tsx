import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/food';
import { X, CheckCircle2, Clock, ChefHat, Bell, Check, ArrowRight, Play, RefreshCw, Sparkles, MapPin } from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const STAGES: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    key: 'received',
    label: 'Order Received',
    desc: 'Sent to Canteen Kitchen & Token assigned',
    icon: CheckCircle2,
  },
  {
    key: 'preparing',
    label: 'Preparing in Kitchen',
    desc: 'Wok heating, ingredients assembling',
    icon: ChefHat,
  },
  {
    key: 'ready',
    label: 'Ready for Pickup',
    desc: 'Waiting at Counter #2 for your token call',
    icon: Bell,
  },
  {
    key: 'completed',
    label: 'Order Completed',
    desc: 'Picked up & Enjoyed!',
    icon: Check,
  },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onUpdateOrderStatus,
}) => {
  const [autoSimulate, setAutoSimulate] = useState(true);

  if (!order) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.status);

  // Auto progression simulator for student demo
  useEffect(() => {
    if (!autoSimulate || order.status === 'completed') return;

    const timer = setTimeout(() => {
      const nextIndex = currentStageIndex + 1;
      if (nextIndex < STAGES.length) {
        onUpdateOrderStatus(order.id, STAGES[nextIndex].key);
      }
    }, 7000); // Progress every 7 seconds in demo mode

    return () => clearTimeout(timer);
  }, [autoSimulate, currentStageIndex, order.id, order.status, onUpdateOrderStatus]);

  const handleStepForward = () => {
    const nextIndex = Math.min(STAGES.length - 1, currentStageIndex + 1);
    onUpdateOrderStatus(order.id, STAGES[nextIndex].key);
  };

  const handleResetStatus = () => {
    onUpdateOrderStatus(order.id, 'received');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Celebration Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-b border-slate-200/80 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Order Placed Successfully!
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                Order #{order.id}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Token: <strong className="text-slate-900 dark:text-white font-mono font-bold text-sm bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md text-amber-800 dark:text-amber-300 ml-1">{order.pickupToken}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Visual Progress Stepper */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Kitchen Status Tracker
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Auto Simulator:</span>
                <button
                  onClick={() => setAutoSimulate(!autoSimulate)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    autoSimulate
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {autoSimulate ? 'ON' : 'PAUSED'}
                </button>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {STAGES.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.key} className="relative flex items-start gap-3.5">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-md'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-amber-600 dark:text-amber-400'
                              : isPassed
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {stage.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Simulation Controls for Evaluation */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Simulate status advance:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepForward}
                  disabled={order.status === 'completed'}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={handleResetStatus}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  title="Reset status to received"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pickup Details Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                Pickup Counter:
              </span>
              <strong className="text-slate-900 dark:text-white">Counter #2 (Main Cafeteria)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Estimated Ready:
              </span>
              <strong className="text-slate-900 dark:text-white tabular-nums">{order.estimatedReadyTime}</strong>
            </div>
            {order.notes && (
              <div className="pt-1 border-t border-amber-200/50 dark:border-amber-800/50">
                <span className="text-slate-500 dark:text-slate-400">Kitchen Note: </span>
                <span className="text-slate-700 dark:text-slate-200 italic">"{order.notes}"</span>
              </div>
            )}
          </div>

          {/* Ordered Items Receipt */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Receipt Breakdown
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {order.items.map((it) => (
                <div key={it.item.id} className="py-2 flex justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">{it.quantity}x</span>
                    <span>{it.item.name}</span>
                  </div>
                  <span className="font-bold tabular-nums">₹{it.item.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({order.appliedCoupon})</span>
                  <span className="tabular-nums font-semibold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Packaging Fee</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">₹{order.packagingFee}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1">
                <span>Grand Total</span>
                <span className="text-base text-amber-600 dark:text-amber-400 font-display tabular-nums">
                  ₹{order.total}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close & Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
