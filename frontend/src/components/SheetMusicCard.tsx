import React from 'react';
import type { SheetMusicDto } from '../services/sheetMusicApi';
import { formatPrice, detectUserCurrency } from '../services/paymentApi';

interface SheetMusicCardProps {
  sheet: SheetMusicDto;
  onPreview: (sheet: SheetMusicDto) => void;
  onBuyOrOpen: (sheet: SheetMusicDto) => void;
}

export const SheetMusicCard: React.FC<SheetMusicCardProps> = ({
  sheet,
  onPreview,
  onBuyOrOpen,
}) => {
  const currency = detectUserCurrency();
  const displayPrice = currency === 'IDR' ? formatPrice(sheet.priceIDR, 'IDR') : formatPrice(sheet.priceUSD, 'USD');

  return (
    <div className="group bg-white/80 backdrop-blur-md border border-[#dfa38f]/30 hover:border-[#dfa38f]/70 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-[#ffe5db] to-[#dfa38f]/20">
          <img
            src={sheet.thumbnailUrl}
            alt={sheet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/pianogrand.jpg';
            }}
          />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4a372e] text-[10px] font-bold uppercase tracking-wider shadow-sm border border-[#dfa38f]/30">
            {sheet.genre}
          </span>
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#dfa38f] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {sheet.keySignature}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display-sm text-base font-bold text-[#4a372e] leading-snug group-hover:text-[#ab7e66] transition-colors">
            {sheet.title}
          </h3>
          <p className="text-xs text-[#8b7368]">
            Arranged by <span className="font-semibold text-[#6a564d]">{sheet.arranger}</span>
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#dfa38f]/20 space-y-3 mt-4">
        <div className="flex items-center justify-between text-xs text-[#6a564d]">
          <span className="font-medium">{sheet.pageCount} Pages • {sheet.difficulty}</span>
          <span className="text-sm font-bold text-[#4a372e]">{displayPrice}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPreview(sheet)}
            className="w-full py-2 rounded-xl bg-white hover:bg-[#dfa38f]/10 text-[#4a372e] text-xs font-bold border border-[#dfa38f]/40 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm text-[#ab7e66]">visibility</span>
            Preview
          </button>
          <button
            type="button"
            onClick={() => onBuyOrOpen(sheet)}
            style={{
              backgroundImage: sheet.isOwned
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #dfa38f 0%, #ab7e66 100%)',
            }}
            className="w-full py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-[1.02] flex items-center justify-center gap-1"
          >
            {sheet.isOwned ? (
              <>
                <span className="material-symbols-outlined text-sm">menu_book</span>
                Open Score
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">shopping_cart</span>
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
