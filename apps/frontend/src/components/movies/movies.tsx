'use client';

import React, { useState } from 'react';
import MovieUploadForm from './MovieUploadForm';
import { IoSearchOutline} from 'react-icons/io5';

const Movies = () => {
  const [isOpen, setisOpen] = useState(false);

  return (
    <section className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-4">
            Movies Management
          </h1>
          <p className="text-muted-foreground">
            Manage all your movie listings, add new films, and edit existing
            ones here.
          </p>
        </div>

        <button
          onClick={() => setisOpen(!isOpen)}
          className="bg-orange-500 px-5 py-2 text-lg font-semibold hover:bg-orange-600 duration-200 rounded"
        >
          {' '}
          + Add Movie
        </button>
      </div>

      {isOpen && (
        <div className="">
          <MovieUploadForm />
        </div>
      )}

      {/* Filter and Searchbar */}
      <div className="border p-5 rounded-2xl flex items-center">
       <IoSearchOutline size={25} color='gray' />
        <input

          type="text"
          placeholder="Search movies by title or overview"
          className="w-full bg-transparent rounded-2xl focus:ring-0 p-2  outline-none"
        />
      </div>
    </section>
  );
};

export default Movies;
