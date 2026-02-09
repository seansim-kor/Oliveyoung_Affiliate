import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';

interface RewardCardProps {
  referralLink: string;
}

export const RewardCard: React.FC<RewardCardProps> = ({ referralLink }) => {
  return (
    <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 p-5 rounded-2xl shadow-lg border border-amber-300 relative overflow-hidden mb-6">
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white opacity-40 blur-2xl rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-sm">
            <Gift size={16} />
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Exclusive Reward</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
          Unlock 10% OFF <br/>Your First Haul
        </h3>
        <p className="text-sm text-amber-900/80 mb-4 font-medium">
          Welcome to global K-Beauty. Use this special member invite to save on your personalized routine.
        </p>

        <a 
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-900/10 active:scale-95 transition-transform">
            Claim 10% Discount
            <ArrowRight size={16} />
          </button>
        </a>
        <div className="text-[10px] text-center mt-2 text-amber-800/60 font-medium">
          *Valid for new Olive Young Global members
        </div>
      </div>
    </div>
  );
};