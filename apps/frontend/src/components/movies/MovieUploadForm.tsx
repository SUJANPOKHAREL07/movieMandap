'use client';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

const MovieUploadForm = () => {
  return (
    <div className="flex flex-col min-h-screen  fixed top-0 w-full left-0 backdrop-blur-md  justify-center items-center">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto   space-y-5 text-background bg-foreground p-5 rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Add New Movie</h1>
          <button className="border-2 rounded-full border-orange-500 text-orange-500 p-1  ">
            <IoMdClose size={20} />
          </button>
        </div>
        <form className="space-y-4">
          {/* Title and Original Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="Enter movie title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Original Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="Enter original title"
              />
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium mb-1">Overview *</label>
            <textarea
              rows={4}
              className="w-full rounded-md border p-2 bg-transparent"
              placeholder="Write a short overview..."
            ></textarea>
          </div>

          {/* Release Date and Runtime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Release Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border p-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Runtime (minutes)
              </label>
              <input
                type="number"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Poster URL</label>
            <input
              type="url"
              className="w-full rounded-md border p-2 bg-transparent"
              placeholder="https://..."
            />
          </div>

          {/* Budget and Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Revenue ($)
              </label>
              <input
                type="number"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Status and Adult Content */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Status</label>
              <input
                type="text"
                className="w-full rounded-md border p-2 bg-transparent"
                placeholder="Released"
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm">Adult Content</label>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input
              type="text"
              className="w-full rounded-md border p-2 bg-transparent"
              placeholder="Enter tagline"
            />
          </div>

          {/* Trailer Link */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Trailer Link
            </label>
            <input
              type="url"
              className="w-full rounded-md border p-2 bg-transparent"
              placeholder="https://youtube.com/..."
            />
          </div>

          {/* Button */}
          <button type="submit" className="w-full py-2 bg-orange-500 hover:bg-orange-600 duration-200 rounded-md font-medium">
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieUploadForm;
