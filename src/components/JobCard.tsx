import { MapPin, Building2, DollarSign, ExternalLink } from 'lucide-react';

export default function JobCard({ job }: { job: any }) {
  const decodeHtmlEntities = (value: string) => {
    let decoded = value;

    for (let index = 0; index < 3; index += 1) {
      const next = decoded
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&#(\d+);/g, (_, code) => {
          const parsed = Number.parseInt(code, 10);
          return Number.isNaN(parsed) ? _ : String.fromCodePoint(parsed);
        })
        .replace(/&#x([\da-f]+);/gi, (_, code) => {
          const parsed = Number.parseInt(code, 16);
          return Number.isNaN(parsed) ? _ : String.fromCodePoint(parsed);
        });

      if (next === decoded) {
        break;
      }

      decoded = next;
    }

    return decoded;
  };

  const normalizedTitle = decodeHtmlEntities(job.title || '');

  // Helper to format salary display
  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return "Salary Undisclosed";
    if (min && max) return `$${(min/1000).toFixed(0)}k – $${(max/1000).toFixed(0)}k`;
    return `$${(min || max)/1000}k+`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all group relative">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Company Logo */}
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-50 shadow-inner">
          {job.logo_url ? (
            <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="text-slate-400" size={28} />
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{job.company}</span>
            {job.is_featured && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Featured
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors truncate">
            {normalizedTitle}
          </h3>

          <div className="flex flex-wrap gap-y-2 gap-x-4">
            {/* REAL LOCATION INSTEAD OF "ANYWHERE" */}
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <MapPin size={14} className="text-indigo-500" />
              {job.location}
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <DollarSign size={14} className="text-emerald-500" />
              {formatSalary(job.salary_min, job.salary_max)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a 
          href={job.apply_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-auto bg-slate-50 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center justify-center gap-2 border border-slate-200"
        >
          Apply Now
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Tags Section */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 pt-5 border-t border-slate-50">
          {job.tags.map((tag: string) => (
            <span key={tag} className="text-[11px] font-bold text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wider hover:border-indigo-200 hover:text-indigo-500 transition-colors">
              #{tag}
            </span>
          ))}
          {/* Subtle source indicator */}
          <span className="ml-auto text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-1">
            via {job.source || 'Jobsly'}
          </span>
        </div>
      )}
    </div>
  );
}