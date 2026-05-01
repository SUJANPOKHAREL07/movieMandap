import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AdminAlertProps {
    type?: AlertType;
    title?: string;
    message: string;
    onClose?: () => void;
    className?: string;
}

const AdminAlert: React.FC<AdminAlertProps> = ({
    type = 'info',
    title,
    message,
    onClose,
    className = ''
}) => {
    const getVariantStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500/10 border-green-500/20',
                    text: 'text-green-400',
                    icon: <CheckCircle className="shrink-0" size={20} />,
                    titleText: 'text-green-300'
                };
            case 'error':
                return {
                    bg: 'bg-red-500/10 border-red-500/20',
                    text: 'text-red-400',
                    icon: <XCircle className="shrink-0" size={20} />,
                    titleText: 'text-red-300'
                };
            case 'warning':
                return {
                    bg: 'bg-orange-500/10 border-orange-500/20',
                    text: 'text-orange-400',
                    icon: <AlertCircle className="shrink-0" size={20} />,
                    titleText: 'text-orange-300'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-500/10 border-blue-500/20',
                    text: 'text-blue-400',
                    icon: <Info className="shrink-0" size={20} />,
                    titleText: 'text-blue-300'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border ${styles.bg} ${styles.text} animate-in fade-in slide-in-from-top-4 duration-300 ${className}`}>
            <div className="mt-0.5">
                {styles.icon}
            </div>
            <div className="flex-1 min-w-0">
                {title && (
                    <h3 className={`text-sm font-bold mb-1 ${styles.titleText}`}>
                        {title}
                    </h3>
                )}
                <div className="text-sm leading-relaxed opacity-90">
                    {message}
                </div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 -mr-1 -mt-1"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default AdminAlert;
