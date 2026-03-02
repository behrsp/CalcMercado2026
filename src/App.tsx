/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, List, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { storageService } from './services/storageService';
import { Product, MarketData } from './types';
import { BudgetCard } from './components/BudgetCard';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { Dashboard } from './components/Dashboard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { motion, AnimatePresence } from 'motion/react';

type View = 'list' | 'dashboard';

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant: 'danger' | 'success' | 'info';
  confirmText?: string;
}

export default function App() {
  const [data, setData] = useState<MarketData>({ credit: 0, products: [], history: [] });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<View>('list');
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'info'
  });

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
    setModalConfig({
      isOpen: true,
      title: 'Excluir Produto',
      message: 'Tem certeza que deseja remover este item da sua lista?',
      variant: 'danger',
      confirmText: 'Excluir',
      onConfirm: () => {
        const newData = {
          ...data,
          products: data.products.filter((p) => p.id !== id),
        };
        setData(newData);
        storageService.deleteProduct(id);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeletePurchase = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Histórico',
      message: 'Esta ação removerá permanentemente esta compra do seu histórico. Continuar?',
      variant: 'danger',
      confirmText: 'Excluir',
      onConfirm: () => {
        const newData = storageService.deletePurchase(id);
        setData(newData);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleFinishPurchase = () => {
    if (data.products.length === 0) return;
    setModalConfig({
      isOpen: true,
      title: 'Finalizar Compra',
      message: 'Deseja salvar esta lista no histórico e começar uma nova?',
      variant: 'success',
      confirmText: 'Finalizar',
      onConfirm: () => {
        const newData = storageService.finishPurchase();
        setData(newData);
        setCurrentView('dashboard');
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        confirmText={modalConfig.confirmText}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
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
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentView('list')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                currentView === 'list' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                currentView === 'dashboard' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <BudgetCard 
                credit={data.credit} 
                totalSpent={totalSpent} 
                onCreditChange={handleCreditChange} 
              />

              <ProductForm 
                onAdd={handleAddProduct}
                editingProduct={editingProduct}
                onUpdate={handleUpdateProduct}
                onCancelEdit={() => setEditingProduct(null)}
              />

              <div className="space-y-4">
                <ProductList 
                  products={data.products} 
                  onEdit={setEditingProduct} 
                  onDelete={handleDeleteProduct} 
                />
                
                {data.products.length > 0 && (
                  <button
                    onClick={handleFinishPurchase}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 size={20} />
                    FINALIZAR COMPRA
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard history={data.history} onDeletePurchase={handleDeletePurchase} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentView === 'list' && (
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
      )}
    </div>
  );
}
