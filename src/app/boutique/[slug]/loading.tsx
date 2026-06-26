export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="skeleton rounded-lg h-4 w-48" />
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="skeleton rounded-2xl aspect-square mb-4" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton rounded-xl w-20 h-20" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="skeleton rounded-lg h-6 w-24" />
            <div className="skeleton rounded-lg h-10 w-3/4" />
            <div className="flex items-center gap-3">
              <div className="skeleton rounded-lg h-4 w-32" />
              <div className="skeleton rounded-lg h-4 w-24" />
            </div>
            <div className="skeleton rounded-lg h-8 w-40" />
            <div className="skeleton rounded-lg h-20 w-full" />
            <div className="flex items-center gap-4">
              <div className="skeleton rounded-lg h-12 w-32" />
              <div className="skeleton rounded-lg h-12 flex-1" />
              <div className="skeleton rounded-lg h-12 w-12" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton rounded-xl h-20" />
              ))}
            </div>
            <div className="skeleton rounded-xl h-48 w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
