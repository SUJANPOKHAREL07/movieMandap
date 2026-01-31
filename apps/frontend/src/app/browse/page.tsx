'use client';

import React from 'react';
import UserNavBar from '@/components/UserNavBar';
import MovieCard from '@/components/MovieCard';
import { Play, Info } from 'lucide-react';

export default function BrowsePage() {
  // Dummy Data
  const featuredMovie = {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    image: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg"
  };

  const trendingMovies = [
    { id: 1, title: "The Dark Knight", rating: 9.0, year: 2008, category: "Action", image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { id: 2, title: "Interstellar", rating: 8.6, year: 2014, category: "Sci-Fi", image: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8ztDDXLOxjsGWPeKt.jpg" },
    { id: 3, title: "Parasite", rating: 8.5, year: 2019, category: "Thriller", image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
    { id: 4, title: "Avengers: Endgame", rating: 8.4, year: 2019, category: "Action", image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    { id: 5, title: "Joker", rating: 8.2, year: 2019, category: "Drama", image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
    { id: 6, title: "Spider-Man: Into the Spider-Verse", rating: 8.4, year: 2018, category: "Animation", image: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg" },
    { id: 7, title: "Coco", rating: 8.2, year: 2017, category: "Animation", image: "https://image.tmdb.org/t/p/w500/eKi8dRgdNj6Bs7vyDIlFVQMkkq9.jpg" },
    { id: 8, title: "The Lion King", rating: 8.5, year: 1994, category: "Animation", image: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsdP5.jpg" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <UserNavBar />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
         {/* Background Image */}
         <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
                backgroundImage: `url(${featuredMovie.image})`,
            }}
         >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
         </div>

         {/* Hero Content */}
         <div className="relative h-full flex items-center max-w-[96rem] mx-auto px-6">
            <div className="max-w-2xl space-y-6 pt-20">
                <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Featured Movie</span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
                    {featuredMovie.title}
                </h1>
                <p className="text-lg text-muted-foreground line-clamp-3">
                    {featuredMovie.description}
                </p>
                <div className="flex items-center gap-4 pt-4">
                    <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25">
                        <Play fill="currentColor" size={20} /> Play Now
                    </button>
                    <button className="bg-secondary/80 backdrop-blur-md text-foreground px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-all border border-white/10">
                        <Info size={20} /> More Info
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* Movie Grid Section */}
      <div className="max-w-[96rem] mx-auto px-6 -mt-20 relative z-10 space-y-12">
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Trending Now
                </h2>
                <button className="text-sm text-primary hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {trendingMovies.map((movie) => (
                    <MovieCard 
                        key={movie.id}
                        title={movie.title}
                        rating={movie.rating}
                        year={movie.year}
                        category={movie.category}
                        image={movie.image}
                    />
                ))}
            </div>
        </section>

        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    New Releases
                </h2>
                <button className="text-sm text-primary hover:underline">View All</button>
            </div>
            {/* Same grid for demo purposes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {trendingMovies.reverse().map((movie) => (
                    <MovieCard 
                        key={movie.id}
                        title={movie.title}
                        rating={movie.rating}
                        year={movie.year}
                        category={movie.category}
                        image={movie.image}
                    />
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
