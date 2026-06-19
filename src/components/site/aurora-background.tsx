export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <div className="absolute inset-0 grid-overlay" />
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
    </div>
  );
}
