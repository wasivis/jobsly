<div align="center">
  <h1>🌍 Jobsly</h1>
  <p><strong>The Unified Remote Job Aggregator for Developers</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  </p>
</div>

---

## 📖 Overview

Jobsly is a specialized job board that aggregates remote opportunities from multiple fragmented sources into a single, filtered interface. It solves the "tab-fatigue" problem for remote workers by scraping and normalizing data from various job portals, ensuring that users see only the most relevant, high-quality remote roles.

## ✨ Key Features

* **Multi-Source Aggregation:** Scrapes and pulls data from major remote-only job boards and career pages.
* **Data Normalization:** Converts inconsistent data formats from different sources into a unified schema.
* **Daily Sync:** Automated cron jobs ensure the job feed stays fresh and stale listings are purged.

## 🛠️ Technical Deep Dive

### 1. The Scraper Engine (Node.js)
Jobsly uses a robust scraping architecture designed to handle rate-limiting and varied HTML structures. It bypasses common scraping hurdles to ensure a consistent flow of data into the PostgreSQL database.

### 2. Database Schema & Performance
Using **Supabase** with **PostgreSQL**, Jobsly is optimized for fast querying. I implemented:
- **Indexes** on frequently searched fields like `location` and `tags`.
- **Deduplication Logic** to ensure the same job post from different sources isn't shown twice.

### 3. Frontend Architecture
- **Next.js Server Components:** Fetches job data on the server for lightning-fast initial page loads and SEO optimization.
- **Client-side Filtering:** Real-time search and filter experience using React state management.
