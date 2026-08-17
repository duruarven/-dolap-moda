import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs flex flex-col">
      {/* Product Image Placeholder (aspect 4/5) */}
      <div className="relative aspect-4/5 w-full bg-slate-100 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Floating badge skeleton */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        
        {/* Favorite Heart button skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        {/* Free shipping badge skeleton */}
        <div className="absolute bottom-2 left-2">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>

      {/* Product Info Placeholder */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
        {/* Brand & Size */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-4 w-8 rounded-md" />
        </div>

        {/* Title (2 lines) */}
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-3/4 rounded-md" />
        </div>

        {/* Price Tag */}
        <div className="pt-1 flex items-baseline gap-2">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-3.5 w-12 rounded-md" />
        </div>

        {/* Seller Info Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-4 h-4 rounded-full" variant="circular" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-3 w-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
