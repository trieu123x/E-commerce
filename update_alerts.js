const fs = require('fs');
const path = require('path');

const toastCode = `
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
          className={\`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-[9999] text-white \${
            toastData.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }\`}
        >
          {toastData.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;

fs.writeFileSync('src/app/component/Toast.js', toastCode);

let layout = fs.readFileSync('src/app/layout.js', 'utf8');
if (!layout.includes('Toast />') && !layout.includes('<Toast/>')) {
  layout = layout.replace('import "./globals.css";', 'import "./globals.css";\nimport Toast from "@/app/component/Toast";');
  layout = layout.replace('{children}', '{children}\n        <Toast />');
  fs.writeFileSync('src/app/layout.js', layout);
}

const targetFiles = [
  "src/app/order/vnpay/page.js",
  "src/app/order/visa/page.js",
  "src/app/order/stripe/page.js",
  "src/app/order/momo/page.js",
  "src/app/order/cod/page.js",
  "src/app/admin/sale/page.js",
  "src/app/account/profile/page.js",
  "src/app/admin/products/page.js",
  "src/app/admin/categories/page.js"
];

for (const file of targetFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('Toast')) {
       if (content.includes('"use client";')) {
         content = content.replace('"use client";', '"use client";\nimport { toast } from "@/app/component/Toast";');
       } else {
         content = 'import { toast } from "@/app/component/Toast";\n' + content;
       }
    }
    content = content.replace(/alert\("Sale updated"\)/g, 'toast.success("Sale updated")');
    content = content.replace(/alert\(res\.data\.message \|\| "Xóa danh mục thành công"\)/g, 'toast.success(res.data.message || "Xóa danh mục thành công")');
    content = content.replace(/alert\(/g, 'toast.error(');
    
    fs.writeFileSync(file, content);
  }
}

console.log("Done");
