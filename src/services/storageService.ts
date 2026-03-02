import { MarketData, Product, Purchase } from '../types';

const STORAGE_KEY = 'calculadora_mercado_data';

export const storageService = {
  getData: (): MarketData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return {
          credit: parsed.credit || 0,
          products: parsed.products || [],
          history: parsed.history || [],
        };
      } catch (e) {
        console.error('Error parsing market data', e);
      }
    }
    return {
      credit: 0,
      products: [],
      history: [],
    };
  },

  saveData: (data: MarketData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateCredit: (credit: number) => {
    const data = storageService.getData();
    data.credit = credit;
    storageService.saveData(data);
  },

  addProduct: (product: Product) => {
    const data = storageService.getData();
    data.products.push(product);
    storageService.saveData(data);
  },

  updateProduct: (updatedProduct: Product) => {
    const data = storageService.getData();
    data.products = data.products.map((p) => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    storageService.saveData(data);
  },

  deleteProduct: (id: string) => {
    const data = storageService.getData();
    data.products = data.products.filter((p) => p.id !== id);
    storageService.saveData(data);
  },

  deletePurchase: (id: string) => {
    const data = storageService.getData();
    data.history = data.history.filter((p) => p.id !== id);
    storageService.saveData(data);
    return data;
  },

  finishPurchase: () => {
    const data = storageService.getData();
    if (data.products.length === 0) return data;

    const total = data.products.reduce((acc, p) => acc + p.total, 0);
    const newPurchase: Purchase = {
      id: crypto.randomUUID(),
      date: Date.now(),
      total,
      products: [...data.products],
    };

    const newData: MarketData = {
      ...data,
      products: [],
      history: [newPurchase, ...data.history],
    };

    storageService.saveData(newData);
    return newData;
  }
};
