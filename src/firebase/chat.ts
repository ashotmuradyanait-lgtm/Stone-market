import { 
  ref, 
  set, 
  onValue, 
  onDisconnect, 
  serverTimestamp as rtdbTimestamp,
  DataSnapshot 
} from "firebase/database";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  setDoc,
  where,
  collectionGroup, 
  writeBatch,
  serverTimestamp as firestoreTimestamp,
  DocumentData,
  QuerySnapshot,
  FieldValue
} from "firebase/firestore";
import { db, rtdb } from "./config"; 

// --- INTERFACES ---
export interface Message {
  id?: string;
  text?: string;
  userId: string;
  email: string;
  type: "text" | "audio" | "video";
  read: boolean;
  audioUrl?: string;
  videoUrl?: string;
  createdAt: FieldValue;
}

export interface SendMessagePayload {
  text?: string;
  userId: string;
  email: string;
  type?: "text" | "audio" | "video";
  audioUrl?: string;
  videoUrl?: string;
}

// 1. --- SYNC USER DATA TO FIRESTORE ---
/**
 * Այս ֆունկցիան պետք է կանչել Login կամ Register ժամանակ։
 * Այն ստեղծում է "users" հավաքածու, որտեղից մենք կարդում ենք անունները և նկարները։
 */
export const updateUserData = async (uid: string, email: string, photoURL?: string) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    email,
    photoURL: photoURL || "",
    lastSeen: firestoreTimestamp()
  }, { merge: true });
};

// 2. --- GET UNIQUE CHAT ID ---
export const getChatId = (uid1: string | undefined, uid2: string | undefined): string | null => {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// 3. --- SEND & LISTEN MESSAGES ---
export const sendMessage = async (
  chatId: string, 
  { text, userId, email, type = "text", audioUrl, videoUrl }: SendMessagePayload
): Promise<void> => {
  if (!chatId) return;
  
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text || "",
      userId,
      email,
      type,
      audioUrl: audioUrl || null,
      videoUrl: videoUrl || null,
      read: false,
      createdAt: firestoreTimestamp(), 
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
  }
};

export const listenMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  if (!chatId) return;
  
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const msgs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Message));
    callback(msgs);
  });
};

// 4. --- UNREAD MESSAGES COUNT ---
export const listenUnreadCount = (userId: string, callback: (count: number) => void) => {
  if (!userId) return;
  
  const q = query(
    collectionGroup(db, "messages"), 
    where("read", "==", false)
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const unreadCount = snapshot.docs.filter(docSnap => {
      const data = docSnap.data() as Message;
      const path = docSnap.ref.path;
      return data.userId !== userId && path.includes(userId);
    }).length;
    
    callback(unreadCount);
  });
};

// 5. --- MARK MESSAGES AS READ ---
export const markAsRead = async (chatId: string, messages: Message[], userId: string): Promise<void> => {
  if (!chatId || !messages.length) return;
  
  const unreadMessages = messages.filter(msg => msg.userId !== userId && !msg.read);
  if (unreadMessages.length === 0) return;

  const batch = writeBatch(db);
  
  unreadMessages.forEach(msg => {
    if (msg.id) {
      const msgRef = doc(db, "chats", chatId, "messages", msg.id);
      batch.update(msgRef, { read: true });
    }
  });

  try {
    await batch.commit();
  } catch (e) {
    console.error("MarkAsRead Batch Error:", e);
  }
};

// 6. --- REAL-TIME STATUS (ONLINE/OFFLINE) ---
export const updateUserStatus = (uid: string, email: string, photoURL?: string): void => {
  if (!uid) return;
  
  const statusRef = ref(rtdb, `status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snapshot: DataSnapshot) => {
    if (snapshot.val() === false) return;

    const data = {
      state: "online",
      last_changed: rtdbTimestamp(),
      email,
      id: uid,
      photoURL: photoURL || ""
    };

    onDisconnect(statusRef).set({ ...data, state: "offline" });
    set(statusRef, data);
  });
};