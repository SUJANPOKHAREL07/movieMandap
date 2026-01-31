import React from 'react';
import { Star, Play } from 'lucide-react';

interface MovieCardProps {
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  image,
  rating,
  year,
  category,
}) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1">
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
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
          <Star className="text-orange-500" fill="currentColor" size={12} />
          <span className="text-white text-xs font-bold">{rating.toFixed(1)}</span>
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
    </div>
  );
};

export default MovieCard;
