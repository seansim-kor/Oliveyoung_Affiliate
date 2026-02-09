import React from 'react';
import { Gender, AgeGroup, UserDemographics } from '../types';
import { Button } from './Button';
import { User, Calendar } from 'lucide-react';

interface DemographicsSelectorProps {
  onComplete: (data: UserDemographics) => void;
  initialData: UserDemographics;
}

export const DemographicsSelector: React.FC<DemographicsSelectorProps> = ({ onComplete, initialData }) => {
  const [data, setData] = React.useState<UserDemographics>(initialData);

  const genders: Gender[] = ['Female', 'Male', 'Other'];
  const ages: AgeGroup[] = ['10s', '20s', '30s', '40s', '50s', '60s', '70s+'];

  const handleGenderSelect = (g: Gender) => setData({ ...data, gender: g });
  const handleAgeSelect = (a: AgeGroup) => setData({ ...data, ageGroup: a });

  return (
    <div className="flex flex-col h-full py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-2xl font-light text-slate-900">Tell us about you</h2>
        <p className="text-slate-500 text-sm">We tailor the analysis to your age and profile.</p>
      </div>

      <div className="space-y-8 flex-grow">
        {/* Gender Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-center">
            <User size={14} /> Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => handleGenderSelect(g)}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                  data.gender === g
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Age Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-center">
            <Calendar size={14} /> Age Group
          </label>
          <div className="grid grid-cols-4 gap-3">
            {ages.map((a) => (
              <button
                key={a}
                onClick={() => handleAgeSelect(a)}
                className={`py-2 px-2 rounded-xl text-sm font-medium transition-all ${
                  data.ageGroup === a
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/20 scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button onClick={() => onComplete(data)} fullWidth variant="primary">
          Continue to Camera
        </Button>
      </div>
    </div>
  );
};