import React from 'react';
import { Skeleton } from './Skeleton';

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
        {/* Left Column: Conversations List Skeleton */}
        <div className="border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="h-4 w-8 rounded-full" />
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 p-2 space-y-1">
            {[1, 2, 3, 4, 5].map((c) => (
              <div key={`conv-skel-${c}`} className="p-3 flex items-center gap-3 rounded-2xl">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" variant="circular" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-24 rounded-md" />
                    <Skeleton className="h-3 w-12 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Box Skeleton */}
        <div className="md:col-span-2 flex flex-col bg-slate-50/50">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" variant="circular" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>

          {/* Product Banner Bar */}
          <div className="p-3 bg-white/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-12 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-36 rounded-md" />
                <Skeleton className="h-3.5 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-7 w-20 rounded-xl" />
          </div>

          {/* Message History Stream */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[340px]">
            {/* Seller Message (Left) */}
            <div className="flex items-start gap-2.5 max-w-sm">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" variant="circular" />
              <div className="space-y-1 bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200/80 shadow-2xs w-64">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
                <Skeleton className="h-2.5 w-12 rounded-md mt-1" />
              </div>
            </div>

            {/* Buyer Message (Right) */}
            <div className="flex items-end justify-end gap-2.5">
              <div className="space-y-1 bg-rose-500/10 p-3.5 rounded-2xl rounded-tr-xs border border-rose-200/80 shadow-2xs w-60">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-3/4 rounded-md" />
                <Skeleton className="h-2.5 w-12 rounded-md ml-auto mt-1" />
              </div>
            </div>

            {/* Offer Proposal Bubble (Right) */}
            <div className="flex items-end justify-end">
              <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm w-72 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>

            {/* Seller Message (Left) */}
            <div className="flex items-start gap-2.5 max-w-sm">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" variant="circular" />
              <div className="space-y-1 bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200/80 shadow-2xs w-56">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-2.5 w-10 rounded-md mt-1" />
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-2xl" />
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
