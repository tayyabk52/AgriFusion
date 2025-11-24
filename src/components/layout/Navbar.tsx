'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Leaf, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/Button';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
];

// Animation Variants
const navbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const mobileMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1] as const,
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2 },
    },
};

const mobileItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
};

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* ================= UNIFIED NAVBAR ================= */}
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] font-sans',
                    isScrolled ? 'pt-4' : 'pt-6'
                )}
            >
                <motion.div
                    variants={navbarVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        'flex items-center justify-between relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        'premium-glass-bar',
                        isScrolled
                            ? 'w-[92%] md:w-[88%] max-w-6xl py-2.5 px-4 pl-5 rounded-full premium-glass-bar-scrolled shadow-lg shadow-slate-200/60'
                            : 'w-[95%] md:w-[93%] max-w-7xl py-3.5 px-5 pl-7 rounded-[2rem] shadow-xl shadow-slate-200/50'
                    )}
                >
                    {/* 1. LEFT: BRAND IDENTITY */}
                    <motion.div variants={itemVariants} className="z-10">
                        <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="AgriFusion Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </motion.div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                                    Agri
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                                        Fusion
                                    </span>
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* 2. CENTER: NAVIGATION LINKS */}
                    <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {navItems.map((item) => (
                            <motion.div key={item.name} variants={itemVariants}>
                                <Link
                                    href={item.href}
                                    onMouseEnter={() => setHoveredTab(item.name)}
                                    onMouseLeave={() => setHoveredTab(null)}
                                    className={cn(
                                        'relative px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300',
                                        pathname === item.href
                                            ? 'text-emerald-700'
                                            : 'text-slate-600 hover:text-slate-900'
                                    )}
                                >
                                    {/* Active page indicator */}
                                    {pathname === item.href && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full -z-10 border border-emerald-200/60 shadow-md shadow-emerald-200/30"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    {/* Hover indicator */}
                                    {hoveredTab === item.name && pathname !== item.href && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-slate-100/80 shadow-md shadow-slate-200/40 rounded-full -z-10 border border-slate-200/80"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}

                        <motion.div variants={itemVariants} className="w-px h-5 bg-slate-300/50 mx-3" />

                        <motion.div variants={itemVariants}>
                            <Link href="/login">
                                <Button variant="glass" rounded="full" size="sm" className="px-5 font-semibold">
                                    Sign In
                                </Button>
                            </Link>
                        </motion.div>
                    </nav>

                    {/* 3. RIGHT: PRIMARY ACTION & Mobile Toggle */}
                    <div className="flex items-center gap-2.5 z-10">
                        <motion.div variants={itemVariants} className="hidden md:flex">
                            <Link href="/signup">
                                <Button
                                    variant="premium"
                                    rounded="full"
                                    size="sm"
                                    className="pl-6 pr-4 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
                                    icon={
                                        <div className="bg-gradient-to-br from-white/30 to-white/10 rounded-full p-0.5 backdrop-blur-sm shadow-sm group-hover:from-white/40 group-hover:to-white/20 transition-all">
                                            <ArrowRight size={14} strokeWidth={2.5} />
                                        </div>
                                    }
                                    iconPosition="right"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm hover:shadow-md border border-slate-200/50"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </motion.div>
            </header>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-24 left-4 right-4 z-[90] p-5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-900/10 md:hidden"
                    >
                        <div className="flex flex-col gap-1.5">
                            {navItems.map((item) => (
                                <motion.div key={item.name} variants={mobileItemVariants}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-5 py-4 rounded-2xl transition-all group",
                                            pathname === item.href
                                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/60 shadow-md shadow-emerald-200/40"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="font-bold text-base">{item.name}</span>
                                        <ArrowRight
                                            size={18}
                                            className={cn(
                                                "transition-all duration-300",
                                                pathname === item.href
                                                    ? "opacity-100 translate-x-0 text-emerald-600"
                                                    : "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-slate-400"
                                            )}
                                            strokeWidth={2.5}
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div variants={mobileItemVariants} className="h-px bg-slate-100 my-2" />
                        <div className="grid grid-cols-2 gap-3">
                            <motion.div variants={mobileItemVariants}>
                                <Link href="/login" className="flex justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="secondary" rounded="xl" fullWidth className="py-3 border border-slate-100 font-semibold">
                                        Sign In
                                    </Button>
                                </Link>
                            </motion.div>
                            <motion.div variants={mobileItemVariants}>
                                <Link href="/signup" className="flex justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="emerald" rounded="xl" fullWidth className="py-3 shadow-lg shadow-emerald-200 font-semibold">
                                        Sign Up
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
