import React from 'react';
import { Archive } from 'lucide-react';

interface DropzoneOverlayProps {
  isDragging: boolean;
}

export const DropzoneOverlay: React.FC<DropzoneOverlayProps> = ({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 bg-sky-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-sky-400 pointer-events-none animate-in fade-in duration-150">
      <div className="w-20 h-20 rounded-3xl bg-sky-500/30 border border-sky-400 flex items-center justify-center text-sky-300 shadow-2xl shadow-sky-500/40 mb-4 animate-bounce">
        <Archive className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Drop Your .zip File Here
      </h2>
      <p className="text-sm text-sky-200 mt-1">
        Release to immediately extract, inspect files, and generate live previews
      </p>
    </div>
  );
};
