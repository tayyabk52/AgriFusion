import { ReactNode } from "react";
import { motion } from "framer-motion";
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
    index = 0,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: React.ElementType;
    description: string;
    index?: number;
}) => {
    return (
        <motion.div
            key={name}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1] as any,
            }}
            whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
            }}
            className={cn(
                "group relative col-span-3 flex flex-col overflow-hidden rounded-[2rem]",
                "bg-white",
                "border-2 border-slate-200",
                "shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10",
                "hover:border-emerald-300",
                "cursor-pointer",
                className
            )}
        >
            {/* Background Image Section */}
            <div className="relative h-52 overflow-hidden bg-slate-900">
                <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                >
                    {background}
                </motion.div>

                {/* Dark gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40"
                    whileHover={{
                        background: "linear-gradient(to top, rgb(2, 6, 23), rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.4))"
                    }}
                    transition={{ duration: 0.5 }}
                />

                {/* Large background icon with rotation */}
                <motion.div
                    className="absolute top-8 right-8"
                    initial={{ opacity: 0.15, rotate: 0 }}
                    whileHover={{
                        opacity: 0.25,
                        rotate: 15,
                        scale: 1.1
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
                >
                    <Icon size={100} className="text-white" strokeWidth={1} />
                </motion.div>

                {/* Animated border glow */}
                <motion.div
                    className="absolute inset-0 rounded-[2rem] opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)",
                        backgroundSize: "200% 100%",
                    }}
                    animate={{
                        backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                />
            </div>

            {/* Content Section */}
            <div className="relative flex flex-col gap-4 p-8 bg-white">
                {/* Icon Badge - glassmorphism with bounce */}
                <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border-2 border-white/30 text-white shadow-xl -mt-14 bg-gradient-to-br from-emerald-500 to-teal-600"
                    whileHover={{
                        scale: 1.15,
                        rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6, ease: "easeInOut" }
                    }}
                >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                {/* Text Content with stagger */}
                <div className="space-y-2 overflow-hidden">
                    <motion.h3
                        className="text-2xl font-bold text-slate-900 leading-tight tracking-tight"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
                    >
                        {name}
                    </motion.h3>
                    <motion.p
                        className="text-slate-600 text-sm leading-relaxed font-medium"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {description}
                    </motion.p>
                </div>
            </div>

            {/* Enhanced Shine Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                />
            </motion.div>

            {/* Subtle particle effect on hover */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            />
        </motion.div>
    );
};

export { BentoGrid, BentoCard };
