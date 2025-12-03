'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200',
                                isDragging
                                    ? 'border-emerald-400 bg-emerald-50/50'
                                    : 'border-slate-200 bg-slate-50/30 hover:border-slate-300',
                                disabled && 'cursor-not-allowed opacity-50'
                            )}
                        >
                            <div className={cn(
                                "mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                isDragging ? "bg-emerald-100 text-emerald-600" : "bg-white text-slate-400 border border-slate-100"
                            )}>
                                <Upload size={20} />
                            </div>

                            <p className="mb-3 text-sm font-medium text-slate-700">
                                Drop image or browse
                            </p>

                            <label
                                htmlFor="file-upload"
                                className={cn(
                                    'cursor-pointer',
                                    disabled && 'pointer-events-none opacity-50'
                                )}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    rounded="xl"
                                    className="pointer-events-none text-xs"
                                    icon={<ImageIcon size={14} />}
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

                            <p className="mt-3 text-xs text-slate-400">
                                JPG, PNG • Max 10MB
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                    >
                        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">Selected Image</span>
                            {!isAnalyzing && (
                                <button
                                    onClick={handleClear}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200 mb-3">
                                <Image
                                    src={preview}
                                    alt="Soil preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <Button
                                fullWidth
                                variant="emerald"
                                size="sm"
                                rounded="xl"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !selectedFile}
                                isLoading={isAnalyzing}
                                loadingText="Analyzing..."
                                icon={!isAnalyzing && <Upload size={14} />}
                                className="text-xs"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                    >
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-2.5 text-xs text-red-600">
                            <AlertCircle size={14} className="flex-shrink-0" />
                            {error}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
