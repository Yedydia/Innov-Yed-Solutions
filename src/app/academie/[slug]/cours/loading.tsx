export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-50 bg-navy border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="skeleton rounded-lg h-4 w-16" />
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="skeleton rounded-lg h-4 w-64" />
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton rounded-lg h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="flex max-w-[1920px] mx-auto">
        <aside className="hidden lg:block w-80 h-[calc(100vh-57px)] border-r border-[var(--card-border)] p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg skeleton" />
            <div>
              <div className="skeleton rounded-lg h-3 w-24 mb-1" />
              <div className="skeleton rounded-lg h-4 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton rounded-lg h-12 w-full" />
            ))}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="relative aspect-video bg-black max-h-[70vh] skeleton rounded-none" />
          <div className="border-b border-[var(--card-border)]">
            <div className="max-w-4xl mx-auto flex gap-6 px-6 py-3">
              <div className="skeleton rounded-lg h-6 w-20" />
              <div className="skeleton rounded-lg h-6 w-16" />
              <div className="skeleton rounded-lg h-6 w-24" />
            </div>
          </div>
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="skeleton rounded-lg h-8 w-3/4" />
            <div className="skeleton rounded-xl h-40 w-full" />
            <div className="skeleton rounded-xl h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
