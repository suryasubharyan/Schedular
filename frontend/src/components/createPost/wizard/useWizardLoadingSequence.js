import { useEffect, useState } from "react";

const LOADING_STEPS = [
  "Reading your content",
  "Matching each platform's style",
  "Building your previews",
];
const LOADING_STEP_DURATION = 1500;
const LOADING_DELAY = LOADING_STEPS.length * LOADING_STEP_DURATION;

// Drives the staged-progress animation shown during the "loading" phase —
// advances through LOADING_STEPS on a timer, then hands control back to the
// wizard by flipping the phase to "preview".
export const useWizardLoadingSequence = (phase, setPhase) => {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return undefined;

    const stepTimers = LOADING_STEPS.slice(1).map((_, index) =>
      setTimeout(() => setLoadingStep(index + 1), (index + 1) * LOADING_STEP_DURATION)
    );
    const doneTimer = setTimeout(() => setPhase("preview"), LOADING_DELAY);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setPhase is a stable state setter
  }, [phase]);

  return {
    steps: LOADING_STEPS,
    loadingStep,
    resetLoadingStep: () => setLoadingStep(0),
  };
};

export default useWizardLoadingSequence;
