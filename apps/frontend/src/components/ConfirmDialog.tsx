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
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: <Trash2 className="text-red-500" size={24} />,
                    button: 'bg-red-500 hover:bg-red-600 text-white',
                    bg: 'bg-red-500/10 border-red-500/20'
                };
            case 'warning':
                return {
                    icon: <AlertCircle className="text-orange-500" size={24} />,
                    button: 'bg-orange-500 hover:bg-orange-600 text-black',
                    bg: 'bg-orange-500/10 border-orange-500/20'
                };
            default:
                return {
                    icon: <AlertCircle className="text-primary" size={24} />,
                    button: 'bg-primary hover:bg-orange-600 text-black',
                    bg: 'bg-primary/10 border-primary/20'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${styles.bg}`}>
                            {styles.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-secondary/30 p-4 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3">
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-all border border-border"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
