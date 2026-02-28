import { MarketData, Product } from '../types';

const STORAGE_KEY = 'calculadora_mercado_data';

export const storageService = {
  getData: (): MarketData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing market data', e);
      }
    }
    return {
      credit: 0,
      products: [],
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
  }
};
