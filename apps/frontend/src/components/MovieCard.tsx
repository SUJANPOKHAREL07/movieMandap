import React from 'react';
import { Play } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
  dominantRating: string;
  year: number;
  category: string;
  adult?: boolean;
}

const getRatingColor = (rating: string) => {
  const r = rating.toUpperCase();
  if (r.includes('ABSOLUTE CINEMA')) return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.4)]';
  if (r.includes('WORTHY')) return 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.4)]';
  if (r.includes('GOOD TO WATCH')) return 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
  if (r.includes('BEARABLE')) return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
  if (r.includes('WORST')) return 'bg-gradient-to-r from-rose-600 to-red-500 text-white border-red-400/50 shadow-[0_0_12px_rgba(225,29,72,0.4)]';
  return 'bg-secondary/80 text-foreground border-white/10';
};

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  image,
  dominantRating,
  year,
  category,
  adult,
}) => {
  return (
    <Link href={`/browse/${id}`} className="group relative rounded-xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 block">
      {/* Image Container with Overlay */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <button className="bg-primary text-primary-foreground rounded-full p-3 transform scale-0 group-hover:scale-110 transition-transform duration-300 delay-100 hover:bg-orange-600">
            <Play fill="currentColor" size={24} />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          <div className={`backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border shadow-lg transition-colors ${getRatingColor(dominantRating)}`}>
            <span className="text-[10px] font-black uppercase tracking-wider">{dominantRating}</span>
          </div>
          {adult && (
            <div className="bg-red-600/90 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center shadow-[0_0_12px_rgba(220,38,38,0.7)] border border-red-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
              <span className="text-white text-[10px] font-black tracking-widest uppercase relative z-10 w-4 text-center">A</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{year}</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{category}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
