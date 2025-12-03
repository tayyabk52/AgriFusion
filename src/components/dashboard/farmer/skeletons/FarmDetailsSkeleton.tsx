import { Skeleton } from '@/components/ui/Skeleton';

export function FarmDetailsSkeleton() {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Farm Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Farm Name Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div>
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <div>
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Land Size Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-20 mb-1" />
                    <Skeleton className="h-4 w-12" />
                </div>

                {/* Location Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-48" />
                </div>

                {/* Current Crops Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-full rounded-lg" />
                        <Skeleton className="h-9 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
