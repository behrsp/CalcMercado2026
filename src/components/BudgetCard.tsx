import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

interface BudgetCardProps {
  credit: number;
  totalSpent: number;
  onCreditChange: (value: number) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ credit, totalSpent, onCreditChange }) => {
  const remaining = credit - totalSpent;
  const usagePercentage = credit > 0 ? (totalSpent / credit) * 100 : 0;
  const isWarning = usagePercentage >= 85;
  const isOver = totalSpent > credit && credit > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Wallet size={20} />
          <span className="font-medium">Crédito Disponível</span>
        </div>
        <input
          type="number"
          value={credit || ''}
          onChange={(e) => onCreditChange(Number(e.target.value))}
          placeholder="R$ 0,00"
          className="w-32 text-right font-bold text-lg bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Gasto</p>
          <p className={`text-2xl font-bold transition-colors ${
            isOver ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-900'
          }`}>
            R$ {totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Saldo</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            R$ {remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {isWarning && credit > 0 && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium animate-pulse ${
          isOver ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
        }`}>
          <AlertCircle size={16} />
          <span>
            {isOver 
              ? 'Orçamento excedido!' 
              : `Atenção: Você já usou ${usagePercentage.toFixed(1)}% do seu crédito.`}
          </span>
        </div>
      )}

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
