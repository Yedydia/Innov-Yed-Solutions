export default function Loading() {
  return (
    <div>
      <div className="relative aspect-[21/9] max-h-[500px] skeleton rounded-none" />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="skeleton rounded-lg h-4 w-16" />
          <div className="skeleton rounded-lg h-4 w-4" />
          <div className="skeleton rounded-lg h-4 w-12" />
          <div className="skeleton rounded-lg h-4 w-4" />
          <div className="skeleton rounded-lg h-4 w-20" />
        </div>
        <div className="skeleton rounded-lg h-6 w-24 mb-4" />
        <div className="skeleton rounded-lg h-10 w-full mb-2" />
        <div className="skeleton rounded-lg h-10 w-4/5 mb-6" />
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div>
              <div className="skeleton rounded-lg h-4 w-28 mb-1" />
              <div className="skeleton rounded-lg h-3 w-12" />
            </div>
          </div>
        </div>
        <div className="space-y-4 mb-16">
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-4/5" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-3/5" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-5/6" />
          <div className="skeleton rounded-lg h-5 w-full" />
          <div className="skeleton rounded-lg h-5 w-2/3" />
          <div className="skeleton rounded-lg h-5 w-full" />
        </div>
      </article>
    </div>
  );
}
