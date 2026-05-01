'use client';
import React, { useState } from 'react';
import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { Clapperboard, Film, DollarSign, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useMutation, useQuery, gql } from '@apollo/client';
import AdminAlert, { AlertType } from '../AdminAlert';

const CREATE_MOVIE_MUTATION = gql`
  mutation CreateMovie(
    $title: String!
    $originalTitle: String
    $releaseDate: Date
    $runtime: Int!
    $posterBase64: String
    $budget: Int!
    $revenue: Int
    $status: MovieStatus!
    $tagline: String!
    $adult: Boolean!
    $trailerLink: String
    $genreIds: [Int]
  ) {
    createMovie(
      title: $title
      originalTitle: $originalTitle
      releaseDate: $releaseDate
      runtime: $runtime
      posterBase64: $posterBase64
      budget: $budget
      revenue: $revenue
      status: $status
      tagline: $tagline
      adult: $adult
      trailerLink: $trailerLink
      genreIds: $genreIds
    ) {
      success
      message
    }
  }
`;

const UPDATE_MOVIE_MUTATION = gql`
  mutation UpdateMovie(
    $title: String
    $originalTitle: String
    $releaseDate: Date
    $runtime: Int
    $posterBase64: String
    $budget: Int
    $revenue: Int
    $status: MovieStatus
    $tagline: String
    $adult: Boolean
    $trailerLink: String
  ) {
    updateMovie(
      title: $title
      originalTitle: $originalTitle
      releaseDate: $releaseDate
      runtime: $runtime
      posterBase64: $posterBase64
      budget: $budget
      revenue: $revenue
      status: $status
      tagline: $tagline
      adult: $adult
      trailerLink: $trailerLink
    ) {
      success
      message
    }
  }
`;

const GET_GENRES = gql`
  query GetGenres {
    getGenre {
      id
      name
    }
  }
`;

interface MovieUploadFormProps {
  onClose: (alert?: { type: AlertType; message: string } | null) => void;
  movieToEdit?: any;
}

