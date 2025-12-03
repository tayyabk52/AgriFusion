import { Skeleton } from '@/components/ui/Skeleton';

export function ConsultantProfileSkeleton() {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Consultant Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Consultant Profile Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start gap-6 mb-6">
                        <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-7 w-48 mb-2" />
                            <div className="flex items-center gap-2 mb-3">
                                <Skeleton className="h-5 w-28 rounded-full" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="flex-1">
                                <Skeleton className="h-3 w-12 mb-1" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="flex-1">
                                <Skeleton className="h-3 w-12 mb-1" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Qualification Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-5 w-full" />
                </div>

                {/* Experience Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                </div>

                {/* Specialization Areas Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-9 w-32 rounded-lg" />
                        <Skeleton className="h-9 w-40 rounded-lg" />
                        <Skeleton className="h-9 w-28 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
