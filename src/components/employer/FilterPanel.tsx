import { Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchCriteria } from "@/lib/api/services/employer";

interface FilterPanelProps {
  criteria: SearchCriteria;
  onChange: (newCriteria: SearchCriteria) => void;
}

export function FilterPanel({ criteria, onChange }: FilterPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">
        <Filter className="w-5 h-5 text-primary-600" />
        Filter Candidates
      </div>

      <div className="space-y-6">
        {/* Keyword Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Keyword Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              value={criteria.query}
              onChange={(e) => onChange({...criteria, query: e.target.value})}
              placeholder="Name, skill, or role..." 
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Professional Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <div className="relative">
            <select 
              value={criteria.category}
              onChange={(e) => onChange({...criteria, category: e.target.value})}
              className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Registered Nurse">Registered Nurse</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Midwife">Midwife</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Physician">Physician</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Minimum qualification</label>
          <select
            value={criteria.qualification}
            onChange={(e) => onChange({ ...criteria, qualification: e.target.value })}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any qualification</option>
            <option value="BSc">Bachelor&apos;s degree</option>
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Min. Experience: {criteria.minExperience} yrs</label>
          <input 
            type="range" 
            min="0" max="10" step="1" 
            value={criteria.minExperience}
            onChange={(e) => onChange({...criteria, minExperience: parseInt(e.target.value)})}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0 yrs</span>
            <span>5 yrs</span>
            <span>10+ yrs</span>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <div className="relative">
            <select 
              value={criteria.location}
              onChange={(e) => onChange({...criteria, location: e.target.value})}
              className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Any Location</option>
              <option value="Addis Ababa">Addis Ababa</option>
              <option value="Adama">Adama</option>
              <option value="Hawassa">Hawassa</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
          <select
            value={criteria.availability}
            onChange={(e) => onChange({ ...criteria, availability: e.target.value as SearchCriteria["availability"] })}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any availability</option>
            <option value="Immediate">Immediate</option>
            <option value="1 Week">Within 1 week</option>
            <option value="1 Month">Within 1 month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Work arrangement</label>
          <select
            value={criteria.workArrangement}
            onChange={(e) => onChange({ ...criteria, workArrangement: e.target.value as SearchCriteria["workArrangement"] })}
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any arrangement</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Shift Work">Shift work</option>
          </select>
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-slate-500"
          onClick={() => onChange({ query: "", category: "", qualification: "", location: "", minExperience: 0, availability: "", workArrangement: "" })}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}