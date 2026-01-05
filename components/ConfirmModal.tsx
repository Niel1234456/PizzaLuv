import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 border border-slate-100"
        >
            <div className="flex items-center gap-3 mb-3 text-orange-600">
                <div className="bg-orange-100 p-2.5 rounded-full">
                    <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h3>
            </div>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
                {message}
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:from-red-600 hover:to-orange-600 transition-all text-sm shadow-lg shadow-orange-500/20"
                >
                    Yes, Start Over
                </button>
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};