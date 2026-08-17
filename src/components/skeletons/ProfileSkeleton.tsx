import React from 'react';
import { Skeleton } from './Skeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Profile Header Card Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-slate-100" variant="circular" />
            <div className="absolute bottom-0 right-0">
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Skeleton className="h-6 w-40 rounded-lg" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-28 rounded-md mt-1.5 mx-auto md:mx-0" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-9 w-32 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1 max-w-lg mx-auto md:mx-0">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-3/4 rounded-md" />
            </div>

            {/* Location & Joined Date */}
            <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
        </div>

        {/* Stats Grid Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          {[1, 2, 3, 4].map((stat) => (
            <div key={`stat-skel-${stat}`} className="bg-slate-50 rounded-2xl p-3.5 space-y-1 text-center">
              <Skeleton className="h-6 w-16 mx-auto rounded-md" />
              <Skeleton className="h-3 w-20 mx-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Bar Skeletons */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-2xl" />
          <Skeleton className="h-10 w-32 rounded-2xl" />
          <Skeleton className="h-10 w-36 rounded-2xl" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl hidden sm:block" />
      </div>

      {/* Product Listings Grid Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <ProductCardSkeleton key={`prof-prod-${item}`} />
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
