'use client';

import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    showCancel?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    showCancel = true
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <Trash2 className="text-red-400" size={24} />,
                    button: 'bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
                    bg: 'bg-red-500/10 border-red-500/20 border'
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="text-yellow-400" size={24} />,
                    button: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-50 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
                    bg: 'bg-yellow-500/10 border-yellow-500/20 border'
                };
            case 'primary':
            default:
                return {
                    icon: <AlertCircle className="text-yellow-400" size={24} />,
                    button: 'bg-primary hover:bg-yellow-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]',
                    bg: 'bg-yellow-500/10 border-yellow-500/20 border'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800/80 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className={`p-4 rounded-3xl ${styles.bg}`}>
                            {styles.icon}
                        </div>
                        <div className="w-full relative">
                            <button
                                onClick={onClose}
                                className="absolute -top-16 right-0 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 hover:bg-zinc-800 p-2 rounded-xl border border-zinc-800/50"
                            >
                                <X size={18} />
                            </button>
                            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm max-w-sm mx-auto">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 p-6 border-t border-zinc-800/50 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-700"
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
