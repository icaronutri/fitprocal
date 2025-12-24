
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, User } from 'lucide-react';
import { Patient } from '../types';

interface PatientListProps {
  patients: Patient[];
  onNewPatient: () => void;
  onSelectPatient: (id: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onNewPatient, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Pacientes</h2>
          <p className="text-slate-500">{patients.length} pacientes cadastrados</p>
        </div>
        <button 
          onClick={onNewPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Novo Paciente
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou e-mail..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:bg-slate-50">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div 
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                {patient.name.charAt(0)}
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{patient.email}</p>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                <User size={12} />
                {patient.gender === 'M' ? 'Masculino' : 'Feminino'}
              </div>
              <div>{patient.height}cm</div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Última Avaliação</span>
              <span className="text-sm font-semibold text-slate-700">12 Out 2023</span>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">Nenhum paciente encontrado com sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
