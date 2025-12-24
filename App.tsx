
import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, ClipboardCheck, LogOut, Search, ChevronRight, Apple, LogIn, UserPlus, Bell, Moon, Sun, Columns 
} from 'lucide-react';
import { Patient, Assessment, User, Theme } from './types';
import { getPatients, savePatient } from './js/pacientes';
import { getAssessments, saveAssessment } from './js/avaliacoes';
import { getSession, logout, login, register } from './js/auth';

import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import AssessmentForm from './components/AssessmentForm';
import PatientDetails from './components/PatientDetails';
import MealPlanner from './components/MealPlanner';
import ComparisonSelector from './components/ComparisonSelector';
import ComparisonView from './components/ComparisonView';
import AssessmentGallery from './components/AssessmentGallery';

type View = 'dashboard' | 'patients' | 'new-patient' | 'assessment' | 'patient-details' | 'meal-planner' | 'login' | 'register' | 'comparison-selector' | 'comparison-result' | 'gallery';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAssessments, setSelectedAssessments] = useState<[Assessment, Assessment] | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      setView('dashboard');
      setPatients(getPatients());
      setAssessments(getAssessments());
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const pass = (e.target as any).password.value;
    const user = login(email, pass);
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
      setPatients(getPatients());
      setAssessments(getAssessments());
    } else {
      alert('Credenciais inválidas.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: (e.target as any).name.value,
      email: (e.target as any).email.value,
      password: (e.target as any).password.value,
      cref: (e.target as any).cref.value,
    };
    const user = register(userData);
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('login');
  };

  const handleAddPatient = (patient: Patient) => {
    savePatient(patient);
    setPatients(getPatients());
    setView('patients');
  };

  const handleAddAssessment = (assessment: Assessment) => {
    saveAssessment(assessment);
    setAssessments(getAssessments());
    setSelectedPatientId(assessment.patientId);
    setView('patient-details');
  };

  if (!currentUser) {
    if (view === 'register') {
      return (
        <AuthLayout title="Criar Conta" subtitle="Junte-se a milhares de profissionais.">
          <form onSubmit={handleRegister} className="space-y-4">
            <AuthInput name="name" label="Nome Completo" type="text" placeholder="Seu nome" required />
            <AuthInput name="email" label="E-mail" type="email" placeholder="seu@email.com" required />
            <AuthInput name="cref" label="CREF" type="text" placeholder="Ex: 000000-G/SP" />
            <AuthInput name="password" label="Senha" type="password" placeholder="••••••••" required />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2">
              <UserPlus size={18} /> Registrar
            </button>
            <p className="text-center text-sm text-slate-500">
              Já tem conta? <button type="button" onClick={() => setView('login')} className="text-blue-600 font-bold">Login</button>
            </p>
          </form>
        </AuthLayout>
      );
    }
    return (
      <AuthLayout title="FitTracker Pro" subtitle="Acesse sua central de avaliações.">
        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput name="email" label="E-mail" type="email" placeholder="seu@email.com" required />
          <AuthInput name="password" label="Senha" type="password" placeholder="••••••••" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2">
            <LogIn size={18} /> Entrar
          </button>
          <div className="text-center text-sm">
            <button type="button" onClick={() => setView('register')} className="text-blue-600 font-bold">Criar conta grátis</button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  const currentPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">FP</div>
          {isSidebarOpen && <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">FitTracker <span className="text-blue-600">Pro</span></h1>}
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={view === 'dashboard'} collapsed={!isSidebarOpen} onClick={() => setView('dashboard')} />
          <SidebarItem icon={<Users size={20} />} label="Pacientes" active={view === 'patients' || view === 'patient-details' || view === 'comparison-selector' || view === 'comparison-result'} collapsed={!isSidebarOpen} onClick={() => setView('patients')} />
          <SidebarItem icon={<Apple size={20} />} label="Dietas" active={view === 'meal-planner'} collapsed={!isSidebarOpen} onClick={() => setView('meal-planner')} />
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <SidebarItem icon={<LogOut size={20} />} label="Sair" active={false} collapsed={!isSidebarOpen} onClick={handleLogout} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
            <ChevronRight className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-sm text-slate-600 border border-transparent focus-within:border-blue-300 transition-all">
              <Search size={16} className="mr-2" />
              <input 
                type="text" 
                placeholder="Busca global..." 
                className="bg-transparent outline-none w-48 text-slate-800 dark:text-slate-100" 
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  if (view !== 'patients') setView('patients');
                }}
              />
            </div>
            <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className="flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-100 font-bold">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {view === 'dashboard' && <Dashboard patients={patients} assessments={assessments} onSelectPatient={id => { setSelectedPatientId(id); setView('patient-details'); }} />}
          {view === 'patients' && <PatientList patients={filteredPatients} onNewPatient={() => setView('new-patient')} onSelectPatient={id => { setSelectedPatientId(id); setView('patient-details'); }} />}
          {view === 'new-patient' && <PatientForm onCancel={() => setView('patients')} onSubmit={handleAddPatient} />}
          {view === 'assessment' && currentPatient && <AssessmentForm patient={currentPatient} onCancel={() => setView('patient-details')} onSubmit={handleAddAssessment} />}
          {view === 'patient-details' && currentPatient && (
            <PatientDetails 
              patient={currentPatient} 
              assessments={assessments.filter(a => a.patientId === selectedPatientId)} 
              onNewAssessment={() => setView('assessment')} 
              onBack={() => setView('patients')} 
              onMealPlanner={() => setView('meal-planner')}
              onComparison={() => setView('comparison-selector')}
              onViewGallery={(id) => { setActiveAssessmentId(id); setView('gallery'); }}
            />
          )}
          {view === 'meal-planner' && currentPatient && <MealPlanner patient={currentPatient} onCancel={() => setView('patient-details')} onSave={() => {}} />}
          {view === 'comparison-selector' && currentPatient && (
            <ComparisonSelector 
              patient={currentPatient} 
              assessments={assessments.filter(a => a.patientId === selectedPatientId)} 
              onBack={() => setView('patient-details')}
              onCompare={(a1, a2) => { setSelectedAssessments([a1, a2]); setView('comparison-result'); }}
            />
          )}
          {view === 'comparison-result' && currentPatient && selectedAssessments && (
            <ComparisonView 
              patient={currentPatient} 
              a1={selectedAssessments[0]} 
              a2={selectedAssessments[1]} 
              onBack={() => setView('comparison-selector')} 
            />
          )}
          {view === 'gallery' && activeAssessmentId && (
            <AssessmentGallery 
              assessment={assessments.find(a => a.id === activeAssessmentId)!} 
              onClose={() => setView('patient-details')} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

const AuthLayout: React.FC<{ children: React.ReactNode, title: string, subtitle: string }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
    <div className="max-w-md w-full">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-xl">FP</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h1>
        <p className="text-slate-500">{subtitle}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        {children}
      </div>
    </div>
  </div>
);

const AuthInput: React.FC<{ label: string, name: string, type: string, placeholder: string, required?: boolean }> = ({ label, name, type, placeholder, required }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    <input name={name} type={type} placeholder={placeholder} required={required} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
  </div>
);

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, collapsed: boolean, onClick: () => void }> = ({ icon, label, active, collapsed, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100'
    }`}
  >
    <span className="flex-shrink-0">{icon}</span>
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

export default App;
