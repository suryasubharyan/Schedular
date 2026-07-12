const VARIANTS = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg hover:bg-brand-700 focus-visible:ring-brand-400",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 dark:bg-night-800 dark:text-slate-200 dark:border-night-700 dark:hover:bg-night-700 focus-visible:ring-slate-400",
  danger:
    "bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 focus-visible:ring-red-400",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-night-800 focus-visible:ring-slate-400",
};

const SIZES = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  as,
  ...props
}) {
  const Component = as || "button";

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold cursor-pointer
        transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-night-900
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
