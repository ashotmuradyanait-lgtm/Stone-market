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

// 1. --- GET UNIQUE CHAT ID ---
// Սա երաշխավորում է, որ UID-ները միշտ նույն հերթականությամբ կդասավորվեն
export const getChatId = (uid1: string | undefined, uid2: string | undefined): string | null => {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// 2. --- SEND & LISTEN MESSAGES ---
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

// 3. --- UNREAD MESSAGES COUNT ---
export const listenUnreadCount = (userId: string, callback: (count: number) => void) => {
  if (!userId) return;
  
  const q = query(
    collectionGroup(db, "messages"), 
    where("read", "==", false)
  );

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    // Ֆիլտրում ենք այն նամակները, որոնք մերը չեն (ուրիշն է գրել)
    // և որոնք գտնվում են այն չատի մեջ, որտեղ մեր UID-ն կա
    const unreadCount = snapshot.docs.filter(docSnap => {
      const data = docSnap.data() as Message;
      const path = docSnap.ref.path; // chats/uid1_uid2/messages/msgId
      return data.userId !== userId && path.includes(userId);
    }).length;
    
    callback(unreadCount);
  });
};

// 4. --- MARK MESSAGES AS READ ---
export const markAsRead = async (chatId: string, messages: Message[], userId: string): Promise<void> => {
  if (!chatId || !messages.length) return;
  
  // Գտնում ենք այն նամակները, որոնք մենք չենք գրել ու դեռ չենք կարդացել
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

// 5. --- CALLS ---
export const updateCallStatus = async (callId: string, status: "pending" | "accepted" | "rejected"): Promise<void> => {
  if (!callId) return;
  try {
    await updateDoc(doc(db, "calls", callId), { status });
  } catch (e) {
    console.error("UpdateCallStatus Error:", e);
  }
};

// 6. --- REAL-TIME STATUS (ONLINE/OFFLINE) ---
export const updateUserStatus = (uid: string, email: string): void => {
  if (!uid) return;
  
  const statusRef = ref(rtdb, `status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snapshot: DataSnapshot) => {
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