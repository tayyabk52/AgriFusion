import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: React.ElementType;
    description: string;
}) => {
    return (
        <div
            key={name}
            className={cn(
                "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-[2rem]",
                "bg-gradient-to-br from-white via-white to-slate-50/30",
                "border-2 border-slate-100/80",
                "shadow-[0_2px_10px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.02)]",
                "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_0_0_1px_rgba(16,185,129,0.1)]",
                "hover:border-emerald-100/80",
                "transition-all duration-500 ease-out hover:-translate-y-2",
                "before:absolute before:inset-0 before:rounded-[2rem] before:p-[2px]",
                "before:bg-gradient-to-br before:from-slate-200/50 before:via-transparent before:to-emerald-200/30",
                "before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                className
            )}
        >
            <div className="relative z-0 overflow-hidden">{background}</div>

            <div className="relative z-10 flex flex-col gap-3 p-8 bg-white/90 backdrop-blur-sm border-t border-slate-100/60">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200/60 flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <Icon className="h-6 w-6 text-slate-600 transition-colors duration-300 group-hover:text-emerald-600" strokeWidth={1.5} />
                </div>

                <div>
                    <h3 className="text-xl font-bold leading-tight mb-2 transition-all duration-300">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-teal-700">
                            {name}
                        </span>
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
                </div>
            </div>

            {/* Premium Hover Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-transparent rounded-[2rem]" />

            {/* Subtle Inner Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/40 group-hover:ring-white/60 transition-all duration-500" />
        </div>
    );
};

export { BentoGrid, BentoCard };
