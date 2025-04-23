"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
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
          Oops! Page Not Found
        </p>
        <p className="text-gray-600 mt-1 mb-4">
          It seems we&apos;ve lost this page...
        </p>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-3xl flex items-center justify-center gap-2"
        >
          🐾
          <Coffee className="w-6 h-6 text-[#A76545] animate-bounce mt-1" />
        </motion.div>
        <Link href="/dashboard">
          <Button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back To Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
