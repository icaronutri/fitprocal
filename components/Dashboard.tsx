
import React from 'react';
import { Users, ClipboardCheck, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Star, AlertTriangle } from 'lucide-react';
import { Patient, Assessment } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  patients: Patient[];
  assessments: Assessment[];
  onSelectPatient: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ patients, assessments, onSelectPatient }) => {
  const recentAssessments = [...assessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  const totalPatients = patients.length;
  const assessmentsThisMonth = assessments.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  
  const avgFat = assessments.length > 0 
    ? (assessments.reduce((sum, a) => sum + a.metrics.bodyFatPercentage, 0) / assessments.length).toFixed(1)
    : '0';

  // Find inactive patients (> 30 days)
  const inactivePatientsCount = patients.filter(p => {
    const lastA = assessments.filter(a => a.patientId === p.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    if (!lastA) return true;
    const diff = (new Date().getTime() - new Date(lastA.date).getTime()) / (1000 * 3600 * 24);
    return diff > 30;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Resumo Profissional</h2>
          <p className="text-slate-500">Acompanhe a performance e o engajamento de seus pacientes.</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Pacientes Ativos" 
          value={totalPatients} 
          icon={<Users className="text-blue-600" />} 
          status="Em alta"
          trend="+2" 
          trendUp={true} 
        />
        <MetricCard 
          title="Avaliações (Mês)" 
          value={assessmentsThisMonth} 
          icon={<ClipboardCheck className="text-emerald-600" />} 
          status="Meta: 10"
          trend="+5" 
          trendUp={true} 
        />
        <MetricCard 
          title="Média % Gordura" 
          value={`${avgFat}%`} 
          icon={<Star className="text-purple-600" />} 
          status="Clínica"
          trend="-0.2%" 
          trendUp={false} 
        />
        <MetricCard 
          title="Precisam Atenção" 
          value={inactivePatientsCount} 
          icon={<AlertTriangle className="text-amber-600" />} 
          status="> 30 dias"
          trend="Pendente" 
          trendUp={false} 
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Evolution Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Fluxo de Composição Corporal</h3>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              Evolução de Peso
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={assessments}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString()} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="weight" stroke="#2563eb" fillOpacity={1} fill="url(#colorArea)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Histórico Recente</h3>
            <Clock size={18} className="text-slate-400" />
          </div>
          <div className="space-y-6 flex-1">
            {recentAssessments.length > 0 ? (
              recentAssessments.map(a => {
                const patient = patients.find(p => p.id === a.patientId);
                return (
                  <div key={a.id} className="group flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer" onClick={() => onSelectPatient(a.patientId)}>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {patient?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{patient?.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{new Date(a.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{a.metrics.bodyFatPercentage}%</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fat</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <ClipboardCheck size={32} />
                </div>
                <p className="text-slate-400 text-sm font-medium">Inicie sua primeira<br/>avaliação hoje.</p>
              </div>
            )}
          </div>
          <button onClick={() => {}} className="mt-8 text-center text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700">Ver Todas</button>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, trend: string, trendUp: boolean, status: string, highlight?: boolean }> = ({ title, value, icon, trend, trendUp, status, highlight }) => (
  <div className={`p-6 rounded-3xl border transition-all shadow-sm ${highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-md'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highlight ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
        {icon}
      </div>
      <div className={`flex items-center text-[10px] font-bold uppercase tracking-widest ${trendUp ? 'text-emerald-600' : 'text-slate-500'}`}>
        {trend}
        {trendUp ? <ArrowUpRight size={14} /> : null}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-[10px] font-bold text-slate-400">{status}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
