import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]',
                className
            )}
            style={{
                animation: 'shimmer 1.5s ease-in-out infinite',
            }}
        />
    );
}
