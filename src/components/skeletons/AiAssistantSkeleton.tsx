import React from 'react';
import { Skeleton } from './Skeleton';

export const AiAssistantSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-48 rounded-lg bg-white/20" />
            <Skeleton className="h-3.5 w-64 rounded-md bg-white/10" />
          </div>
        </div>
      </div>

      {/* Suggested Prompts Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((p) => (
          <div key={`prompt-skel-${p}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        ))}
      </div>

      {/* Chat messages history */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 min-h-[300px] space-y-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" variant="circular" />
          <div className="space-y-2 bg-purple-50 p-4 rounded-2xl w-3/4">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-5/6 rounded-md" />
            <Skeleton className="h-3.5 w-2/3 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantSkeleton;
