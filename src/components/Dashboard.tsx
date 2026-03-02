import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Purchase } from '../types';
import { TrendingUp, Calendar, ArrowRight, Trash2 } from 'lucide-react';

interface DashboardProps {
  history: Purchase[];
  onDeletePurchase: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, onDeletePurchase }) => {
  const monthlyData = useMemo(() => {
    const months: { [key: string]: number } = {};
    
    // Get last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }

    history.forEach(purchase => {
      const d = new Date(purchase.date);
      const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) {
        months[key] += purchase.total;
      }
    });

    return Object.entries(months).map(([name, total]) => ({
      name,
      total
    }));
  }, [history]);

  const totalHistory = history.reduce((acc, p) => acc + p.total, 0);
  const averageSpend = history.length > 0 ? totalHistory / history.length : 0;

  const currentMonthTotal = monthlyData[monthlyData.length - 1]?.total || 0;
  const lastMonthTotal = monthlyData[monthlyData.length - 2]?.total || 0;
  const diff = currentMonthTotal - lastMonthTotal;
  const isUp = diff > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Gasto Total</span>
          </div>
          <p className="text-2xl font-black text-slate-900">R$ {totalHistory.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Média por Compra</span>
          </div>
          <p className="text-2xl font-black text-slate-900">R$ {averageSpend.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <ArrowRight size={18} className={isUp ? 'rotate-[-45deg] text-red-500' : 'rotate-[45deg] text-emerald-500'} />
            <span className="text-xs font-bold uppercase tracking-wider">Comparação Mensal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">
              {isUp ? '+' : ''}{diff.toFixed(2)}
            </p>
            <span className={`text-xs font-bold ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
              {lastMonthTotal > 0 ? `${((diff / lastMonthTotal) * 100).toFixed(1)}%` : 'Novo'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Evolução de Gastos (6 Meses)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Total']}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === monthlyData.length - 1 ? '#4f46e5' : '#e2e8f0'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Histórico de Compras</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhuma compra finalizada ainda.</div>
          ) : (
            history.map((purchase) => (
              <div key={purchase.id} className="group p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">
                    {new Date(purchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </p>
                  <p className="text-xs text-slate-500">{purchase.products.length} itens</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-black text-indigo-600">R$ {purchase.total.toFixed(2)}</p>
                  <button
                    onClick={() => onDeletePurchase(purchase.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Excluir Histórico"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
