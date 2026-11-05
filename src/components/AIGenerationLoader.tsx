import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlaneDeparture, FaCheckCircle } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";

interface AIGenerationLoaderProps {
  country: string;
  duration: number;
  travelStyle: string;
}

const AIGenerationLoader: React.FC<AIGenerationLoaderProps> = ({
  country,
  duration,
  travelStyle,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    `Analyzing top attractions & culture in ${country || "your destination"}...`,
    `Curating ${travelStyle || "custom"} activities & sightseeing spots...`,
    `Optimizing travel routes and daily schedules...`,
    `Finalizing your ${duration || 5}-day personalized itinerary...`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, [steps.length]);

  const progressPercent = Math.min(Math.round(((currentStep + 1) / steps.length) * 100), 95);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Animated Background Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl" />

        {/* Floating Plane Icon */}
        <div className="size-20 rounded-2xl bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-6 relative">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <FaPlaneDeparture size={32} />
          </motion.div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Generating Your Adventure
        </h3>
        <p className="text-xs text-gray-500 mb-6 max-w-xs">
          Our AI is handcrafting an exclusive itinerary tailored to your preferences.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-6">
          <motion.div
            className="bg-linear-to-r from-cyan-400 to-blue-600 h-full rounded-full"
            initial={{ width: "10%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Steps List */}
        <div className="w-full space-y-3 mb-6 text-left">
          {steps.map((text, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                  isCurrent
                    ? "bg-blue-50/80 border border-blue-100 text-blue-900 font-medium"
                    : isDone
                    ? "text-gray-400"
                    : "text-gray-300 opacity-60"
                }`}
              >
                {isDone ? (
                  <FaCheckCircle className="text-emerald-500 shrink-0" size={16} />
                ) : isCurrent ? (
                  <TbLoader3 className="text-blue-500 animate-spin shrink-0" size={18} />
                ) : (
                  <div className="size-4 rounded-full border-2 border-gray-200 shrink-0" />
                )}
                <span className="text-xs">{text}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-gray-400 italic">
          "The world is a book and those who do not travel read only one page."
        </p>
      </motion.div>
    </div>
  );
};

export default AIGenerationLoader;
