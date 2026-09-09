import Button from "../../ui/Button";
import { WIZARD_WIDTH } from "./constants";

export default function ComposeFooter({ onBack, onContinue, disabled }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md
        dark:border-night-800 dark:bg-night-950/95 sm:px-6 lg:px-8"
    >
      <div className={`mx-auto flex items-center justify-between gap-3 ${WIZARD_WIDTH}`}>
        <button
          onClick={onBack}
          className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700
            transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:bg-night-800 dark:text-slate-200 dark:hover:bg-night-700"
        >
          ← Back
        </button>

        <Button onClick={onContinue} disabled={disabled}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
