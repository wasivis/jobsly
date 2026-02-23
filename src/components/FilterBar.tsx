'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useTransition } from 'react';

interface FilterBarProps {
  locations: string[];
}

export default function FilterBar({ locations }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper to update URL params
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'All Locations') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Always reset to page 1 when filters change
    params.set('page', '1');

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 mb-10">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              isPending ? 'text-indigo-500 animate-pulse' : 'text-slate-400'
            }`} 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => updateFilters('q', e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all group-hover:border-slate-300"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative min-w-[240px] group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          <select
            value={searchParams.get('location') || 'All Locations'}
            onChange={(e) => updateFilters('location', e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm appearance-none font-semibold text-slate-700 cursor-pointer group-hover:border-slate-300 transition-all"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {/* Custom Arrow for the Select */}
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Loading Indicator for UX */}
      {isPending && (
        <p className="text-xs text-indigo-500 font-bold mt-2 ml-2 animate-pulse">
          Updating results...
        </p>
      )}
    </div>
  );
}