import React, { useState, useCallback } from 'react';
import { WallpaperGrid } from './components/WallpaperGrid';
import { PreviewModal } from './components/PreviewModal';
import { Header } from './components/Header';
import { searchWallpapers } from './services/geminiService';
import type { Wallpaper, AspectRatio } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setWallpapers([]);
    setHasSearched(true);

    try {
      const newWallpapers = await searchWallpapers(query, aspectRatio);
      if (newWallpapers.length === 0) {
        setError(`No wallpapers found for "${query}". Please try another search.`);
      } else {
        setWallpapers(newWallpapers);
      }
    } catch (err) {
      console.error('Failed to fetch wallpapers:', err);
      setError('Could not fetch wallpapers. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [aspectRatio]);

  const handleSelectWallpaper = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  const handleCloseModal = () => {
    setSelectedWallpaper(null);
  };

  const ErrorState = () => (
    <div className="flex items-center justify-center h-full -mt-20">
      <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-500 mb-2">An Error Occurred</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <header className="p-4 md:p-8 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
        <Header 
          onSearch={handleSearch} 
          isLoading={isLoading}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
      </header>
      
      <main className="flex-1 p-4 md:px-8 md:pb-8">
        {!hasSearched && !isLoading && <WelcomeScreen />}
        {error && <ErrorState />}
        {(isLoading || wallpapers.length > 0) && !error && (
            <WallpaperGrid
                wallpapers={wallpapers}
                isLoading={isLoading}
                onSelectWallpaper={handleSelectWallpaper}
            />
        )}
      </main>

      {selectedWallpaper && (
        <PreviewModal wallpaper={selectedWallpaper} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;