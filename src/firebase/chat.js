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
  serverTimestamp as firestoreTimestamp 
} from "firebase/firestore";
import { db, rtdb } from "./config"; 

// 1. --- ՉԱՏԻ ID ՍՏԵՂԾՈՒՄ ---
export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// 2. --- ՆԱՄԱԿՆԵՐԻ ՈՒՂԱՐԿՈՒՄ ԵՎ ԼՍՈՒՄ ---
export const sendMessage = async (chatId, { text, userId, email, type = "text" }) => {
  if (!chatId || (!text && type === "text")) return;
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: text || "",
      userId,
      email,
      type, // Ավելացրել ենք type (text, audio, video)
      read: false,
      createdAt: firestoreTimestamp(), 
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
  }
};

export const listenMessages = (chatId, callback) => {
  if (!chatId) return;
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(msgs);
  });
};

// 3. --- ՉԿԱՐԴԱՑՎԱԾ ՆԱՄԱԿՆԵՐԻ ԼՍՈՒՄ (Օպտիմալացված) ---
export const listenUnreadCount = (userId, callback) => {
  if (!userId) return;
  
  // Լսում ենք բոլոր "messages" ենթահավաքածուները, որտեղ read-ը false է
  const q = query(
    collectionGroup(db, "messages"), 
    where("read", "==", false)
  );

  return onSnapshot(q, (snapshot) => {
    // Ֆիլտրում ենք այն նամակները, որոնք իմը չեն ԵՎ պատկանում են իմ չատերին
    const unreadCount = snapshot.docs.filter(docSnap => {
      const data = docSnap.data();
      const path = docSnap.ref.path;
      // Ստուգում ենք, որ նամակը ուրիշինն է և chatId-ի մեջ կա իմ ID-ն
      return data.userId !== userId && path.includes(userId);
    }).length;
    
    callback(unreadCount);
  });
};

// 4. --- ՆԱՄԱԿՆԵՐԸ ԿԱՐԴԱՑՎԱԾ ՆՇԵԼ (Օգտագործելով Batch) ---
export const markAsRead = async (chatId, messages, userId) => {
  if (!chatId || !messages.length) return;
  
  const unreadMessages = messages.filter(msg => msg.userId !== userId && !msg.read);
  if (unreadMessages.length === 0) return;

  const batch = writeBatch(db); // Batch-ը ավելի արագ է, քան Promise.all-ը սովորական update-ի համար
  
  unreadMessages.forEach(msg => {
    const msgRef = doc(db, "chats", chatId, "messages", msg.id);
    batch.update(msgRef, { read: true });
  });

  try {
    await batch.commit();
  } catch (e) {
    console.error("MarkAsRead Batch Error:", e);
  }
};

// 5. --- ԶԱՆԳԵՐԻ ԿԱՐԳԱՎՈՐՈՒՄ ---
export const updateCallStatus = async (callId, status) => {
  if (!callId) return;
  try {
    await updateDoc(doc(db, "calls", callId), { status });
  } catch (e) {
    console.error("UpdateCallStatus Error:", e);
  }
};

// 6. --- ONLINE/OFFLINE ՍՏԱՏՈՒՍ ---
export const updateUserStatus = (uid, email) => {
  if (!uid) return;
  const statusRef = ref(rtdb, `status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) return;

    // Երբ օգտատերը անջատվում է
    onDisconnect(statusRef).set({
      state: "offline",
      last_changed: rtdbTimestamp(),
      email,
      id: uid
    });

    // Երբ օգտատերը միանում է
    set(statusRef, {
      state: "online",
      last_changed: rtdbTimestamp(),
      email,
      id: uid
    });
  });
};