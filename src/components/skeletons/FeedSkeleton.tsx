import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface FeedSkeletonProps {
  cardCount?: number;
}

export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ cardCount = 8 }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Campaign Banners Slider Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={`banner-skel-${i}`}
            className={`rounded-2xl p-4 border border-slate-200/80 bg-white shadow-2xs flex items-center justify-between overflow-hidden relative ${
              i === 3 ? 'hidden md:flex' : ''
            }`}
          >
            <div className="space-y-2 flex-1 pr-4">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
              <Skeleton className="h-3 w-3/4 rounded-md" />
            </div>
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
          </div>
        ))}
      </div>

      {/* Category Horizontal Scroll Bar Skeletons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={`cat-skel-${i}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0"
            >
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-3.5 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar Skeletons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Brand Chips Skeletons */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full sm:max-w-2xl no-scrollbar">
          <Skeleton className="h-3.5 w-12 rounded-md" />
          {[1, 2, 3, 4, 5, 6, 7].map((b) => (
            <Skeleton key={`brand-skel-${b}`} className="h-6 w-14 rounded-full" />
          ))}
        </div>

        {/* Sort & Filter Skeletons */}
        <div className="flex items-center gap-2 ml-auto">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>

      {/* Product Results Grid Header Skeletons */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>

      {/* Product Grid Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProductCardSkeleton key={`product-card-skel-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default FeedSkeleton;
