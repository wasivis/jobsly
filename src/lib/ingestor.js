import { supabase } from './supabase';

function cleanTags(tags) {
  if (!Array.isArray(tags)) return ['Remote'];
  return [...new Set(tags.map(t => t.toLowerCase().trim()))].slice(0, 5);
}

function normalizeLocation(loc) {
  if (!loc) return "Worldwide";
  const l = loc.toLowerCase();
  if (l.includes("argentina") || l === "ar") return "Argentina";
  if (l.includes("united states") || l === "usa" || l === "us") return "USA";
  if (l.includes("united kingdom") || l === "uk" || l === "gb") return "UK";
  if (l.includes("anywhere") || l.includes("worldwide")) return "Worldwide";
  return loc.charAt(0).toUpperCase() + loc.slice(1);
}

export async function ingestRealJobs() {
  console.log("--- 🌊 High-Volume Ingestion Started ---");
  let allJobs = [];

  // --- SOURCE 1: REMOTIVE (The Gold Mine) ---
  try {
    console.log("Fetching from Remotive...");
    const res = await fetch(`https://remotive.com/api/remote-jobs?limit=100`);
    const data = await res.json();
    if (data.jobs) {
      data.jobs.forEach(job => {
        allJobs.push({
          title: job.title,
          company: job.company_name,
          location: normalizeLocation(job.candidate_required_location),
          description: job.description,
          logo_url: job.company_logo,
          apply_url: job.url,
          salary_min: 0, // Remotive usually buries salary in text
          salary_max: 0,
          tags: cleanTags(job.tags),
          is_remote: true,
          source: 'Remotive'
        });
      });
      console.log(`✅ Remotive: Found ${data.jobs.length} jobs`);
    }
  } catch (e) { console.error("Remotive failed", e); }

  // --- SOURCE 2: THE MUSE (Pagination Loop) ---
  // We'll grab 3 pages of Software Engineering roles
  for (let p = 0; p < 3; p++) {
    try {
      const res = await fetch(`https://www.themuse.com/api/public/jobs?category=Software%20Engineering&page=${p}`);
      const data = await res.json();
      if (data.results) {
        data.results.forEach(job => allJobs.push({
          title: job.name,
          company: job.company.name,
          location: normalizeLocation(job.locations[0]?.name),
          description: job.contents,
          apply_url: job.refs.landing_page,
          tags: ['Engineering'],
          is_remote: true,
          source: 'TheMuse'
        }));
      }
    } catch (e) { console.error(`The Muse P${p} failed`); }
  }

  // --- SOURCE 3: JOBICY (Argentina + Global) ---
  try {
    const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=50`);
    const data = await res.json();
    if (data.jobs) {
      data.jobs.forEach(job => allJobs.push({
        title: job.jobTitle,
        company: job.companyName,
        location: normalizeLocation(job.jobGeo),
        description: job.jobDescription,
        logo_url: job.companyLogo,
        apply_url: job.url,
        tags: cleanTags(job.jobIndustry),
        is_remote: true,
        source: 'Jobicy'
      }));
    }
  } catch (e) { console.error("Jobicy failed", e); }

  // --- DEDUPLICATION ---
  const uniqueJobsMap = new Map();
  allJobs.forEach(job => {
    const key = `${job.title}-${job.company}`.toLowerCase().trim();
    if (!uniqueJobsMap.has(key)) uniqueJobsMap.set(key, job);
  });

  const deduplicatedJobs = Array.from(uniqueJobsMap.values());

  // --- DATABASE SYNC ---
  const { data: finalData, error } = await supabase
    .from('jobs')
    .upsert(deduplicatedJobs, { onConflict: 'title, company' })
    .select();

  if (error) {
    console.error("❌ Sync Error:", error.message);
  } else {
    console.log(`--- ✨ Sync Complete! Total unique jobs in DB: ${finalData?.length || 0} ---`);
  }
}