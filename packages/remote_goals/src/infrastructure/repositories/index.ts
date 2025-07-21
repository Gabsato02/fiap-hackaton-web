import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from 'firebase/firestore';

export const getUserGoals = async (
  database: Firestore,
  userId: string,
): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const q = query(collection(database, 'goals'), where('userId', '==', userId));
  return getDocs(q);
};

export const saveGoal = async (
  db: Firestore,
  goal: DocumentData,
): Promise<DocumentReference<DocumentData, DocumentData>> => {
  return addDoc(collection(db, 'goals'), goal);
};

export const editGoal = async (
  db: Firestore,
  goalId: string,
  goal: DocumentData,
): Promise<void> => {
  return setDoc(doc(db, 'goals', goalId), goal, { merge: true });
};

export const deleteGoal = async (db: Firestore, goalId: string): Promise<void> => {
  return deleteDoc(doc(db, 'goals', goalId));
};

export const getSalesByPeriod = async (
  database: Firestore,
  userId: string,
  startDate: string,
  endDate: string,
): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const q = query(
    collection(database, 'sales'),
    where('seller_id', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
  );
  return getDocs(q);
};

export const getProductionsByPeriod = async (
  database: Firestore,
  userId: string,
  startDate: string,
  endDate: string,
  productId: string,
): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const q = query(
    collection(database, 'productions'),
    where('userId', '==', userId),
    where('productId', '==', productId),
    where('status', '==', 'harvested'),
    where('harvestDate', '>=', startDate),
    where('harvestDate', '<=', endDate),
  );
  return getDocs(q);
};

export const getAllStockProducts = (database: Firestore) => {
  return getDocs(collection(database, 'stock_products'));
};
