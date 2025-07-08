import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "firebase/firestore";

export const getStockProducts = (database: Firestore): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const q = query(collection(database, "stock_products"), where("quantity", ">", 0));
  return getDocs(q);
}

export const getUserSales = async (database: Firestore, userId: string ): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  const q = query(collection(database, "sales"), where("seller_id", "==", userId));
  return getDocs(q);
}

export const saveSale = async (db: Firestore, sale: DocumentData): Promise<DocumentReference<DocumentData, DocumentData>> => {
  return addDoc(collection(db, "sales"), sale);
};

export const editSale = async (db: Firestore, saleId: string, sale: DocumentData): Promise<void> => {
  return setDoc(doc(db, "sales", saleId), sale, { merge: true });
};

export const updateProductQuantity = async (db: Firestore, productId: string, quantity: number): Promise<void> => {
  const productRef = doc(db, "stock_products", productId);
  return setDoc(productRef, { quantity }, { merge: true });
};

export const deleteSale = async (db: Firestore, saleId: string): Promise<void> => {
  return deleteDoc(doc(db, "sales", saleId));
};
