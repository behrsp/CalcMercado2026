import React from 'react';
import { Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
          <ShoppingBag size={32} />
        </div>
        <p className="font-medium">Sua lista está vazia</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Produtos ({products.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white p-4 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{product.quantity}x R$ {product.unitPrice.toFixed(2)}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="font-semibold text-indigo-600">R$ {product.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
