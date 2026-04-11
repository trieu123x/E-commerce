
"use client";
import { motion, AnimatePresence } from "framer-motion";

export const eventBus = {
  listeners: [],
  dispatch(event) { this.listeners.forEach(listener => listener(event)); },
  subscribe(listener) { 
    this.listeners.push(listener); 
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }
};

export const toast = {
  success: (message) => eventBus.dispatch({ message, type: 'success' }),
  error: (message) => eventBus.dispatch({ message, type: 'error' }),
  info: (message) => eventBus.dispatch({ message, type: 'error' })
};

export default function Toast() {
  const React = require('react');
  const { useState, useEffect } = React;
  
  const [toastData, setToastData] = useState(null);

  useEffect(() => {
    let timer;
    const unsubscribe = eventBus.subscribe((data) => {
      setToastData(data);
      clearTimeout(timer);
      timer = setTimeout(() => setToastData(null), 3000);
    });
    return () => { unsubscribe(); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence>
      {toastData && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[9999] text-white ${
            toastData.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toastData.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
