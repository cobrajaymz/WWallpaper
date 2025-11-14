import React, { useState } from 'react';
import { PRESET_TAGS, ASPECT_RATIOS } from '../constants';
import type { AspectRatio } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, isLoading, aspectRatio, onAspectRatioChange }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePresetClick = (tag: string) => {
    setQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
        Wallpaper Finder
      </h1>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for wallpapers..."
            disabled={isLoading}
            className="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            aria-label="Search for wallpapers"
          />
          <button type="submit" className="absolute inset-y-0 right-0 px-3 flex items-center" disabled={isLoading} aria-label="Search">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
        {PRESET_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => handlePresetClick(tag)}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-full text-sm font-medium hover:bg-cyan-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center flex-wrap gap-2 mt-4 pt-2 border-t border-slate-800">
        <span className="text-sm text-slate-400 mr-2">Aspect Ratio:</span>
        {ASPECT_RATIOS.map(ratio => (
          <button
            key={ratio}
            onClick={() => onAspectRatioChange(ratio)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              aspectRatio === ratio
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

    </div>
  );
};