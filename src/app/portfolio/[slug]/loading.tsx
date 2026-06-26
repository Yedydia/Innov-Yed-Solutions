export default function Loading() {
  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 skeleton rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-4 w-48 mb-8" />
          <div className="flex gap-2 mb-4">
            <div className="skeleton rounded-lg h-6 w-16" />
            <div className="skeleton rounded-lg h-6 w-24" />
          </div>
          <div className="skeleton rounded-lg h-12 w-3/4 mb-6" />
          <div className="skeleton rounded-lg h-5 w-full max-w-2xl" />
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="skeleton rounded-2xl aspect-[16/9]" />
              <div className="space-y-4">
                <div className="skeleton rounded-lg h-8 w-40" />
                <div className="skeleton rounded-lg h-5 w-full" />
                <div className="skeleton rounded-lg h-5 w-5/6" />
                <div className="skeleton rounded-lg h-5 w-4/5" />
              </div>
              <div className="space-y-4">
                <div className="skeleton rounded-lg h-8 w-32" />
                <div className="skeleton rounded-lg h-5 w-full" />
                <div className="skeleton rounded-lg h-5 w-3/4" />
              </div>
            </div>
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton rounded-2xl h-32" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
