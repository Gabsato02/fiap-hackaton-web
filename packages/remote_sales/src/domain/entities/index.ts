import { Firestore } from 'firebase/firestore';
import { Sale } from 'hostApp/types';

export type SaleModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
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
  editSale: (sale: Sale) => void;
  database: Firestore;
};

export type SalesCardProps = {
  sale: Sale,
  onDelete: () => void;
  onEdit: (sale: Sale) => void;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type GroupedSale = {
  label: string;
  value: number;
};