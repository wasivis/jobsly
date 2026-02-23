export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded mb-12"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 w-full bg-slate-100 rounded-xl mb-6"></div>
      ))}
    </div>
  );
}