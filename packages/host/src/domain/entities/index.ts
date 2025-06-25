import { Dispatch, ReactNode, SetStateAction } from 'react';

// COMPONENTS PROPS
export type MainAppBarProps = {
  onChangePage: Dispatch<SetStateAction<string>>;
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

// DATA TYPES
export type RemoteProjects = {
  route: string,
  text: string,
  icon: ReactNode,
};

export type UserInfo = {
  id: string,
  token: string,
  email: string,
  name: string,
  photo_url: string,
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