import React, { useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  confirmationQuestion: string;
  confirmTitle?: string;
  confirmMsg?: string;
  cancelTitle?: string;
  cancelMsg?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "CONFIRMAÇÃO DE EXCLUSÃO",
  confirmationQuestion,
  confirmTitle = "Item Excluído!",
  confirmMsg = "O registro foi excluído com sucesso do sistema.",
  cancelTitle = "Cancelado",
  cancelMsg = "A exclusão foi cancelada.",
  confirmText = "CONFIRMAR EXCLUSÃO",
  cancelText = "CANCELAR",
  danger = true,
}) => {
  const [step, setStep] = useState<'prompt' | 'confirmed' | 'cancelled'>('prompt');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      setStep('confirmed');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStep('cancelled');
  };

  const handleClose = () => {
    setStep('prompt');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans animate-in fade-in duration-300">
      <div className="bg-white dark:bg-elite-gray border border-gray-200 dark:border-white/10 p-8 shadow-2xl max-w-lg w-full relative text-center space-y-6 rounded-none animate-in zoom-in-95 duration-200">
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {step === 'prompt' && (
          <div className="space-y-6 py-2">
            {/* Ícone de Destaque Estilo Warning (!) */}
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-400/40 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 font-serif italic text-4xl font-bold shadow-inner">
              !
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black text-gray-400 dark:text-white/30 tracking-[0.4em] uppercase">
                {title}
              </span>
              <h3 className="serif text-2xl sm:text-3xl italic font-normal text-black dark:text-white leading-snug">
                {confirmationQuestion}
              </h3>
            </div>

            <p className="text-[10px] font-bold text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase leading-relaxed max-w-xs mx-auto">
              Esta ação não poderá ser desfeita após a confirmação.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-4 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`px-8 py-4 text-white text-[10px] font-black tracking-[0.3em] uppercase transition-all shadow-lg disabled:opacity-50 ${
                  danger 
                    ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600' 
                    : 'bg-black hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                }`}
              >
                {isSubmitting ? 'EXCLUINDO...' : confirmText}
              </button>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="space-y-6 py-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="serif text-3xl italic font-bold text-black dark:text-white">
                {confirmTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 font-light">
                {confirmMsg}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black tracking-[0.4em] uppercase hover:opacity-80 transition-all shadow-md"
            >
              OK
            </button>
          </div>
        )}

        {step === 'cancelled' && (
          <div className="space-y-6 py-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-rose-500/40 bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
              <XCircle size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="serif text-3xl italic font-bold text-black dark:text-white">
                {cancelTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/60 font-light">
                {cancelMsg}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-4 bg-gray-100 text-black dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 text-[10px] font-black tracking-[0.4em] uppercase hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              OK
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
