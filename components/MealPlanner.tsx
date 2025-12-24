
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils, Zap, Shield, Coffee, Info } from 'lucide-react';
import { Patient, Meal, FoodItem, MealPlan } from '../types';

interface MealPlannerProps {
  patient: Patient;
  onSave: (plan: MealPlan) => void;
  onCancel: () => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ patient, onSave, onCancel }) => {
  const [meals, setMeals] = useState<Meal[]>([
    { id: '1', name: 'Café da Manhã', time: '08:00', foods: [] },
    { id: '2', name: 'Almoço', time: '12:30', foods: [] },
    { id: '3', name: 'Jantar', time: '19:30', foods: [] }
  ]);

  const [targets, setTargets] = useState({ calories: 2400, protein: 180, carbs: 250, fat: 70 });

  const totals = meals.reduce((acc, meal) => {
    meal.foods.forEach(f => {
      acc.calories += f.calories;
      acc.protein += f.protein;
      acc.carbs += f.carbs;
      acc.fat += f.fat;
    });
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const addFood = (mealId: string) => {
    const newFood: FoodItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Alimento',
      calories: 100,
      protein: 10,
      carbs: 10,
      fat: 2,
      amount: '100g'
    };
    setMeals(meals.map(m => m.id === mealId ? { ...m, foods: [...m.foods, newFood] } : m));
  };

  const removeFood = (mealId: string, foodId: string) => {
    setMeals(meals.map(m => m.id === mealId ? { ...m, foods: m.foods.filter(f => f.id !== foodId) } : m));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Plano Nutricional</h2>
          <p className="text-slate-500">Montando estratégia para {patient.name}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
          <button onClick={() => alert('Plano Salvo!')} className="px-6 py-2.5 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Salvar Plano</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Target vs Planejado</h3>
            <div className="space-y-6">
              <MacroProgress label="Calorias" current={totals.calories} target={targets.calories} color="bg-indigo-500" />
              <MacroProgress label="Proteínas" current={totals.protein} target={targets.protein} color="bg-emerald-500" suffix="g" />
              <MacroProgress label="Carboidratos" current={totals.carbs} target={targets.carbs} color="bg-amber-500" suffix="g" />
              <MacroProgress label="Gorduras" current={totals.fat} target={targets.fat} color="bg-rose-500" suffix="g" />
            </div>
          </div>
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
             <div className="flex items-center gap-2 mb-4">
               <Info size={18} className="text-indigo-300" />
               <h4 className="font-bold">Dica Pro</h4>
             </div>
             <p className="text-xs text-indigo-100 leading-relaxed">Priorize proteínas de alto valor biológico nas refeições pré e pós treino para otimizar a síntese proteica.</p>
          </div>
        </div>

        {/* Meal List */}
        <div className="lg:col-span-3 space-y-6">
          {meals.map(meal => (
            <div key={meal.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Coffee className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{meal.name}</h3>
                    <p className="text-xs text-slate-400">{meal.time}</p>
                  </div>
                </div>
                <button onClick={() => addFood(meal.id)} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                  <Plus size={16} /> Adicionar Alimento
                </button>
              </div>
              <div className="p-4 space-y-2">
                {meal.foods.length > 0 ? meal.foods.map(food => (
                  <div key={food.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex-1">
                      <input 
                        className="font-semibold text-slate-700 bg-transparent border-none outline-none focus:ring-0 w-full"
                        value={food.name}
                        onChange={() => {}}
                      />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{food.amount} • {food.calories}kcal</p>
                    </div>
                    <div className="flex gap-4 text-xs font-bold">
                      <div className="text-emerald-600"><span className="text-slate-400">P:</span> {food.protein}g</div>
                      <div className="text-amber-600"><span className="text-slate-400">C:</span> {food.carbs}g</div>
                      <div className="text-rose-600"><span className="text-slate-400">G:</span> {food.fat}g</div>
                    </div>
                    <button onClick={() => removeFood(meal.id, food.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-sm font-medium">Nenhum alimento nesta refeição.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MacroProgress: React.FC<{ label: string, current: number, target: number, color: string, suffix?: string }> = ({ label, current, target, color, suffix = '' }) => {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-700">{current}{suffix} / {target}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default MealPlanner;