const MovieUploadForm: React.FC<MovieUploadFormProps> = ({ onClose, movieToEdit }) => {
  const [step, setStep] = useState(1);
  const isEditing = !!movieToEdit;
  const [formData, setFormData] = useState({
    title: movieToEdit?.title || '',
    originalTitle: movieToEdit?.originalTitle || '',
    releaseDate: movieToEdit?.releaseDate ? new Date(movieToEdit.releaseDate).toISOString().split('T')[0] : '',
    runtime: movieToEdit?.runtime || 0,
    adult: movieToEdit?.adult || false,
    overview: movieToEdit?.overview || '',
    tagline: movieToEdit?.tagline || '',
    trailerLink: movieToEdit?.trailerLink || '',
    status: movieToEdit?.status || 'IN_PRODUCTION',
    budget: movieToEdit?.budget || 0,
    revenue: movieToEdit?.revenue || 0,
  });

  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>(
    movieToEdit?.MovieGenre?.map((mg: any) => mg.genre) || []
  );
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>(movieToEdit?.posterPath || '');
  const [alertInfo, setAlertInfo] = useState<{ type: AlertType; message: string } | null>(null);

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    const preview = URL.createObjectURL(file);
    setPosterPreview(preview);
  };

  const { data: genreData } = useQuery(GET_GENRES);

  const [createMovie, { loading: creating }] = useMutation(CREATE_MOVIE_MUTATION, {
    onCompleted: (data) => {
      if (data.createMovie.success) {
        setAlertInfo({ type: 'success', message: 'Movie added successfully!' });
        setTimeout(() => onClose({ type: 'success', message: 'Movie added successfully!' }), 1500);
      } else {
        setAlertInfo({ type: 'error', message: data.createMovie.message });
      }
    },
    onError: (error) => {
      setAlertInfo({ type: 'error', message: error.message });
    }
  });

  const [updateMovie, { loading: updating }] = useMutation(UPDATE_MOVIE_MUTATION, {
    onCompleted: (data) => {
      if (data.updateMovie.success) {
        setAlertInfo({ type: 'success', message: 'Movie updated successfully!' });
        setTimeout(() => onClose({ type: 'success', message: 'Movie updated successfully!' }), 1500);
      } else {
        setAlertInfo({ type: 'error', message: data.updateMovie.message });
      }
    },
    onError: (error) => {
      setAlertInfo({ type: 'error', message: error.message });
    }
  });

  const isMutating = creating || updating;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : val }));
  };

  const handleGenreSelect = (genreId: string) => {
    const id = parseInt(genreId);
    if (!id) return;
    const genre = genreData?.getGenre.find((g: any) => g.id === id);
    if (genre && !selectedGenres.find(g => g.id === id)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (id: number) => {
    setSelectedGenres(selectedGenres.filter(g => g.id !== id));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMutating) return;

    let posterBase64: string | undefined;
    if (posterFile) {
      posterBase64 = await readFileAsBase64(posterFile);
    }

    if (isEditing) {
      await updateMovie({
        variables: {
          ...formData,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
          posterBase64,
          // Note: updateMovie doesn't take genreIds natively in the schema yet, but we'll adapt what's there
        }
      });
    } else {
      await createMovie({
        variables: {
          ...formData,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
          posterBase64,
          genreIds: selectedGenres.map(g => g.id),
        }
      });
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { title: 'Core Info', icon: <Film size={18} /> },
    { title: 'Media & Story', icon: <Clapperboard size={18} /> },
    { title: 'Business', icon: <DollarSign size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h1 className="text-2xl font-bold text-primary">{isEditing ? 'Edit Movie' : 'Add New Movie'}</h1>
            <p className="text-zinc-400 text-sm">Step {step} of 3: {steps[step - 1].title}</p>
          </div>
          <button
            onClick={() => onClose()}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 py-4 bg-zinc-950/30">
          {alertInfo && (
            <div className="mb-6">
              <AdminAlert
                type={alertInfo.type}
                message={alertInfo.message}
                onClose={() => setAlertInfo(null)}
              />
            </div>
          )}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-primary text-black ring-4 ring-primary/20' :
                      'bg-zinc-800 text-zinc-500'
                    }`}
                >
                  {step > i + 1 ? <IoMdCheckmark size={20} /> : s.icon}
                </div>
                <span className={`text-xs font-medium ${step === i + 1 ? 'text-primary' : 'text-zinc-500'}`}>
                   {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="movie-form" onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Movie Title *</label>
                    <input
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                      placeholder="e.g. Inception"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Original Title</label>
                    <input
                      name="originalTitle"
                      value={formData.originalTitle}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                      placeholder="Title in original language"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Release Date</label>
                    <input
                      name="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Runtime (min) *</label>
                    <input
                      name="runtime"
                      type="number"
                      required
                      value={formData.runtime || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all"
                      placeholder="120"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <input
                    name="adult"
                    type="checkbox"
                    checked={formData.adult}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-zinc-800 text-orange-500 focus:ring-orange-500 bg-zinc-900"
                  />
                  <div>
                    <label className="text-sm font-semibold block">Adult Content</label>
                    <p className="text-xs text-zinc-500">Check if this movie is for mature audiences only.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Genres</label>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <select
                      onChange={(e) => handleGenreSelect(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-zinc-300 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Select genres...</option>
                      {genreData?.getGenre?.map((g: any) => (
                        <option key={g.id} value={g.id} className="bg-zinc-900">{g.name}</option>
                      ))}
                    </select>

                    {selectedGenres.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                        {selectedGenres.map(genre => (
                          <div
                            key={genre.id}
                            className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95"
                          >
                            {genre.name}
                            <button
                              type="button"
                              onClick={() => removeGenre(genre.id)}
                              className="hover:text-primary/70"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Overview *</label>
                  <textarea
                    name="overview"
                    rows={4}
                    value={formData.overview}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600 resize-none"
                    placeholder="Describe the movie plot..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Tagline *</label>
                  <input
                    name="tagline"
                    required
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                    placeholder="Short catchy hook"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Poster Image</label>
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden">
                      {posterPreview ? (
                        <img src={posterPreview} alt="Poster preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-2xl">🖼️</span>
                          <p className="text-xs text-zinc-500">Click to upload from your computer</p>
                        </div>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {posterFile && (
                      <p className="text-xs text-primary">{posterFile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Trailer URL</label>
                    <input
                      name="trailerLink"
                      value={formData.trailerLink}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                      placeholder="YouTube link"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Production Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="RELEASED">Released</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="POST_PRODUCTION">Post Production</option>
                    <option value="PLANNED">Planned</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RUMORED">Rumored</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Budget ($) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        name="budget"
                        type="number"
                        required
                        value={formData.budget || ''}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-8 focus:border-primary outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">Revenue ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        name="revenue"
                        type="number"
                        value={formData.revenue || ''}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-8 focus:border-primary outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                  <h3 className="font-bold text-primary mb-2">Almost Done!</h3>
                  <p className="text-sm text-zinc-400">
                    Review your entries before submitting. You can go back to any step to make changes.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-between gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-zinc-800 text-zinc-300'
              }`}
          >
            <ChevronLeft size={20} /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-primary hover:opacity-90 text-black px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button
              form="movie-form"
              type="submit"
              disabled={isMutating}
              className="flex items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isMutating ? (isEditing ? 'Updating...' : 'Adding Movie...') : (isEditing ? 'Update Movie' : 'Create Movie')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieUploadForm;
