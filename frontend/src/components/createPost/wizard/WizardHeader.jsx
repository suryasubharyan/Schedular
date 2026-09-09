import { IoPencilOutline } from "react-icons/io5";
import Button from "../../ui/Button";
import { PHASE_COPY, EDIT_SUBTITLE, WIZARD_WIDTH } from "./constants";

export default function WizardHeader({ phase, isEditing, onBack, onEditClick, onPostNowClick }) {
  if (phase === "loading") return null;

  return (
    <div className={`mx-auto mb-6 flex flex-wrap items-start justify-between gap-3 ${WIZARD_WIDTH}`}>
      <div className="flex items-start gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={onBack}
            className="mt-0.5 w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700
              transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700 dark:bg-night-800
              dark:text-slate-200 dark:hover:bg-night-700"
          >
            ← Back
          </button>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Post" : "Create Post"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{isEditing ? EDIT_SUBTITLE : PHASE_COPY[phase]}</p>
        </div>
      </div>

      {phase === "preview" && (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onEditClick}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold
              text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-night-700
              dark:bg-night-800 dark:text-slate-200 dark:hover:bg-night-700"
          >
            <IoPencilOutline className="h-4 w-4" />
            Edit
          </button>
          <Button className="bg-brand-600 hover:bg-brand-700" onClick={onPostNowClick}>
            Post Now
          </Button>
        </div>
      )}
    </div>
  );
}
