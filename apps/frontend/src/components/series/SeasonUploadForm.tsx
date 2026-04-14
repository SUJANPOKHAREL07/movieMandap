'use client';

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { X, Tv, UploadCloud, Loader2 } from 'lucide-react';

const ADD_SEASON = gql`
  mutation AddSeason(
    $seriesId: Int!
    $seasonNumber: Int!
    $title: String
    $overview: String
    $airDate: String
    $episodeCount: Int
    $posterBase64: String
  ) {
    addSeason(
      seriesId: $seriesId
      seasonNumber: $seasonNumber
      title: $title
      overview: $overview
      airDate: $airDate
      episodeCount: $episodeCount
      posterBase64: $posterBase64
    ) {
      success
      message
    }
  }
`;

interface SeasonUploadFormProps {
    seriesId: number;
    seriesTitle: string;
    onClose: () => void;
}

export default function SeasonUploadForm({ seriesId, seriesTitle, onClose }: SeasonUploadFormProps) {
    const [formData, setFormData] = useState({
        seasonNumber: '',
        title: '',
        overview: '',
        airDate: '',
        episodeCount: '',
    });

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [addSeason, { loading }] = useMutation(ADD_SEASON);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let posterBase64 = undefined;
            if (posterFile) {
                posterBase64 = await getBase64(posterFile);
            }

            await addSeason({
                variables: {
                    seriesId,
                    seasonNumber: parseInt(formData.seasonNumber),
                    title: formData.title || undefined,
                    overview: formData.overview || undefined,
                    episodeCount: formData.episodeCount ? parseInt(formData.episodeCount) : undefined,
                    airDate: formData.airDate || undefined,
                    posterBase64,
                },
            });

            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to add season. Check console.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                            <Tv size={20} /> Add Season
                        </h2>
                        <p className="text-sm text-muted-foreground">Adding season to "{seriesTitle}"</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="season-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">

                            {/* Image Upload */}
                            <div className="shrink-0">
                                <label className="block text-sm font-semibold mb-2">Poster</label>
                                <div className="relative w-40 aspect-[2/3] rounded-xl overflow-hidden bg-secondary border-2 border-dashed border-border hover:border-purple-500/50 transition-colors group cursor-pointer flex flex-col items-center justify-center">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-purple-400 transition-colors px-4 text-center">
                                            <UploadCloud size={32} />
                                            <span className="text-xs font-semibold">Upload Poster</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Season Number*</label>
                                        <input
                                            type="number" required placeholder="e.g. 1" min="1"
                                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            value={formData.seasonNumber} onChange={e => setFormData({ ...formData, seasonNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Episode Count</label>
                                        <input
                                            type="number" placeholder="e.g. 8" min="0"
                                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            value={formData.episodeCount} onChange={e => setFormData({ ...formData, episodeCount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Season Title (Optional)</label>
                                    <input
                                        type="text" placeholder="e.g. Volume 1"
                                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Air Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        value={formData.airDate} onChange={e => setFormData({ ...formData, airDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Overview</label>
                            <textarea
                                rows={4} placeholder="What happens in this season?"
                                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                                value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-secondary/30 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-semibold rounded-lg hover:bg-secondary transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit" form="season-form" disabled={loading}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Season'}
                    </button>
                </div>

            </div>
        </div>
    );
}
