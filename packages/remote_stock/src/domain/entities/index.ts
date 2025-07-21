import { Production, StockProduct } from 'hostApp/types';

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

// Novos tipos para Produção
export interface ProductionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (production: Omit<Production, 'id' | 'userId' | 'status'>) => void;
}

export interface ProductionListProps {
  productions: Production[];
  loading: boolean;
  onHarvest: (production: Production) => void;
}
