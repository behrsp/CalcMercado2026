export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
  createdAt: number;
}

export interface MarketData {
  credit: number;
  products: Product[];
}
