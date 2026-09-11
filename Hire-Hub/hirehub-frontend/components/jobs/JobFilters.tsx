"use client";

import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type { JobType } from "@/types";
import { JOB_TYPE_LABELS } from "@/lib/utils";

interface JobFiltersProps {
  onFilter: (filters: { keyword?: string; location?: string; jobType?: string }) => void;
}

const JOB_TYPES: JobType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];

export default function JobFilters({ onFilter }: JobFiltersProps) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ keyword, location, jobType });
  };

  const handleTypeChange = (type: string) => {
    const newType = jobType === type ? "" : type;
    setJobType(newType);
    onFilter({ keyword, location, jobType: newType });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="cyber-card rounded-2xl p-3 flex flex-col sm:flex-row gap-3 border border-cyan-500/30">
        <div className="flex-1 flex items-center gap-3 px-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Job title, skills, or keywords..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 flex-1 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 px-3 sm:border-l border-cyan-500/20">
          <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
          <input
            type="text"
            placeholder="City, state, or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 flex-1 outline-none min-w-0"
          />
        </div>
        <button type="submit" className="btn-cyber-primary px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0">
          Search Jobs
        </button>
      </form>

      {/* Type filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-slate-400 mr-1">Filter:</span>
        {JOB_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              jobType === type
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                : "bg-black/60 text-slate-400 border-cyan-500/20 hover:text-cyan-200 hover:border-cyan-500/50"
            }`}
          >
            {JOB_TYPE_LABELS[type]}
          </button>
        ))}
        {(keyword || location || jobType) && (
          <button
            onClick={() => {
              setKeyword(""); setLocation(""); setJobType("");
              onFilter({});
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-pink-400 hover:bg-pink-500/10 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
