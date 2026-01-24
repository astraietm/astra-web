import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-[#050505]/95 shadow-[0_4px_20px_rgba(16,185,129,0.1)]',
    error: 'border-rose-500/20 bg-[#050505]/95 shadow-[0_4px_20px_rgba(244,63,94,0.1)]',
    warning: 'border-amber-500/20 bg-[#050505]/95 shadow-[0_4px_20px_rgba(245,158,11,0.1)]',
    info: 'border-sky-500/20 bg-[#050505]/95 shadow-[0_4px_20px_rgba(14,165,233,0.1)]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, filter: 'blur(10px)', scale: 0.9 }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative flex items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-3xl ${colors[toast.type]} min-w-[320px] max-w-md group`}
    >
      {/* Aesthetic Side Accent */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-[2px] rounded-full ${
        toast.type === 'success' ? 'bg-emerald-500' : 
        toast.type === 'error' ? 'bg-rose-500' : 
        toast.type === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
      } opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <div className="shrink-0">{icons[toast.type]}</div>
      
      <div className="flex-1 space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {toast.type === 'success' ? 'Confirmed' : toast.type === 'error' ? 'Alert' : 'System Message'}
          </p>
          <p className="text-sm text-gray-200 font-medium leading-tight">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="shrink-0 p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress Bar Bloom */}
      <motion.div 
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-4 right-4 h-[1px] ${
            toast.type === 'success' ? 'bg-emerald-500/30' : 
            toast.type === 'error' ? 'bg-rose-500/30' : 
            toast.type === 'warning' ? 'bg-amber-500/30' : 'bg-sky-500/30'
          }`}
      />
    </motion.div>
  );
};

export default ToastProvider;
