import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  Unsubscribe
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { Product, Category, Seller, Order, ChatMessage, UserProfile } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SELLERS } from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const SELLERS_COLLECTION = 'sellers';
const ORDERS_COLLECTION = 'orders';
const CHAT_COLLECTION = 'chat_messages';
const USERS_COLLECTION = 'users';

// ==================== PRODUCTS ====================

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty on initial run, seed it with INITIAL_PRODUCTS
        console.log('Seeding initial products into Firestore...');
        try {
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db, PRODUCTS_COLLECTION, item.id), item);
          }
        } catch (e) {
          console.warn('Initial seeding note:', e);
        }
        onUpdate(INITIAL_PRODUCTS);
        return;
      }

      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      // Sort featured first or by date
      onUpdate(products);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
      if (onError) onError(error);
    }
  );
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function updateProductStockInFirestore(productId: string, stockCount: number): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      stockCount: Math.max(0, stockCount),
      inStock: stockCount > 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// ==================== CATEGORIES ====================

export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void
): Unsubscribe {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const cat of INITIAL_CATEGORIES) {
            await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), cat);
          }
        } catch (e) {
          console.warn('Initial categories seed note:', e);
        }
        onUpdate(INITIAL_CATEGORIES);
        return;
      }

      const categories: Category[] = [];
      snapshot.forEach((docSnap) => {
        categories.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
      });
      onUpdate(categories);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, CATEGORIES_COLLECTION);
    }
  );
}

export async function saveCategoryToFirestore(category: Category): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(docRef, category, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CATEGORIES_COLLECTION);
    throw error;
  }
}

// ==================== SELLERS ====================

export function subscribeToSellers(
  onUpdate: (sellers: Seller[]) => void
): Unsubscribe {
  const colRef = collection(db, SELLERS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const seller of INITIAL_SELLERS) {
            await setDoc(doc(db, SELLERS_COLLECTION, seller.id), seller);
          }
        } catch (e) {
          console.warn('Initial seller seed note:', e);
        }
        onUpdate(INITIAL_SELLERS);
        return;
      }

      const sellers: Seller[] = [];
      snapshot.forEach((docSnap) => {
        sellers.push({ id: docSnap.id, ...(docSnap.data() as Omit<Seller, 'id'>) });
      });
      onUpdate(sellers);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, SELLERS_COLLECTION);
    }
  );
}

export async function saveSellerToFirestore(seller: Seller): Promise<void> {
  try {
    const docRef = doc(db, SELLERS_COLLECTION, seller.id);
    await setDoc(docRef, seller, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SELLERS_COLLECTION);
    throw error;
  }
}

// ==================== ORDERS & TRANSACTIONS ====================

export async function saveOrderToFirestore(orderData: Omit<Order, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const orderDoc = await addDoc(colRef, {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return orderDoc.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
    throw error;
  }
}

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  userId?: string
): Unsubscribe {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!userId || data.userId === userId) {
          orders.push({
            id: docSnap.id,
            ...(data as Omit<Order, 'id'>),
          });
        }
      });
      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
    }
  );
}

// ==================== LIVE CHAT & INQUIRIES ====================

export function subscribeToChatMessages(
  onUpdate: (messages: ChatMessage[]) => void,
  productId?: string
): Unsubscribe {
  const colRef = collection(db, CHAT_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        messages.push({
          id: docSnap.id,
          userId: data.userId || 'guest',
          userName: data.userName || 'Customer',
          userAvatar: data.userAvatar || '',
          text: data.text || '',
          senderRole: data.senderRole || 'user',
          productId: data.productId,
          productName: data.productName,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      // Sort by chronological order
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      onUpdate(messages);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, CHAT_COLLECTION);
    }
  );
}

export async function sendChatMessageToFirestore(message: Omit<ChatMessage, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, CHAT_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...message,
      createdAt: message.createdAt || new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, CHAT_COLLECTION);
    throw error;
  }
}

// ==================== USER PROFILES ====================

export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!profile.uid) return;
  const path = `${USERS_COLLECTION}/${profile.uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}
