import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Navigation Top Bar Skeleton */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-4 w-32 rounded-md hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Main Detail Grid (Gallery + Buy Box) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Image Gallery Skeletons (7 cols on desktop) */}
        <div className="md:col-span-7 space-y-3">
          {/* Main Large Image */}
          <div className="relative aspect-4/5 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs">
            <Skeleton className="w-full h-full rounded-none" />
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="absolute top-4 right-4">
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map((t) => (
              <Skeleton key={`thumb-skel-${t}`} className="w-16 h-20 rounded-xl shrink-0" />
            ))}
          </div>

          {/* Trust Guarantee Box */}
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-4 flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions (5 cols on desktop) */}
        <div className="md:col-span-5 space-y-5">
          {/* Seller Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" variant="circular" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>

          {/* Title & Brand Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-4/5 rounded-lg" />
            </div>

            {/* Price Box */}
            <div className="pt-2 border-t border-slate-100 flex items-baseline gap-3">
              <Skeleton className="h-8 w-32 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Action Buttons Skeletons */}
            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-11 w-full rounded-2xl" />
                <Skeleton className="h-11 w-full rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Specs / Attributes Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <Skeleton className="h-4 w-32 rounded-md mb-2" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((attr) => (
                <div key={`attr-skel-${attr}`} className="space-y-1 p-2 bg-slate-50 rounded-xl">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-11/12 rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Row Skeletons */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((p) => (
            <ProductCardSkeleton key={`sim-skel-${p}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
