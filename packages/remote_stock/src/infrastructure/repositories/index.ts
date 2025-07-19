import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { StockProduct } from 'src/domain/entities';

const STOCK_COLLECTION = 'stock_products';

export const getAllStockProducts = (database: Firestore) => {
  return getDocs(collection(database, STOCK_COLLECTION));
};

// 👇 O tipo 'StockProduct' é usado aqui
export const createStockProduct = (db: Firestore, product: Omit<StockProduct, 'id'>) => {
  return addDoc(collection(db, STOCK_COLLECTION), product);
};

// 👇 E aqui
export const updateStockProduct = (
  db: Firestore,
  productId: string,
  product: Partial<StockProduct>,
) => {
  return setDoc(doc(db, STOCK_COLLECTION, productId), product, { merge: true });
};

export const deleteStockProduct = (db: Firestore, productId: string) => {
  return deleteDoc(doc(db, STOCK_COLLECTION, productId));
};
