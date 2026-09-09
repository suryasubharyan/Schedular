import { Link } from "react-router-dom";
import { PlatformsIcon } from "../Icons";

export default function EmptyState() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-soft transition-colors duration-300 dark:bg-night-900">
      <div className="grid max-w-lg gap-5">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <PlatformsIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 dark:text-white">
            Connect a platform to get started
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Posts are tied to a connected account. Head to Platforms to connect LinkedIn,
            Instagram, Facebook or X — then come back here to start composing.
          </p>
        </div>
        <Link
          to="/platforms"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-soft
            transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
        >
          Go to Platforms →
        </Link>
      </div>
    </div>
  );
}
