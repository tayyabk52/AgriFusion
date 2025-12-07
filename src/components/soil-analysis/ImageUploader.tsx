'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    isAnalyzing: boolean;
    disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImageSelect,
    isAnalyzing,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            setError('Please upload a JPG or PNG image');
            return false;
        }

        if (file.size > maxSize) {
            setError('Image size should be less than 10MB');
            return false;
        }

        setError(null);
        return true;
    };

    const handleFile = useCallback(
        (file: File) => {
            if (!validateFile(file)) return;

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            if (disabled || isAnalyzing) return;

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        },
        [disabled, isAnalyzing, handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleClear = useCallback(() => {
        setPreview(null);
        setSelectedFile(null);
        setError(null);
    }, []);

    const handleAnalyze = useCallback(() => {
        if (selectedFile) {
            onImageSelect(selectedFile);
        }
    }, [selectedFile, onImageSelect]);

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 cursor-pointer group',
                                isDragging
                                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 scale-[1.02]'
                                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/50',
                                disabled && 'cursor-not-allowed opacity-50'
                            )}
                        >
                            {/* Decorative gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent rounded-2xl pointer-events-none" />

                            <motion.div
                                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={cn(
                                    "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm relative z-10",
                                    isDragging
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200"
                                        : "bg-white text-slate-400 border-2 border-slate-100 group-hover:border-emerald-200 group-hover:text-emerald-500"
                                )}
                            >
                                <Upload size={28} strokeWidth={2} />
                            </motion.div>

                            <div className="relative z-10 text-center space-y-3">
                                <div>
                                    <p className="text-base font-semibold text-slate-800 mb-1">
                                        {isDragging ? 'Drop image here' : 'Drop image or browse'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        High-quality images provide better results
                                    </p>
                                </div>

                                <label
                                    htmlFor="file-upload"
                                    className={cn(
                                        'inline-block',
                                        disabled && 'pointer-events-none opacity-50'
                                    )}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        rounded="xl"
                                        className="pointer-events-none text-sm font-medium shadow-sm hover:shadow"
                                        icon={<ImageIcon size={16} />}
                                    >
                                        Choose File
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleFileInput}
                                        disabled={disabled || isAnalyzing}
                                    />
                                </label>

                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        JPG, PNG
                                    </div>
                                    <div className="w-px h-3 bg-slate-200" />
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Max 10MB
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white shadow-lg shadow-slate-100/50"
                    >
                        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <ImageIcon size={16} className="text-emerald-600" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800">Selected Image</span>
                            </div>
                            {!isAnalyzing && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClear}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </motion.button>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border-2 border-slate-200 mb-4 group">
                                <Image
                                    src={preview}
                                    alt="Soil preview"
                                    fill
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <Button
                                fullWidth
                                variant="emerald"
                                size="md"
                                rounded="xl"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !selectedFile}
                                isLoading={isAnalyzing}
                                loadingText="Analyzing..."
                                icon={!isAnalyzing && <Sparkles size={16} />}
                                className="text-sm font-semibold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all"
                            >
                                Analyze Soil
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-start gap-3 rounded-xl bg-red-50 border-2 border-red-100 p-3.5 text-sm text-red-700">
                            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" strokeWidth={2.5} />
                            <span className="font-medium">{error}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
