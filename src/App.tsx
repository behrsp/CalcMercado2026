/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, List } from 'lucide-react';
import { storageService } from './services/storageService';
import { Product, MarketData } from './types';
import { BudgetCard } from './components/BudgetCard';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { motion } from 'motion/react';

export default function App() {
  const [data, setData] = useState<MarketData>({ credit: 0, products: [] });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load data on mount
  useEffect(() => {
    setData(storageService.getData());
  }, []);

  const totalSpent = useMemo(() => {
    return data.products.reduce((acc, p) => acc + p.total, 0);
  }, [data.products]);

  const handleCreditChange = (credit: number) => {
    const newData = { ...data, credit };
    setData(newData);
    storageService.updateCredit(credit);
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const newData = {
      ...data,
      products: [newProduct, ...data.products],
    };
    setData(newData);
    storageService.addProduct(newProduct);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const newData = {
      ...data,
      products: data.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    };
    setData(newData);
    storageService.updateProduct(updatedProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const newData = {
        ...data,
        products: data.products.filter((p) => p.id !== id),
      };
      setData(newData);
      storageService.deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-black/5 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Calculadora<span className="text-indigo-600">Mercado</span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <List size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">{data.products.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <BudgetCard 
            credit={data.credit} 
            totalSpent={totalSpent} 
            onCreditChange={handleCreditChange} 
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ProductForm 
            onAdd={handleAddProduct}
            editingProduct={editingProduct}
            onUpdate={handleUpdateProduct}
            onCancelEdit={() => setEditingProduct(null)}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pb-20"
        >
          <ProductList 
            products={data.products} 
            onEdit={setEditingProduct} 
            onDelete={handleDeleteProduct} 
          />
        </motion.section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 p-4 md:hidden">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total da Compra</p>
            <p className="text-lg font-black text-indigo-600">R$ {totalSpent.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Topo
          </button>
        </div>
      </footer>
    </div>
  );
}
