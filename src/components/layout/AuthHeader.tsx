'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface AuthHeaderProps {
    onBack?: () => void;
    backLabel?: string;
    hideBack?: boolean;
}

export const AuthHeader = ({ onBack, backLabel = 'Back', hideBack = false }: AuthHeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {!hideBack && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="text-slate-500 hover:text-slate-900 -ml-2"
                            icon={<ArrowLeft size={18} />}
                        >
                            {backLabel}
                        </Button>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                    </>
                )}

                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="AgriFusion Logo"
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                            priority
                        />
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight hidden sm:block">
                        Agri
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                            Fusion
                        </span>
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 hidden sm:block">Need help?</span>
                <Button variant="ghost" size="sm" className="text-slate-500" icon={<HelpCircle size={18} />}>
                    Support
                </Button>
            </div>
        </header>
    );
};
