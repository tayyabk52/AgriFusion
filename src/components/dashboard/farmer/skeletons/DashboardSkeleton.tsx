import { Skeleton } from '@/components/ui/Skeleton';

export function StatsCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </div>

            {/* Farm Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <Skeleton className="h-6 w-28 mb-4" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-14 h-14 rounded-2xl" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-14 h-14 rounded-2xl" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
