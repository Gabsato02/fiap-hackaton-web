import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  Firestore,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import type { Production, StockProduct } from 'hostApp/types';

const STOCK_COLLECTION = 'stock_products';
const PRODUCTIONS_COLLECTION = 'productions';

export const getAllStockProducts = (database: Firestore) => {
  return getDocs(collection(database, STOCK_COLLECTION));
};

export const createStockProduct = (db: Firestore, product: Omit<StockProduct, 'id'>) => {
  return addDoc(collection(db, STOCK_COLLECTION), product);
};

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

const updateStockOnHarvest = async (
  db: Firestore,
  productId: string,
  quantityHarvested: number,
) => {
  const productRef = doc(db, STOCK_COLLECTION, productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error('Produto não encontrado no estoque para colheita!');
  }

  const currentQuantity = productSnap.data().quantity || 0;
  const newQuantity = currentQuantity + quantityHarvested;

  return updateStockProduct(db, productId, {
    quantity: newQuantity,
    updated_at: new Date().toISOString(),
  });
};

export const createProduction = (db: Firestore, production: Omit<Production, 'id'>) => {
  return addDoc(collection(db, PRODUCTIONS_COLLECTION), production);
};

export const getUserProductions = (db: Firestore, userId: string) => {
  const q = query(
    collection(db, PRODUCTIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('creationDate', 'desc'),
  );
  return getDocs(q);
};

export const harvestProduction = async (db: Firestore, production: Production) => {
  const productionRef = doc(db, PRODUCTIONS_COLLECTION, production.id!);
  await setDoc(
    productionRef,
    { status: 'harvested', harvestDate: new Date().toISOString() },
    { merge: true },
  );

  await updateStockOnHarvest(db, production.productId, production.quantity);
};
