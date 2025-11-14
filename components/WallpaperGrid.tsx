import React from 'react';
import type { Wallpaper } from '../types';
import { WallpaperCard } from './WallpaperCard';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  isLoading: boolean;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({ wallpapers, isLoading, onSelectWallpaper }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
      {isLoading &&
        Array.from({ length: 20 }).map((_, index) => (
          <WallpaperCard key={index} isLoading={true} />
        ))}
      {!isLoading &&
        wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            isLoading={false}
            onSelect={() => onSelectWallpaper(wallpaper)}
          />
        ))}
    </div>
  );
};
