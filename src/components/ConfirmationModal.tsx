import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    success: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100',
    info: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
  };

  const iconClasses = {
    danger: 'text-red-500 bg-red-50',
    success: 'text-emerald-500 bg-emerald-50',
    info: 'text-indigo-500 bg-indigo-50'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${iconClasses[variant]}`}>
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={onCancel}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
              <p className="text-slate-500 leading-relaxed">{message}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                }}
                className={`flex-1 px-4 py-3 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${variantClasses[variant]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
