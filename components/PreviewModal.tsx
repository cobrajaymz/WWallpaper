import React, { useCallback, useEffect } from 'react';
import type { Wallpaper } from '../types';
import { DownloadIcon, CloseIcon } from './icons/ActionIcons';

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

interface PreviewModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ wallpaper, onClose }) => {
  
  const handleDownload = async () => {
    try {
      // Use CORS proxy for fetching the image blob
      const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(wallpaper.fileUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = blob.type.split('/')[1] || 'jpg';
      link.download = `wallpaper-${wallpaper.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback for CORS issues or other errors: open the image in a new tab.
      window.open(wallpaper.fileUrl, '_blank');
    }
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-full flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex-shrink-0 flex items-center justify-between border-b border-slate-700">
            <p className="text-xs text-slate-400 italic flex-1 truncate pr-4" title={wallpaper.tags}>
              Tags: "{wallpaper.tags}"
            </p>
            <div className="flex items-center space-x-2">
                 <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download
                </button>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    <CloseIcon className="w-6 h-6 text-slate-400" />
                </button>
            </div>
        </div>

        <div className="flex-1 p-2 bg-slate-900 overflow-hidden">
          <img
            src={wallpaper.fileUrl}
            alt={wallpaper.tags}
            className="w-full h-full object-contain"
          />
        </div>

         <div className="p-3 text-center bg-slate-800 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              To set as wallpaper on Windows 11, download the image, then right-click it and choose "Set as desktop background".
            </p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};