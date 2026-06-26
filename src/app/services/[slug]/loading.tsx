export default function Loading() {
  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 skeleton rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-[var(--background)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-4 w-48 mb-8" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl skeleton" />
            <div className="skeleton rounded-lg h-4 w-32" />
          </div>
          <div className="skeleton rounded-lg h-12 w-3/4 mb-4" />
          <div className="skeleton rounded-lg h-5 w-full mb-2" />
          <div className="skeleton rounded-lg h-5 w-4/5 mb-8" />
          <div className="skeleton rounded-lg h-14 w-56" />
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-8 w-48 mb-10" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton rounded-lg h-16 w-full" />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[var(--section-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-8 w-48 mb-10" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton rounded-lg h-14 w-full" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
