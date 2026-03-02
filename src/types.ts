export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
  createdAt: number;
}

export interface Purchase {
  id: string;
  date: number; // timestamp
  total: number;
  products: Product[];
}

export interface MarketData {
  credit: number;
  products: Product[];
  history: Purchase[];
}
