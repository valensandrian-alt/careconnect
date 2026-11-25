/**
 * @file src/components/ui/Skeleton.tsx
 * Shimmering skeleton loader for loading states
 */

import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse bg-slate-200/80 rounded-lg', className)}
      {...props}
    />
  );
};

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start animate-pulse">
      <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
      <div className="flex-1 w-full space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-48" />
        <div className="pt-2 flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
