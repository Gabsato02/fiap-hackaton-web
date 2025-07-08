import { create } from 'zustand';
import { StockProduct } from '../domain/entities';

interface ProductsStore {
  stockProducts: StockProduct[];
  setStockProducts: (products: StockProduct[]) => void;
  getProductById: (id: string) => StockProduct | undefined;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  stockProducts: [],
  setStockProducts: (products: StockProduct[]) =>
    set(() => {
      console.log(products);
      return {
        stockProducts: products,
      }
    }),
  getProductById: (id: string) => {
    const { stockProducts } = get();
    return stockProducts.find((product) => product.id === id);
  },
}));
