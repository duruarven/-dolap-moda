import React from 'react';
import { Skeleton } from './Skeleton';

export const OrdersSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-2xl" />
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Stats Cards Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((stat) => (
          <div key={`order-stat-${stat}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Orders List Skeletons */}
      <div className="space-y-4">
        {[1, 2].map((card) => (
          <div
            key={`order-card-skel-${card}`}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs p-5 space-y-5"
          >
            {/* Top Bar: Order ID, Date & Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Product Item Preview Row */}
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-24 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                </div>
              </div>
            </div>

            {/* Cargo Progress Bar Skeleton */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              {/* Step dots & line */}
              <div className="relative py-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex items-center justify-between mt-3">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <Skeleton className="h-4 w-40 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28 rounded-xl" />
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSkeleton;
