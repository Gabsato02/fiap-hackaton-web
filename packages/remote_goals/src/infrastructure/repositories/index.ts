import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "firebase/firestore";

export const getUserGoals = async (database: Firestore, userId: string): Promise<QuerySnapshot<DocumentData, DocumentData>> => {
  console.log('🔍 getUserGoals - userId recebido:', userId);
  console.log('🔍 getUserGoals - database:', database);
  
  const q = query(collection(database, "goals"), where("userId", "==", userId));
  console.log('🔍 Query criada para collection "goals" com userId:', userId);
  
  const snapshot = await getDocs(q);
  console.log('🔍 Snapshot retornado:', snapshot);
  console.log('🔍 Snapshot.empty:', snapshot.empty);
  console.log('🔍 Snapshot.size:', snapshot.size);
  
  // Debug: buscar TODAS as metas para ver o que tem
  const allGoalsQuery = query(collection(database, "goals"));
  const allSnapshot = await getDocs(allGoalsQuery);
  console.log('🔍 TODOS os documentos na collection goals:', allSnapshot.size);
  allSnapshot.docs.forEach((doc, index) => {
    console.log(`🔍 Documento ${index}:`, doc.id, doc.data());
  });
  
  return snapshot;
}

export const saveGoal = async (db: Firestore, goal: DocumentData): Promise<DocumentReference<DocumentData, DocumentData>> => {
  return addDoc(collection(db, "goals"), goal);
};

export const editGoal = async (db: Firestore, goalId: string, goal: DocumentData): Promise<void> => {
  return setDoc(doc(db, "goals", goalId), goal, { merge: true });
};

export const deleteGoal = async (db: Firestore, goalId: string): Promise<void> => {
  return deleteDoc(doc(db, "goals", goalId));
};
