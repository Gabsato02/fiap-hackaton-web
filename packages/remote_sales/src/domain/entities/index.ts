import { Sale, StockProduct } from 'hostApp/types';

export type SaleModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  products: StockProduct[];
  currentSale?: Sale;
};
