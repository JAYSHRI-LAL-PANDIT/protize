export default function BgGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute -left-75 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-25 top-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-30 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
    </div>
  );
}
