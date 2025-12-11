import React from 'react';
import { Star as StarIcon, Zap, Gift } from 'lucide-react';
import { StarData } from '../types';

export type ItemVariant = 'star' | 'fuel' | 'gift';

interface StarProps {
  data: StarData;
  onClick: (star: StarData) => void;
  variant: ItemVariant;
}

const Star: React.FC<StarProps> = ({ data, onClick, variant }) => {
  
  // Helper to format numbers with spaces (e.g. 1000 -> 1 000)
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Render logic based on variant
  const renderIcon = () => {
    switch (variant) {
      case 'fuel':
        return (
          // Reduced container size to w-24 h-24 (was 32), but kept text big
          <div className="relative flex items-center justify-center w-24 h-24">
             {/* Glowing Orb for Magic Fuel */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.8)] border-2 border-purple-300 animate-pulse"></div>
             {/* Smaller Icon size={40} */}
             <Zap size={40} className="text-yellow-300 z-10 drop-shadow-md" fill="currentColor" />
             {/* Increased text size to text-4xl and adjusted positioning */}
             <span className="absolute -bottom-8 bg-black/70 px-3 py-0.5 rounded-xl text-white font-bold text-4xl font-mono shadow-lg border border-purple-500/50 min-w-[80px] text-center">
               {formatNumber(data.value)}
             </span>
          </div>
        );
      case 'gift':
        // Extended color palette for gifts
        const colors = [
          'text-red-500 fill-red-500', 
          'text-green-500 fill-green-500', 
          'text-blue-500 fill-blue-500',
          'text-pink-500 fill-pink-500',
          'text-yellow-500 fill-yellow-500',
          'text-purple-500 fill-purple-500',
          'text-orange-500 fill-orange-500',
          'text-cyan-500 fill-cyan-500'
        ];
        const colorClass = colors[data.value % colors.length];
        
        return (
          <div className="relative flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
             <Gift 
               size={120} 
               className={`${colorClass} drop-shadow-2xl`} 
               strokeWidth={1.5}
             />
             <div className="absolute top-[45%] text-white font-black text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
               {formatNumber(data.value)}
             </div>
          </div>
        );
      case 'star':
      default:
        return (
          <div className="relative flex items-center justify-center animate-twinkle">
            <StarIcon 
              size={80} 
              className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" 
              strokeWidth={1}
            />
            <span className="absolute text-slate-900 font-bold text-xl font-sans select-none pt-1">
              {formatNumber(data.value)}
            </span>
          </div>
        );
    }
  };

  return (
    <button
      onClick={() => onClick(data)}
      className="absolute group transition-transform hover:scale-110 active:scale-95 cursor-pointer outline-none focus:ring-4 focus:ring-yellow-300 rounded-full z-10"
      style={{
        top: `${data.position.top}%`,
        left: `${data.position.left}%`,
        animationDelay: `${data.delay}s`,
        // For gifts, we might want to rotate them slightly to look like a messy pile
        transform: variant === 'gift' ? `rotate(${(data.value % 30) - 15}deg)` : 'none'
      }}
      aria-label={`Výsledek ${data.value}`}
    >
      {renderIcon()}
    </button>
  );
};

export default Star;