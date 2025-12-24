
import React from 'react';
import { ArrowLeft, Plus, History, TrendingUp, Calendar, ArrowRight, Apple, Columns, Image as ImageIcon } from 'lucide-react';
import { Patient, Assessment } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  AreaChart, Area 
} from 'recharts';

interface PatientDetailsProps {
  patient: Patient;
  assessments: Assessment[];
  onNewAssessment: () => void;
  onBack: () => void;
  onMealPlanner: () => void;
  onComparison: () => void;
  onViewGallery: (id: string) => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ 
  patient, assessments, onNewAssessment, onBack, onMealPlanner, onComparison, onViewGallery 
}) => {
  const sortedAssessments = [...assessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestAssessment = sortedAssessments[0];

  // Radar data from latest assessment
  const radarData = latestAssessment ? [
    { subject: 'Triceps', A: latestAssessment.skinfolds.triceps },
    { subject: 'Subesc.', A: latestAssessment.skinfolds.subscapular },
    { subject: 'Biceps', A: latestAssessment.skinfolds.biceps },
    { subject: 'Axilar', A: latestAssessment.skinfolds.midAxillary },
    { subject: 'Suprail.', A: latestAssessment.skinfolds.suprailiac },
    { subject: 'Abdom.', A: latestAssessment.skinfolds.abdominal },
    { subject: 'Coxa', A: latestAssessment.skinfolds.thigh },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-xl text-slate-500 border border-transparent hover:border-slate-200">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-100">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{patient.name}</h2>
              <p className="text-slate-500 font-medium">{patient.gender === 'M' ? 'Masculino' : 'Feminino'} • {patient.height}cm</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {sortedAssessments.length >= 2 && (
            <button 
              onClick={onComparison}
              className="bg-white text-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Columns size={18} />
              Antes / Depois
            </button>
          )}
          <button 
            onClick={onMealPlanner}
            className="bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            <Apple size={18} /> Dietas
          </button>
          <button 
            onClick={onNewAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={20} /> Nova Avaliação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Composição Atual</h3>
              {latestAssessment?.photos?.front && (
                <button onClick={() => onViewGallery(latestAssessment.id)} className="text-blue-400 hover:text-blue-300">
                  <ImageIcon size={20} />
                </button>
              )}
            </div>
            {latestAssessment ? (
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-bold text-blue-400">{latestAssessment.metrics.bodyFatPercentage}%</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Percentual de Gordura</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <ProfileMetric label="Peso Total" value={`${latestAssessment.weight}kg`} />
                  <ProfileMetric label="Massa Magra" value={`${latestAssessment.metrics.leanMassKg}kg`} />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-4">Nenhuma avaliação realizada.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Distribuição de Dobras (mm)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" fontSize={10} stroke="#94a3b8" />
                  <Radar name="Dobras" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-8 tracking-tight">
              <TrendingUp size={20} className="text-blue-600" />
              Evolução da Composição
            </h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedAssessments.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => new Date(v).toLocaleDateString()} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="metrics.leanMassKg" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Massa Magra" />
                  <Area type="monotone" dataKey="metrics.fatMassKg" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} name="Massa Gorda" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <History size={20} className="text-blue-600" />
                Histórico de Avaliações
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {sortedAssessments.length > 0 ? sortedAssessments.map(a => (
                <div key={a.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{new Date(a.date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500 font-medium">Peso: {a.weight}kg • BF: {a.metrics.bodyFatPercentage}% • Dobras: {a.metrics.sumSkinfolds}mm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.photos && (
                      <button onClick={() => onViewGallery(a.id)} className="p-2 text-slate-400 hover:text-blue-600">
                        <ImageIcon size={18} />
                      </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center">
                   <p className="text-slate-400 font-medium">Nenhuma avaliação registrada.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileMetric: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default PatientDetails;
