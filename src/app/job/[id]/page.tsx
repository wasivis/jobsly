import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import {
  MapPin,
  DollarSign,
  Calendar,
  ArrowLeft,
  Building2,
} from "lucide-react";
import Link from "next/link";

function decodeHtmlEntities(value: string) {
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
}

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;

  // Fetch only the specific job by its ID
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound(); // Triggers the Next.js 404 page
  }

  const normalizedTitle = decodeHtmlEntities(job.title);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium"
          >
            <ArrowLeft size={20} /> Back to all jobs
          </Link>
          <a
            href={job.apply_url}
            target="_blank"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Apply Now
          </a>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-400">
              {job.company[0]}
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {normalizedTitle}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 mt-1">
                <Building2 size={18} />
                <span className="text-lg font-medium">{job.company}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-500 border-y py-6">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
              <MapPin size={18} className="text-blue-500" /> {job.location}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-green-700">
              <DollarSign size={18} /> ${job.salary_min.toLocaleString()} - $
              {job.salary_max.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Description Section */}

        <div className="prose prose-slate max-w-none prose-indigo">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Job Description
          </h2>
          <div
            className="text-slate-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag: string) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
