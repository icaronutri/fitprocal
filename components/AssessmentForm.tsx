
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Save, AlertCircle, ChevronRight, ChevronLeft, Camera } from 'lucide-react';
import { Patient, Assessment, Skinfolds, AssessmentPhotos } from '../types';
import { calculateBodyDensity, calculateBodyFatPercentage, getAge } from '../js/dobras';
import PhotoUpload from './PhotoUpload';

interface AssessmentFormProps {
  patient: Patient;
  onCancel: () => void;
  onSubmit: (assessment: Assessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ patient, onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState(80);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<AssessmentPhotos>({});
  const [skinfolds, setSkinfolds] = useState<Skinfolds>({
    triceps: 0, subscapular: 0, biceps: 0, midAxillary: 0, suprailiac: 0, abdominal: 0, thigh: 0
  });

  const [metrics, setMetrics] = useState({
    bodyDensity: 0,
    bodyFatPercentage: 0,
    fatMassKg: 0,
    leanMassKg: 0,
    sumSkinfolds: 0
  });

  useEffect(() => {
    const sum = (Object.values(skinfolds) as number[]).reduce((a, b) => a + b, 0);
    const age = getAge(patient.birthDate);
    const density = calculateBodyDensity(sum, age, patient.gender);
    const fatPercentage = calculateBodyFatPercentage(density);
    const fatMass = (weight * fatPercentage) / 100;
    const leanMass = weight - fatMass;

    setMetrics({
      bodyDensity: density,
      bodyFatPercentage: parseFloat(fatPercentage.toFixed(2)),
      fatMassKg: parseFloat(fatMass.toFixed(2)),
      leanMassKg: parseFloat(leanMass.toFixed(2)),
      sumSkinfolds: sum
    });
  }, [skinfolds, weight, patient]);

  const handleSave = () => {
    const assessment: Assessment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      weight,
      skinfolds,
      metrics,
      photos,
      notes
    };
    onSubmit(assessment);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-right-8 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl text-slate-500 border border-transparent hover:border-slate-200 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Nova Avaliação</h2>
            <p className="text-slate-500">Paciente: <span className="font-semibold text-slate-700">{patient.name}</span></p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {step === 1 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                Dados Básicos & Dobras
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Peso Atual (kg)</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={weight} onChange={e => setWeight(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Data</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.keys(skinfolds).map((key) => (
                  <SkinfoldInput key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={skinfolds[key as keyof Skinfolds]} onChange={v => setSkinfolds({...skinfolds, [key]: v})} />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                Registro Fotográfico
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <PhotoUpload label="Frente" value={photos.front} onChange={v => setPhotos({...photos, front: v})} onRemove={() => setPhotos({...photos, front: undefined})} />
                <PhotoUpload label="Costas" value={photos.back} onChange={v => setPhotos({...photos, back: v})} onRemove={() => setPhotos({...photos, back: undefined})} />
                <PhotoUpload label="Lado Dir." value={photos.sideRight} onChange={v => setPhotos({...photos, sideRight: v})} onRemove={() => setPhotos({...photos, sideRight: undefined})} />
                <PhotoUpload label="Lado Esq." value={photos.sideLeft} onChange={v => setPhotos({...photos, sideLeft: v})} onRemove={() => setPhotos({...photos, sideLeft: undefined})} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Quase lá!</h3>
              <p className="text-slate-500 mb-8">Revise os cálculos e adicione observações finais.</p>
              <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none mb-4" placeholder="Observações clínicas adicionais..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2">
                <ChevronLeft size={20} /> Anterior
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                Próximo <ChevronRight size={20} />
              </button>
            ) : (
              <button onClick={handleSave} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                <Save size={20} /> Finalizar & Salvar
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                <Calculator className="text-blue-400" />
                <h3 className="font-bold text-xl">Preview</h3>
              </div>
              <div className="space-y-6">
                <ResultItem label="% Gordura" value={`${metrics.bodyFatPercentage}%`} highlight />
                <div className="grid grid-cols-2 gap-4">
                  <ResultItem label="Peso" value={`${weight}kg`} />
                  <ResultItem label="M. Magra" value={`${metrics.leanMassKg}kg`} />
                </div>
                <ResultItem label="Soma Dobras" value={`${metrics.sumSkinfolds}mm`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkinfoldInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none pr-12 font-medium focus:ring-2 focus:ring-blue-100 transition-all" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">mm</span>
    </div>
  </div>
);

const ResultItem: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className={`font-bold ${highlight ? 'text-4xl text-blue-400' : 'text-xl text-white'}`}>{value}</p>
  </div>
);

export default AssessmentForm;
