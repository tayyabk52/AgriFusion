'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Soil Analysis', href: '#' },
            { name: 'Crop Planning', href: '#' },
            { name: 'Waste Management', href: '#' },
            { name: 'Expert Network', href: '#' },
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Contact', href: '#' },
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
        ],
    };

    return (
        <footer className="relative bg-slate-950 text-slate-300 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/3 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20"
                            >
                                <Leaf className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                AgriFusion
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                            Empowering farmers with data-driven insights and sustainable practices for a better tomorrow.
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>contact@agrifusion.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Product
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-emerald-400 transition-colors text-sm inline-block hover:translate-x-1 duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-emerald-400 transition-colors text-sm inline-block hover:translate-x-1 duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">
                            © {currentYear} AgriFusion. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="#"
                                className="text-slate-500 hover:text-emerald-400 transition-colors text-sm"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-500 hover:text-emerald-400 transition-colors text-sm"
                            >
                                Terms
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-500 hover:text-emerald-400 transition-colors text-sm"
                            >
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
