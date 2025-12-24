
import React, { useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { processImage } from '../js/fotos';

interface PhotoUploadProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  onRemove: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ label, value, onChange, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await processImage(file);
      onChange(base64);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div 
        className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all group ${
          value ? 'border-blue-500' : 'border-slate-200 hover:border-blue-300 bg-slate-50'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white rounded-full text-blue-600 shadow-lg">
                <Upload size={18} />
              </button>
              <button onClick={onRemove} className="p-2 bg-white rounded-full text-rose-600 shadow-lg">
                <X size={18} />
              </button>
            </div>
          </>
        ) : (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Camera size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Selecionar Foto</span>
          </button>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
