import type { StockProduct } from 'hostApp/types';
//TODO: alterar importacao deposi
export type StockProduct = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  updated_at?: string;
};

export interface StockListProps {
  products: StockProduct[];
  onEdit: (product: StockProduct) => void;
  onDelete: (productId: string) => void;
  loading: boolean;
}

export interface StockModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: StockProduct) => void;
  currentProduct: StockProduct | null;
}
