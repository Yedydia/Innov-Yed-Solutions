export default function Loading() {
  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 skeleton rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-[var(--background)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="skeleton rounded-lg h-4 w-48 mb-8" />
          <div className="skeleton rounded-lg h-6 w-20 mb-4" />
          <div className="skeleton rounded-lg h-12 w-3/4 mb-6" />
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="skeleton rounded-lg h-4 w-32" />
            <div className="skeleton rounded-lg h-4 w-24" />
            <div className="skeleton rounded-lg h-4 w-20" />
          </div>
          <div className="skeleton rounded-lg h-4 w-40" />
        </div>
      </section>
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="skeleton rounded-2xl aspect-video" />
              <div>
                <div className="skeleton rounded-lg h-8 w-64 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton rounded-lg h-6 w-full" />
                  ))}
                </div>
              </div>
              <div>
                <div className="skeleton rounded-lg h-8 w-32 mb-6" />
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton rounded-xl h-20 w-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:sticky lg:top-24 self-start">
              <div className="skeleton rounded-2xl h-96" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
