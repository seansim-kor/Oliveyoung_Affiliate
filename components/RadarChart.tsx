import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SkinMetrics } from '../types';

interface SkinRadarChartProps {
  metrics: SkinMetrics;
}

export const SkinRadarChart: React.FC<SkinRadarChartProps> = ({ metrics }) => {
  const data = [
    { subject: 'Hydration', A: metrics?.hydration || 0, fullMark: 100 },
    { subject: 'Oil Control', A: 100 - (metrics?.oiliness || 0), fullMark: 100 },
    { subject: 'Resilience', A: 100 - (metrics?.sensitivity || 0), fullMark: 100 },
    { subject: 'Tone', A: 100 - (metrics?.pigmentation || 0), fullMark: 100 },
    { subject: 'Firmness', A: 100 - (metrics?.wrinkles || 0), fullMark: 100 },
  ];

  return (
    <div className="w-full h-[300px] bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-center text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Skin Balance Analysis</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="My Skin"
            dataKey="A"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="#f43f5e"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};