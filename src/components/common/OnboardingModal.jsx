import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../store/AppContext";

export default function OnboardingModal() {
  const { t, onboardingSeen, completeOnboarding, isDark, language } = useApp();
  const [step, setStep] = useState(0);

  const steps = t("onboarding.steps") || [];
  const totalSteps = Array.isArray(steps) ? steps.length : 5;

  if (onboardingSeen) return null;

  const currentStep = Array.isArray(steps) ? steps[step] : null;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl ${
            isDark ? "bg-slate-900 border border-white/10" : "bg-white"
          }`}
        >
          {/* Gradient top */}
          <div className="h-2 bg-gradient-to-r from-violet-600 to-pink-500" />

          <div className="p-8">
            {/* Progress dots */}
            <div className="flex gap-1.5 justify-center mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-6 bg-gradient-to-r from-violet-500 to-pink-500"
                      : i < step
                        ? "w-3 bg-violet-500/50"
                        : "w-3 bg-slate-700"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-8"
              >
                {currentStep && (
                  <>
                    <div className="text-5xl mb-4">{currentStep.emoji}</div>
                    <h2
                      className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {currentStep.title}
                    </h2>
                    <p
                      className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {currentStep.desc}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={completeOnboarding}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t("onboarding.skip")}
              </button>
              <button
                onClick={handleNext}
                className="flex-[2] py-3 rounded-full text-sm font-bold btn-primary"
              >
                {step < totalSteps - 1
                  ? t("onboarding.next")
                  : t("onboarding.finish")}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
