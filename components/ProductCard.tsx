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
  const handleBuyClick = (platform: 'OliveYoung' | 'Amazon' | 'YesStyle') => {
    const query = encodeURIComponent(`${product.brand} ${product.name}`);
    let url = '';

    const isKoreanStore = storeRegion === 'KR';

    if (platform === 'OliveYoung') {
      url = isKoreanStore
        ? `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${query}`
        : `https://global.oliveyoung.com/display/search?query=${query}`;
    } else if (platform === 'Amazon') {
      url = `https://www.amazon.com/s?k=${query}+korean+skincare`;
    } else if (platform === 'YesStyle') {
      url = `https://www.yesstyle.com/en/list.html?q=${query}`;
    }

    if (url) window.open(url, '_blank');
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
    <div className={`bg-white p-5 rounded-3xl shadow-sm border ${isSpecial ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'} flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group`}>
      {/* Promotional Badge */}
      {product.badge && (
        <div className={`absolute top-0 left-0 ${badgeColor} text-[10px] font-black px-3 py-1.5 rounded-br-xl z-20 border-b border-r shadow-sm uppercase tracking-wide`}>
          {product.badge}
        </div>
      )}
      {/* Discount Badge */}
      {storeRegion === 'Global' && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
          -10% OFF
        </div>
      )}

      {/* Step Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
          <StepIcon size={14} />
        </div>
        <span className={`text-[10px] font-black tracking-[0.2em] ${config.color} uppercase`}>
          {config.label}
        </span>
      </div>

      <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight tracking-tight">{product.name}</h3>
      <p className="text-sm text-slate-400 font-bold mb-3 uppercase tracking-wider">{product.brand}</p>

      {/* Key Ingredient Pill */}
      {product.keyIngredient && (
        <div className="mb-4">
          <span className="inline-block px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-slate-100">
            {product.keyIngredient}
          </span>
        </div>
      )}

      {/* Price Comparison Section */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">Olive Young Global</span>
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-black">${discountedPrice}</span>
            <span className="text-slate-400 line-through scale-90">${originalPrice}</span>
          </div>
        </div>

        {product.externalPrices?.amazon && (
          <div className="flex justify-between items-center text-[10px] border-t border-slate-200/50 pt-2">
            <span className="text-slate-500 font-bold">Amazon.com</span>
            <span className="text-slate-700 font-black">${product.externalPrices.amazon}</span>
          </div>
        )}

        {product.externalPrices?.yesstyle && (
          <div className="flex justify-between items-center text-[10px] border-t border-slate-200/50 pt-2">
            <span className="text-slate-500 font-bold">YesStyle</span>
            <span className="text-slate-700 font-black">${product.externalPrices.yesstyle}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex items-start gap-2">
          <div className="mt-1 text-rose-500 shrink-0"><Sparkles size={14} /></div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {product.reason}
          </p>
        </div>
      </div>

      {/* Purchase Buttons Stack */}
      <div className="space-y-2">
        <button
          onClick={() => handleBuyClick('OliveYoung')}
          className="w-full py-3 px-4 bg-slate-900 text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-lg shadow-slate-200"
        >
          <ShoppingBag size={14} />
          {storeRegion === 'KR' ? '올리브영 바로가기' : 'Buy on Olive Young'}
        </button>

        {storeRegion === 'Global' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBuyClick('Amazon')}
              className="py-2 px-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors uppercase tracking-tight"
            >
              Amazon
              <ExternalLink size={10} />
            </button>
            <button
              onClick={() => handleBuyClick('YesStyle')}
              className="py-2 px-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors uppercase tracking-tight"
            >
              YesStyle
              <ExternalLink size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};