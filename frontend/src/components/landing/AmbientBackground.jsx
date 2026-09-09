// Fixed decorative glow layers behind the landing page. Rendered once at the
// page root so nothing painted later in the normal document flow can cover it.
export default function AmbientBackground({ isDark }) {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-white dark:bg-night-950" />

      <div
        className={`pointer-events-none fixed left-1/2 top-[-260px] -z-10 h-[560px] w-[1200px] -translate-x-1/2 rounded-full blur-[150px] transition-opacity duration-300 ${
          isDark ? "bg-accent-500/25" : "bg-accent-200/40"
        }`}
      />
      <div
        className={`pointer-events-none fixed left-1/2 top-[-160px] -z-10 h-[280px] w-[620px] -translate-x-1/2 rounded-full blur-[110px] transition-opacity duration-300 ${
          isDark ? "bg-white/15" : "bg-white/60"
        }`}
      />

      <div className="pointer-events-none fixed -left-32 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-brand-200/30 blur-[130px] dark:bg-brand-900/20" />
      <div className="pointer-events-none fixed -right-32 top-96 -z-10 h-[420px] w-[420px] rounded-full bg-accent-200/30 blur-[130px] dark:bg-accent-900/15" />
    </>
  );
}
