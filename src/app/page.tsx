import { supabase } from '@/lib/supabase';
import JobCard from '@/components/JobCard';
import FilterBar from '@/components/FilterBar';
import { Globe } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const JOBS_PER_PAGE = 12;

async function getJobs(query?: string, page: number = 1, location?: string) {
  const from = (page - 1) * JOBS_PER_PAGE;
  const to = from + JOBS_PER_PAGE - 1;

  let supabaseQuery = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('is_remote', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  // Apply location filter if one is selected
  if (location && location !== 'All Locations') {
    supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
  }

  // Apply search query
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,description.ilike.%${query}%`
    );
  }

  const { data: jobs, count, error } = await supabaseQuery.range(from, to);

  if (error) {
    console.error('Supabase error:', error);
    return { jobs: [], totalCount: 0 };
  }

  return { 
    jobs: jobs || [], 
    totalCount: count || 0 
  };
}

async function getLocations() {
  const { data } = await supabase
    .from('jobs')
    .select('location')
    .eq('is_remote', true);
  
  const rawLocations = data?.map(j => j.location) || [];
  const unique = Array.from(new Set(rawLocations))
    .filter(Boolean)
    .sort();

  return ['All Locations', ...unique];
}

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string; location?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const currentPage = Number(resolvedParams.page) || 1;
  const selectedLoc = resolvedParams.location || 'All Locations';

  const { jobs, totalCount } = await getJobs(query, currentPage, selectedLoc);
  const locations = await getLocations();
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Globe size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              Jobsly
            </h1>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition shadow-sm">
            Post a Job
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          {totalCount} Active Remote Roles
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Work from <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-4">Anywhere.</span>
        </h2>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
          The #1 curated board for building the future from home, cafes, or beaches. 
        </p>
      </header>

      {/* IMPORTANT: FilterBar is a Client Component. 
          It handles the search AND the location dropdown now.
      */}
      <FilterBar locations={locations} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex flex-col gap-5">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link 
                href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ''}${selectedLoc !== 'All Locations' ? `&location=${selectedLoc}` : ''}`}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition shadow-sm"
              >
                Previous
              </Link>
            )}
            
            <div className="bg-slate-200/50 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600">
              Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages && (
              <Link 
                href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ''}${selectedLoc !== 'All Locations' ? `&location=${selectedLoc}` : ''}`}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition shadow-md shadow-indigo-100"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center">
          <p className="text-slate-400 text-sm font-medium">
            Made with ❤️ by wasivis - © 2026 Jobsly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}