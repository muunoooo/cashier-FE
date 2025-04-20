"use client";

import { motion } from "framer-motion";
import { Coffee, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-5xl"
        >
          🐻
        </motion.div>
        <p className="text-lg font-semibold text-gray-800 mt-4 mb-1">
          Mister Cashier is brewing your coffee...
        </p>
        <Coffee className="w-6 h-6 text-[#A76545] animate-bounce mt-1" />
        <Loader2 className="w-5 h-5 text-gray-500 mt-4 animate-spin" />
      </motion.div>
    </div>
  );
}
