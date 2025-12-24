
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
  const [selectedBeforeId, setSelectedBeforeId] = useState<string | null>(null);
  const [selectedAfterId, setSelectedAfterId] = useState<string | null>(null);

  // Ordenar todas as avaliações por data (mais antiga primeiro)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleCompare = () => {
    const a1 = assessments.find(a => a.id === selectedBeforeId);
    const a2 = assessments.find(a => a.id === selectedAfterId);
    if (a1 && a2) {
      onCompare(a1, a2);
    }
  };

  // Avaliações disponíveis para o "Depois" (devem ser posteriores à selecionada no "Antes")
  const availableAfterAssessments = sortedAssessments.filter(a => {
    if (!selectedBeforeId) return true;
    const beforeAssessment = sortedAssessments.find(x => x.id === selectedBeforeId);
    return new Date(a.date) > new Date(beforeAssessment!.date);
  });

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
            <p className="text-sm text-slate-500 font-medium">Selecione dois momentos para comparar o progresso de {patient.name}.</p>
          </div>
        </div>
      </div>

      {/* Grid de Seleção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
        {/* Ícone Central VS */}
        <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-slate-900 shadow-2xl items-center justify-center text-white ring-[12px] ring-slate-50">
          <ArrowRightLeft size={24} className="animate-pulse" />
        </div>

        {/* Coluna 1: Avaliação Base (Antes) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">1. Avaliação de Referência (Antiga)</h3>
            {selectedBeforeId && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Selecionado
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedAssessments.length > 0 ? sortedAssessments.map(a => (
              <AssessmentCard 
                key={a.id}
                assessment={a}
                isSelected={selectedBeforeId === a.id}
                isDisabled={selectedAfterId === a.id}
                onClick={() => {
                  setSelectedBeforeId(a.id);
                  // Resetar o "depois" se ele se tornar inválido (anterior ao novo "antes")
                  if (selectedAfterId) {
                    const afterA = assessments.find(x => x.id === selectedAfterId);
                    if (new Date(afterA!.date) <= new Date(a.date)) {
                      setSelectedAfterId(null);
                    }
                  }
                }}
              />
            )) : (
              <EmptyState message="Nenhuma avaliação encontrada" />
            )}
          </div>
        </div>

        {/* Coluna 2: Avaliação Alvo (Depois) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">2. Avaliação de Comparação (Recente)</h3>
            {selectedAfterId && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Selecionado
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {availableAfterAssessments.length > 0 ? availableAfterAssessments.map(a => (
              <AssessmentCard 
                key={a.id}
                assessment={a}
                isSelected={selectedAfterId === a.id}
                isDisabled={selectedBeforeId === a.id}
                accent
                onClick={() => setSelectedAfterId(a.id)}
              />
            )) : (
              <EmptyState message={selectedBeforeId ? "Nenhuma avaliação posterior disponível" : "Selecione a avaliação de referência primeiro"} />
            )}
          </div>
        </div>
      </div>

      {/* Rodapé com Botão de Ação */}
      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 max-w-2xl w-full">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedBeforeId && selectedAfterId ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <Info size={20} />
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {selectedBeforeId && selectedAfterId 
              ? `Comparando evolução de ${new Date(assessments.find(a => a.id === selectedBeforeId)!.date).toLocaleDateString()} até ${new Date(assessments.find(a => a.id === selectedAfterId)!.date).toLocaleDateString()}.`
              : "Selecione dois momentos distintos para visualizar a análise completa de bioimpedância e fotos."}
          </p>
        </div>

        <button 
          disabled={!selectedBeforeId || !selectedAfterId}
          onClick={handleCompare}
          className={`group relative w-full max-w-md py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all overflow-hidden ${
            selectedBeforeId && selectedAfterId 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Scale size={20} />
          Gerar Análise Comparativa
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
    className={`w-full p-5 rounded-[2.2rem] border-2 transition-all text-left flex items-center justify-between group relative overflow-hidden ${
      isSelected 
        ? (accent ? 'border-blue-600 bg-blue-50/30 ring-4 ring-blue-50 shadow-xl' : 'border-slate-800 bg-white shadow-2xl ring-4 ring-slate-100')
        : isDisabled 
          ? 'opacity-40 grayscale border-slate-100 cursor-not-allowed bg-slate-50'
          : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg'
    }`}
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? (accent ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white') : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
        <Calendar size={22} />
      </div>
      <div>
        <p className={`font-black text-sm uppercase tracking-tight transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
          {new Date(assessment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{assessment.weight} kg</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span className={`text-[10px] font-black uppercase tracking-widest ${accent ? 'text-blue-600' : 'text-slate-500'}`}>
            {assessment.metrics.bodyFatPercentage}% Gordura
          </span>
        </div>
      </div>
    </div>
    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? (accent ? 'border-blue-600 bg-blue-600 shadow-inner' : 'border-slate-900 bg-slate-900') : 'border-slate-200 group-hover:border-blue-300'}`}>
      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white animate-in zoom-in" />}
    </div>
  </button>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-16 border-2 border-dashed border-slate-100 rounded-[3rem] text-center bg-slate-50/30 flex flex-col items-center justify-center px-8">
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-200 mb-4 shadow-sm">
      <Calendar size={20} />
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">{message}</p>
  </div>
);

export default ComparisonSelector;
