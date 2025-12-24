
import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Calendar, Info, Scale, CheckCircle2 } from 'lucide-react';
import { Assessment, Patient } from '../types';

interface ComparisonSelectorProps {
  patient: Patient;
  assessments: Assessment[];
  onCompare: (a1: Assessment, a2: Assessment) => void;
  onBack: () => void;
}

const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({ patient, assessments, onCompare, onBack }) => {
  const [selectedAId, setSelectedAId] = useState<string | null>(null);
  const [selectedBId, setSelectedBId] = useState<string | null>(null);

  // Ordenar todas as avaliações por data (mais recente primeiro para facilitar a escolha)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleCompare = () => {
    const a1 = assessments.find(a => a.id === selectedAId);
    const a2 = assessments.find(a => a.id === selectedBId);
    
    if (a1 && a2) {
      // Determinar automaticamente quem é o "Antes" e o "Depois"
      const date1 = new Date(a1.date).getTime();
      const date2 = new Date(a2.date).getTime();
      
      if (date1 < date2) {
        onCompare(a1, a2);
      } else {
        onCompare(a2, a1);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500 px-4 pb-20">
      {/* Header do Seletor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack} 
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl text-slate-500 border border-slate-200 shadow-sm transition-all hover:text-blue-600 group"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
              Análise de <span className="text-blue-600">Evolução</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium">Selecione duas datas diferentes para comparar o progresso de {patient.name}.</p>
          </div>
        </div>
      </div>

      {/* Grid de Seleção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
        {/* Ícone Central VS */}
        <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-slate-900 shadow-2xl items-center justify-center text-white ring-[12px] ring-slate-50">
          <ArrowRightLeft size={24} className="animate-pulse" />
        </div>

        {/* Coluna 1: Momento A */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Seleção 01</h3>
            {selectedAId && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Ativo
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedAssessments.map(a => (
              <AssessmentCard 
                key={`a-${a.id}`}
                assessment={a}
                isSelected={selectedAId === a.id}
                isDisabled={selectedBId === a.id}
                onClick={() => setSelectedAId(a.id)}
              />
            ))}
          </div>
        </div>

        {/* Coluna 2: Momento B */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Seleção 02</h3>
            {selectedBId && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Ativo
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedAssessments.map(a => (
              <AssessmentCard 
                key={`b-${a.id}`}
                assessment={a}
                isSelected={selectedBId === a.id}
                isDisabled={selectedAId === a.id}
                accent
                onClick={() => setSelectedBId(a.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé com Botão de Ação */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 max-w-2xl w-full">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedAId && selectedBId ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <Info size={20} />
          </div>
          <p className="text-sm text-slate-600 font-medium text-center">
            {selectedAId && selectedBId 
              ? "Perfeito! Agora podemos gerar o comparativo completo de bioimpedância e evolução visual."
              : "Escolha dois registros acima para habilitar o botão de análise comparativa."}
          </p>
        </div>

        <button 
          disabled={!selectedAId || !selectedBId}
          onClick={handleCompare}
          className={`group relative w-full max-w-md py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all overflow-hidden ${
            selectedAId && selectedBId 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Scale size={20} />
          Gerar Comparativo
        </button>
      </div>
    </div>
  );
};

const AssessmentCard: React.FC<{ 
  assessment: Assessment, 
  isSelected: boolean, 
  isDisabled: boolean,
  accent?: boolean,
  onClick: () => void 
}> = ({ assessment, isSelected, isDisabled, accent, onClick }) => (
  <button 
    disabled={isDisabled}
    onClick={onClick}
    className={`w-full p-5 rounded-[2.2rem] border-2 transition-all text-left flex items-center justify-between group relative overflow-