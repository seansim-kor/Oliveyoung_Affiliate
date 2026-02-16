import React from 'react';
import { Product } from '../types';
import { ShoppingBag, ExternalLink, Droplet, Sparkles, Shield, Zap, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number; // 0-4
  storeRegion: 'KR' | 'Global';
  referralLink: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, storeRegion, referralLink }) => {
  const handleBuyClick = () => {
    // Construct search query - Brand + Name works best for Olive Young
    const query = encodeURIComponent(`${product.brand} ${product.name}`);

    // Determine base URL based on Store Region and Language
    // If language is KO, use Korean store. Otherwise use Global English store.
    const isKoreanStore = storeRegion === 'KR';

    const baseUrl = isKoreanStore
      ? `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${query}`
      : `https://global.oliveyoung.com/display/search?query=${query}`;

    window.open(baseUrl, '_blank');
  };

  // Price Anchoring Logic
  const originalPrice = product.priceUsd;
  const discountedPrice = Math.floor(product.priceUsd * 0.9); // 10% off

  // Map step index to icon and label
  const stepConfig = [
    { label: "STEP 1: PREP", icon: Droplet, color: "text-cyan-500", bg: "bg-cyan-50" },
    { label: "STEP 2: TARGET", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "STEP 3: SEAL", icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "STEP 4: PROTECT", icon: Shield, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "STEP 5: ENHANCE", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const config = stepConfig[index] || stepConfig[0];
  const StepIcon = config.icon;

  // Badge Logic
  const badgeColor = product.badge === 'Best Seller' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200';
  const isSpecial = !!product.badge;

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border ${isSpecial ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'} flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group`}>
      {/* Promotional Badge */}
      {product.badge && (
        <div className={`absolute top-0 left-0 ${badgeColor} text-[10px] font-bold px-3 py-1.5 rounded-br-xl z-10 border-b border-r shadow-sm uppercase tracking-wide`}>
          {product.badge}
        </div>
      )}
      {/* Discount Badge */}
      {storeRegion === 'Global' && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 shadow-sm">
          SAVE 10%
        </div>
      )}

      {/* Step Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
          <StepIcon size={14} />
        </div>
        <span className={`text-xs font-bold tracking-wider ${config.color}`}>
          {config.label}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{product.name}</h3>
      <p className="text-sm text-slate-500 font-medium mb-3">{product.brand}</p>

      {/* Key Ingredient Pill */}
      {product.keyIngredient && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md uppercase tracking-wide">
            {product.keyIngredient}
          </span>
        </div>
      )}

      {/* Price Display */}
      <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-3">
        {storeRegion === 'Global' ? (
          <>
            <span className="text-lg font-bold text-slate-900">${discountedPrice}</span>
            <span className="text-sm text-slate-400 line-through">${originalPrice}</span>
          </>
        ) : (
          <span className="text-lg font-bold text-slate-900">₩{(originalPrice * 1300).toLocaleString()}~</span>
        )}
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        <div className="flex items-start gap-2">
          <div className="mt-1 text-rose-400 shrink-0"><Sparkles size={14} /></div>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">{storeRegion === 'Global' ? 'Clinical Benefit: ' : '기대 효과: '}</span>
            {product.reason}
          </p>
        </div>
      </div>

      <button
        onClick={handleBuyClick}
        className="mt-auto w-full py-2.5 px-4 bg-slate-50 text-slate-800 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm border border-slate-200 active:scale-95 group/btn"
      >
        <ShoppingBag size={16} className="group-hover/btn:text-rose-500 transition-colors" />
        {storeRegion === 'KR' ? '올리브영 구매하기' : 'View on Olive Young'}
        <ExternalLink size={14} className="ml-1 opacity-50" />
      </button>
    </div>
  );
};