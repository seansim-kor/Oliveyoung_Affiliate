import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SkinMetrics } from '../types';

interface SkinRadarChartProps {
  metrics: SkinMetrics;
}

export const SkinRadarChart: React.FC<SkinRadarChartProps> = ({ metrics }) => {
  // Defensive check for metrics
  if (!metrics) {
    console.warn("[WARN] RadarChart: metrics is undefined");
    return (
      <div className="w-full h-[300px] bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">데이터를 불러오는 중...</p>
      </div>
    );
  }

  const data = [
    { subject: 'Hydration', A: metrics?.hydration || 0, fullMark: 100 },
    { subject: 'Oil Control', A: 100 - (metrics?.oiliness || 0), fullMark: 100 },
    { subject: 'Resilience', A: 100 - (metrics?.sensitivity || 0), fullMark: 100 },
    { subject: 'Tone', A: 100 - (metrics?.pigmentation || 0), fullMark: 100 },
    { subject: 'Firmness', A: 100 - (metrics?.wrinkles || 0), fullMark: 100 },
  ];

  return (
    <div className="w-full h-[300px] bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100" style={{ minHeight: '300px', minWidth: '200px' }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={250} minWidth={180}>
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