
import React from 'react';
import type { Wallpaper } from '../types';

interface WallpaperCardProps {
  wallpaper?: Wallpaper;
  isLoading: boolean;
  onSelect?: () => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, isLoading, onSelect }) => {
  if (isLoading) {
    return (
      <div className="aspect-[16/9] bg-slate-700 rounded-lg overflow-hidden animate-pulse">
        <div className="w-full h-full bg-slate-800"></div>
      </div>
    );
  }

  if (!wallpaper) return null;

  return (
    <div
      className="group aspect-[16/9] rounded-xl overflow-hidden cursor-pointer relative shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-cyan-500/20"
      onClick={onSelect}
    >
      <img
        src={wallpaper.sampleUrl}
        alt={wallpaper.tags}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white text-lg font-semibold">View</span>
      </div>
    </div>
  );
};
