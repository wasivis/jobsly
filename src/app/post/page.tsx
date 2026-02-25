'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Globe, Rocket } from 'lucide-react';

export default function PostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const jobData = {
      title: formData.get('title'),
      company: formData.get('company'),
      location: formData.get('location'),
      apply_url: formData.get('apply_url'),
      description: formData.get('description'),
      tags: formData.get('tags')?.toString().split(',').map(t => t.trim()),
      salary_min: Number(formData.get('salary_min')),
      salary_max: Number(formData.get('salary_max')),
      is_remote: true,
      source: 'Direct', // To distinguish from aggregated jobs
    };

    const { error } = await supabase.from('jobs').insert([jobData]);

    if (error) {
      alert("Error posting job: " + error.message);
    } else {
      alert("Job posted successfully!");
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-3xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="bg-indigo-700 p-8 text-white">
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Rocket /> Post a Remote Job
          </h1>
          <p className="text-indigo-100 font-medium">Reach thousands of people today.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">Job Title</label>
              <input
                name="title"
                required
                placeholder="Sr. React Developer"
                className="w-full p-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">Company Name</label>
              <input
                name="company"
                required
                placeholder="Acme Inc."
                className="w-full p-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              Location (e.g. Argentina, Worldwide)
            </label>
            <input
              name="location"
              required
              placeholder="Argentina"
              className="w-full p-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">Application Link / Email</label>
            <input
              name="apply_url"
              type="url"
              required
              placeholder="https://..."
              className="w-full p-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">Job Description</label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Describe the role..."
              className="w-full p-3 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-950/50 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}