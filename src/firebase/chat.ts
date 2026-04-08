import { 
  ref, 
  set, 
  onValue, 
  onDisconnect, 
  serverTimestamp as rtdbTimestamp 
} from "firebase/database";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  where,
  deleteDoc,
  collectionGroup, 
  writeBatch,
  serverTimestamp as firestoreTimestamp,
  DocumentData,
  QuerySnapshot
} from "firebase/firestore";
import { db, rtdb } from "./config"; 

// --- INTERFACES ---
interface Message {
  id?: string;
  text: string;
  userId: string;
  email: string;
  type: "text" | "audio" | "video";
  read: boolean;
  createdAt: any; // Firestore timestamp
}

interface SendMessagePayload {
  text?: string;
  userId: string;
  email: string;
  type?: "text" | "audio" | "video";
}

// 1. --- ՉԱՏԻ ID ՍՏԵՂԾՈՒՄ ---
export const getChatId = (uid1: string | undefined, uid2: string | undefined): string | null => {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// 2. --- ՆԱՄԱԿՆԵՐԻ ՈՒՂԱՐԿՈՒՄ ԵՎ ԼՍՈՒՄ ---
export const sendMessage = async (chatId: string, { text, userId, email, type = "text" }: SendMessagePayload): Promise<void> => {
  if (!chatId || (!text && type === "text")) return;
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text || "",
      userId,
      email,
      type,
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

// 3. --- ՉԿԱՐԴԱՑՎԱԾ ՆԱՄԱԿՆԵՐԻ ԼՍՈՒՄ ---
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

// 4. --- ՆԱՄԱԿՆԵՐԸ ԿԱՐԴԱՑՎԱԾ ՆՇԵԼ ---
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

// 5. --- ԶԱՆԳԵՐԻ ԿԱՐԳԱՎՈՐՈՒՄ ---
export const updateCallStatus = async (callId: string, status: string): Promise<void> => {
  if (!callId) return;
  try {
    await updateDoc(doc(db, "calls", callId), { status });
  } catch (e) {
    console.error("UpdateCallStatus Error:", e);
  }
};

// 6. --- ONLINE/OFFLINE ՍՏԱՏՈՒՍ ---
export const updateUserStatus = (uid: string, email: string): void => {
  if (!uid) return;
  const statusRef = ref(rtdb, `status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) return;

    onDisconnect(statusRef).set({
      state: "offline",
      last_changed: rtdbTimestamp(),
      email,
      id: uid
    });

    set(statusRef, {
      state: "online",
      last_changed: rtdbTimestamp(),
      email,
      id: uid
    });
  });
};