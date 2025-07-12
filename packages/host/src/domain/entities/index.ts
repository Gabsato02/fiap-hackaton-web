import { Dayjs } from 'dayjs';
import { Dispatch, ReactNode, SetStateAction } from 'react';

// ✅ 1. DEFINA O TIPO CENTRAL AQUI
export type PageName = 'sales' | 'login' | 'stock' | 'goals';

// COMPONENTS PROPS
export type MainAppBarProps = {
  // ✅ 2. USE O TIPO "PAGENAME" AQUI
  onChangePage: Dispatch<SetStateAction<PageName>>;
  // ✅ 3. E AQUI TAMBÉM, PARA MANTER A CONSISTÊNCIA
  selectedPage: PageName;
};

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export type CustomDatePickerProps = {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
};

// DATA TYPES
export type RemoteProjects = {
  route: string;
  text: string;
  icon: ReactNode;
};

export type UserInfo = {
  id: string;
  token: string;
  email: string;
  name: string;
  photo_url: string;
};

export type StockProduct = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  updated_at?: string;
};

export type Sale = {
  id?: string;
  date: string;
  total_price: number;
  product_price: number;
  product_quantity: number;
  product_id: string;
  seller_id: string;
};
