import React, { useState, useEffect } from 'react';
import { Plus, Package, DollarSign, Hash } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  onAdd: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editingProduct?: Product | null;
  onUpdate?: (product: Product) => void;
  onCancelEdit?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onAdd, 
  editingProduct, 
  onUpdate, 
  onCancelEdit 
}) => {
  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setUnitPrice(editingProduct.unitPrice);
      setQuantity(editingProduct.quantity);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  useEffect(() => {
    setTotal(unitPrice * quantity);
  }, [unitPrice, quantity]);

  const resetForm = () => {
    setName('');
    setUnitPrice(0);
    setQuantity(1);
    setTotal(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || unitPrice <= 0 || quantity <= 0) return;

    if (editingProduct && onUpdate) {
      onUpdate({
        ...editingProduct,
        name,
        unitPrice,
        quantity,
        total
      });
    } else {
      onAdd({
        name,
        unitPrice,
        quantity,
        total
      });
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Plus size={20} className="text-indigo-500" />
        {editingProduct ? 'Editar Produto' : 'Novo Produto'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Preço Unitário</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              step="0.01"
              value={unitPrice || ''}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Quantidade</label>
          <div className="relative">
            <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="1"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      {quantity > 0 && (
        <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Produto</label>
          <div className="relative">
            <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Arroz 5kg"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="text-slate-600">
          <span className="text-sm">Subtotal: </span>
          <span className="font-bold text-indigo-600">R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          {editingProduct && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            {editingProduct ? 'Salvar Alterações' : 'Adicionar à Lista'}
          </button>
        </div>
      </div>
    </form>
  );
};
