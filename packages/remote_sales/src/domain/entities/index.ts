import { Firestore } from 'firebase/firestore';
import { Sale, StockProduct } from 'hostApp/types';

export type SaleModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  products: StockProduct[];
  currentSale?: Sale;
};

export interface SalesChartData {
  label: string;
  value: number;
  color?: string;
}

export interface SalesChartProps {
  data: SalesChartData[];
  title?: string;
  width?: number;
  height?: number;
  loading: boolean;
}

export type SalesListProps = {
  loading: boolean;
  sales: Sale[];
  refreshList: () => void;
  database: Firestore;
};

export type SalesCardProps = {
  sale: Sale,
  onDelete: () => void
};