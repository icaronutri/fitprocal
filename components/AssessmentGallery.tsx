
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Share2 } from 'lucide-react';
import { Assessment, AssessmentPhotos } from '../types';

interface AssessmentGalleryProps {
  assessment: Assessment;
  onClose: () => void;
}

const AssessmentGallery: React.FC<AssessmentGalleryProps> = ({ assessment, onClose }) => {
  const [activePhoto, setActivePhoto] = useState<keyof AssessmentPhotos | null>(null);
  
  const photoKeys: (keyof AssessmentPhotos)[] = ['front', 'back', 'sideRight', 'sideLeft'];
  const labels: Record<string, string> = { front: 'Frente', back: 'Costas', sideRight: 'Lado Direito', sideLeft: 'Lado Esquerdo' };

  const photos = assessment.photos || {};

  const handleNext = () => {
    if (!activePhoto) return;
    const idx = photoKeys.indexOf(activePhoto);
    setActivePhoto(photoKeys[(idx + 1) % photoKeys.length]);
  };

  const handlePrev = () => {
    if (!activePhoto) return;
    const idx = photoKeys.indexOf(activePhoto);
    setActivePhoto(photoKeys[(idx - 1 + photoKeys.length) % photoKeys.length]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Galeria de Fotos</h2>
          <p className="text-slate-500">Avaliação de {new Date(assessment.date).toLocaleDateString()}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 border border-slate-200">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {photoKeys.map(key => (
          <div key={key} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
            <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
              {photos[key] ? (
                <>
                  <img src={photos[key]} alt={labels[key]} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => setActivePhoto(key)} className="p-3 bg-white rounded-full text-blue-600 shadow-xl">
                      <Maximize2 size={20} />
                    </button>
                    <a href={photos[key]} download={`avaliacao-${key}.jpg`} className="p-3 bg-white rounded-full text-slate-600 shadow-xl">
                      <Download size={20} />
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sem Foto</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{labels[key]}</span>
              <button className="text-slate-400 hover:text-blue-600">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200">
          <button onClick={() => setActivePhoto(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full">
            <X size={24} />
          </button>
          
          <button onClick={handlePrev} className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
            <ChevronLeft size={32} />
          </button>
          
          <div className="max-w-4xl w-full h-full flex flex-col items-center justify-center gap-4">
            <img src={photos[activePhoto]} className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain" />
            <p className="text-white font-bold uppercase tracking-widest">{labels[activePhoto]}</p>
          </div>

          <button onClick={handleNext} className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

const ImageIcon: React.FC<{ size?: number, className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default AssessmentGallery;
