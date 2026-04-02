import React, { useState, useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500/20 border-green-500/40 text-green-200',
    error:   'bg-red-500/20 border-red-500/40 text-red-200',
    info:    'bg-blue-500/20 border-blue-500/40 text-blue-200',
  };

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl ${styles[type]} ${exiting ? 'toast-exit' : 'toast'}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => { setExiting(true); setTimeout(onClose, 300); }}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs"
      >✕</button>
    </div>
  );
}

export default Toast;
