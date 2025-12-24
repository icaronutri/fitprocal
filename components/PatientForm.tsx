
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Patient, Gender } from '../types';

interface PatientFormProps {
  onCancel: () => void;
  onSubmit: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'M' as Gender,
    height: 175,
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSubmit(newPatient);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl text-slate-500 transition-all border border-transparent hover:border-slate-200 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Novo Paciente</h2>
          <p className="text-slate-500">Preencha as informações básicas para começar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Ex: João da Silva"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">E-mail</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Telefone</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Data de Nascimento</label>
            <input 
              required
              type="date" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={formData.birthDate}
              onChange={e => setFormData({...formData, birthDate: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Sexo</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, gender: 'M'})}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'M' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                Masculino
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, gender: 'F'})}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'F' ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                Feminino
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Altura (cm)</label>
            <input 
              required
              type="number" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Ex: 175"
              value={formData.height}
              onChange={e => setFormData({...formData, height: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Observações Clínicas (Opcional)</label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            placeholder="Alergias, lesões prévias, objetivos..."
            value={formData.observations}
            onChange={e => setFormData({...formData, observations: e.target.value})}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Paciente
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
