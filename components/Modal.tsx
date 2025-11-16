
import React, { Fragment } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 m-4 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 transition-colors duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {children}
                </div>
            </div>
            {/* Fix: Removed the non-standard `jsx` prop from the <style> tag. This is a Next.js feature and causes a TypeScript error in a standard React setup. */}
            <style>{`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
              }
            `}</style>
        </div>
    );
};

export default Modal;
