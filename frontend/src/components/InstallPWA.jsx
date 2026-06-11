import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white rounded-2xl shadow-2xl z-[100] border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2D5A40] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install Thaaragai App
            </h3>
            <button 
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-[#eaf2eb]/50">
            <p className="text-sm text-[#1a3a28] mb-4">
              Install our app to get quick access, faster loading times, and stay updated with notifications about new products and offers!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleInstallClick}
                className="flex-1 bg-[#1a3a28] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#2D5A40] transition-colors shadow-md"
              >
                Install Now
              </button>
              <button 
                onClick={handleDismiss}
                className="flex-1 bg-white text-[#1a3a28] py-2.5 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
