
import React, { useState } from 'react';
import { 
  ArrowLeft, TrendingDown, TrendingUp, Minus, CheckCircle, XCircle, 
  LayoutGrid, Columns, Maximize2, Download, FileText, Move, Scale, Calendar
} from 'lucide-react';
import { Assessment, Patient } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface ComparisonViewProps {
  patient: Patient;
  a1: Assessment;
  a2: Assessment;
  onBack: () => void;
}

type ComparisonMode = 'split' | 'slider' | 'grid';
type Angle = 'front' | 'back' | 'sideRight' | 'sideLeft';

const ComparisonView: React.FC<ComparisonViewProps> = ({ patient, a1, a2, onBack }) => {
  const [activeAngle, setActiveAngle] = useState<Angle>('front');
  const [viewMode, setViewMode] = useState<ComparisonMode>('split');
  const [sliderPos, setSliderPos] = useState(50);

  // Garantir ordem cronológica: antes -> depois
  const before = new Date(a1.date) < new Date(a2.date) ? a1 : a2;
  const after = before === a1 ? a2 : a1;

  const diffWeight = after.weight - before.weight;
  const diffFat = after.metrics.bodyFatPercentage - before.metrics.bodyFatPercentage;
  const diffLean = after.metrics.leanMassKg - before.metrics.leanMassKg;
  const diffSum = after.metrics.sumSkinfolds - before.metrics.sumSkinfolds;

  const getStatus = (diff: number, inverse = false) => {
    if (Math.abs(diff) < 0.01) return { icon: '➡️', color: 'text-slate-400', bg: 'bg-slate-50' };
    const isGood = inverse ? diff > 0 : diff < 0;
    return isGood 
      ? { icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' }
      : { icon: '⚠️', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const skinfoldData = [
    { name: 'Tríceps', antes: before.skinfolds.triceps, depois: after.skinfolds.triceps },
    { name: 'Subesc.', antes: before.skinfolds.subscapular, depois: after.skinfolds.subscapular },
    { name: 'Bíceps', antes: before.skinfolds.biceps, depois: after.skinfolds.biceps },
    { name: 'Axilar', antes: before.skinfolds.midAxillary, depois: after.skinfolds.midAxillary },
    { name: 'Suprail.', antes: before.skinfolds.suprailiac, depois: after.skinfolds.suprailiac },
    { name: 'Abdom.', antes: before.skinfolds.abdominal, depois: after.skinfolds.abdominal },
    { name: 'Coxa', antes: before.skinfolds.thigh, depois: after.skinfolds.thigh },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 px-4">
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-white rounded-xl text-slate-500 border border-slate-200 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Antes <span className="text-blue-600">vs</span> Depois</h1>
            <p className="text-sm text-slate-500 font-medium">Análise Comparativa • {patient.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2">
            <Download size={18} /> Exportar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-blue-700">
            <FileText size={18} /> Relatório PDF
          </button>
        </div>
      </header>

      {/* SEÇÃO 1: MÉTRICAS (ESTILO QUADRO NEGRO) */}
      <section className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-100">
          {/* COLUNA ANTES */}
          <div className="p-8 text-center bg-slate-50/50">
            <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-6">Estado Inicial</h3>
            <div className="space-y-4">
              <MetricBox label="Data" value={new Date(before.date).toLocaleDateString()} />
              <MetricBox label="Peso" value={`${before.weight} kg`} highlight />
              <MetricBox label="% Gordura" value={`${before.metrics.bodyFatPercentage}%`} />
              <MetricBox label="Soma Dobras" value={`${before.metrics.sumSkinfolds} mm`} />
            </div>
          </div>

          {/* COLUNA DEPOIS */}
          <div className="p-8 text-center">
            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Estado Atual</h3>
            <div className="space-y-4">
              <MetricBox label="Data" value={new Date(after.date).toLocaleDateString()} />
              <MetricBox label="Peso" value={`${after.weight} kg`} highlight />
              <MetricBox label="% Gordura" value={`${after.metrics.bodyFatPercentage}%`} />
              <MetricBox label="Soma Dobras" value={`${after.metrics.sumSkinfolds} mm`} />
            </div>
          </div>

          {/* COLUNA VARIAÇÃO */}
          <div className="p-8 text-center bg-blue-50/30">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6">Evolução Líquida</h3>
            <div className="space-y-4">
              <MetricBox label="Período" value={`${Math.round((new Date(after.date).getTime() - new Date(before.date).getTime()) / (1000 * 3600 * 24))} dias`} />
              <VariationBox label="Peso" value={diffWeight} unit="kg" status={getStatus(diffWeight)} />
              <VariationBox label="% Gordura" value={diffFat} unit="%" status={getStatus(diffFat)} />
              <VariationBox label="Soma Dobras" value={diffSum} unit="mm" status={getStatus(diffSum)} />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: COMPARAÇÃO VISUAL */}
      <section className="space-y-8">
        {/* SELETORES */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-3 rounded-[2rem] border border-slate-200 shadow-xl">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <AngleSelector active={activeAngle === 'front'} label="Frente" onClick={() => setActiveAngle('front')} />
            <AngleSelector active={activeAngle === 'back'} label="Costas" onClick={() => setActiveAngle('back')} />
            <AngleSelector active={activeAngle === 'sideRight'} label="Lat. Dir." onClick={() => setActiveAngle('sideRight')} />
            <AngleSelector active={activeAngle === 'sideLeft'} label="Lat. Esq." onClick={() => setActiveAngle('sideLeft')} />
          </div>

          <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <ModeSelector active={viewMode === 'split'} icon={<Columns size={18} />} label="Split" onClick={() => setViewMode('split')} />
            <ModeSelector active={viewMode === 'slider'} icon={<Move size={18} />} label="Slider" onClick={() => setViewMode('slider')} />
            <ModeSelector active={viewMode === 'grid'} icon={<LayoutGrid size={18} />} label="Grade" onClick={() => setViewMode('grid')} />
          </div>
        </div>

        {/* ÁREA DE EXIBIÇÃO */}
        <div className="relative min-h-[600px] flex items-center justify-center">
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-in zoom-in-95 duration-300">
              <PhotoDisplay label="ANTES" photo={before.photos?.[activeAngle]} date={before.date} />
              <PhotoDisplay label="DEPOIS" photo={after.photos?.[activeAngle]} date={after.date} accent />
            </div>
          )}

          {viewMode === 'slider' && (
            <div className="max-w-xl w-full animate-in zoom-in-95 duration-300">
              <RevealSlider 
                before={before.photos?.[activeAngle]} 
                after={after.photos?.[activeAngle]} 
                pos={sliderPos} 
                onChange={setSliderPos} 
              />
              <p className="mt-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Arraste para comparar os detalhes</p>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-in zoom-in-95 duration-300">
              <PhotoDisplay label="FR ANTES" photo={before.photos?.front} small />
              <PhotoDisplay label="FR DEPOIS" photo={after.photos?.front} small accent />
              <PhotoDisplay label="CO ANTES" photo={before.photos?.back} small />
              <PhotoDisplay label="CO DEPOIS" photo={after.photos?.back} small accent />
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 3: GRÁFICO DE DOBRAS */}
      <section className="mt-20 bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">Distribuição de Gordura por Ponto (mm)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skinfoldData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="mm" />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
              />
              <Bar dataKey="antes" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={32} />
              <Bar dataKey="depois" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

// COMPONENTES AUXILIARES INTERNOS

const MetricBox: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`font-black ${highlight ? 'text-2xl text-slate-900' : 'text-lg text-slate-600'}`}>{value}</span>
  </div>
);

const VariationBox: React.FC<{ label: string, value: number | string, unit?: string, status: any }> = ({ label, value, unit = '', status }) => {
  const isString = typeof value === 'string';
  const displayValue = isString ? value : (value > 0 ? `+${value.toFixed(1)}` : `${value.toFixed(1)}`);
  
  return (
    <div className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${status.bg} border-transparent hover:border-blue-200`}>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={`font-black text-xl ${status.color}`}>
        {displayValue}{unit} {status.icon}
      </span>
    </div>
  );
};

const PhotoDisplay: React.FC<{ label: string, photo?: string, date?: string, accent?: boolean, small?: boolean }> = ({ label, photo, date, accent, small }) => (
  <div className="space-y-3">
    <div className={`relative rounded-[2.5rem] overflow-hidden border-8 shadow-2xl transition-all ${accent ? 'border-emerald-500 ring-8 ring-emerald-50' : 'border-white'} ${small ? 'aspect-square' : 'aspect-[3/4]'}`}>
      {photo ? (
        <img src={photo} className="w-full h-full object-cover" alt={label} />
      ) : (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
          <Maximize2 size={small ? 24 : 64} className="opacity-10" />
        </div>
      )}
      <div className="absolute top-6 left-6">
        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl backdrop-blur-lg ${accent ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          {label}
        </div>
      </div>
      {date && (
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-[10px] font-black text-white px-4 py-2 rounded-xl">
          {new Date(date).toLocaleDateString()}
        </div>
      )}
    </div>
  </div>
);

const RevealSlider: React.FC<{ before?: string, after?: string, pos: number, onChange: (v: number) => void }> = ({ before, after, pos, onChange }) => (
  <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-slate-200 group">
    <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="Depois" />
    <div 
      className="absolute inset-y-0 left-0 overflow-hidden border-r-4 border-white shadow-2xl" 
      style={{ width: `${pos}%` }}
    >
      <div className="w-[100vw] h-full relative">
        <img src={before} className="absolute inset-y-0 left-0 object-cover h-full" style={{ width: 'min(576px, 90vw)' }} alt="Antes" />
      </div>
    </div>
    <div 
      className="absolute inset-y-0 pointer-events-none flex items-center justify-center" 
      style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
    >
      <div className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-blue-600 ring-8 ring-blue-600/10 pointer-events-auto cursor-ew-resize">
        <Move size={24} />
      </div>
    </div>
    <input 
      type="range" min="0" max="100" value={pos} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
    />
    <div className="absolute top-8 left-8 z-10">
      <span className="bg-white/90 backdrop-blur-md text-[11px] font-black text-slate-800 px-5 py-2.5 rounded-2xl uppercase tracking-widest shadow-xl">Antes</span>
    </div>
    <div className="absolute top-8 right-8 z-10">
      <span className="bg-blue-600 text-[11px] font-black text-white px-5 py-2.5 rounded-2xl uppercase tracking-widest shadow-xl">Depois</span>
    </div>
  </div>
);

const AngleSelector: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${active ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
    {label}
  </button>
);

const ModeSelector: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} <span className="hidden lg:inline">{label}</span>
  </button>
);

export default ComparisonView;
