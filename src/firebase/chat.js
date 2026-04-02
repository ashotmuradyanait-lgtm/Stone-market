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
  serverTimestamp as firestoreTimestamp 
} from "firebase/firestore";
import { db, rtdb } from "./config"; 

// 1. --- ՉԱՏԻ ՀԻՄՆԱԿԱՆ ID (Միշտ նույնը երկուսի համար) ---
export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

// 2. --- ՆԱՄԱԿՆԵՐԻ ՏՐԱՄԱԲԱՆՈՒԹՅՈՒՆ ---
export const sendMessage = async (chatId, { text, userId, email }) => {
  if (!chatId || !text) return;
  try {
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      userId,
      email,
      read: false,
      createdAt: firestoreTimestamp(), 
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
  }
};

export const listenMessages = (chatId, userId, callback) => {
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

// 3. --- ԿԱՐԵՎՈՐ. HEADER-Ի ՀԱՄԱՐ (Չընթերցված նամակներ) ---
export const listenUnreadCount = (userId, callback) => {
  if (!userId) return;
  // Սա լսում է ԲՈԼՈՐ չատերի չկարդացած նամակները
  const q = query(collectionGroup(db, "messages"), where("read", "==", false));

  return onSnapshot(q, (snapshot) => {
    const unread = snapshot.docs.filter(docSnap => {
      const data = docSnap.data();
      // Եթե նամակը իմը չի ու գտնվում է իմ chatId-ի մեջ
      return data.userId !== userId && docSnap.ref.path.includes(userId);
    });
    callback(unread.length);
  });
};

export const markAsRead = async (chatId, messages, userId) => {
  if (!chatId || !messages.length) return;
  const unreadMessages = messages.filter(msg => msg.userId !== userId && !msg.read);
  const promises = unreadMessages.map(msg => {
    const msgRef = doc(db, "chats", chatId, "messages", msg.id);
    return updateDoc(msgRef, { read: true });
  });
  await Promise.all(promises).catch(e => console.error("MarkAsRead Error:", e));
};

// 4. --- ՎԻԴԵՈԶԱՆԳԻ ՕԺԱՆԴԱԿՈՒԹՅՈՒՆ ---
export const updateCallStatus = async (callId, status) => {
  if (!callId) return;
  try {
    await updateDoc(doc(db, "calls", callId), { status });
  } catch (e) {
    console.error("UpdateCallStatus Error:", e);
  }
};

export const clearCall = async (callId) => {
  if (!callId) return;
  try {
    await deleteDoc(doc(db, "calls", callId));
  } catch (e) {
    console.error("ClearCall Error:", e);
  }
};

// 5. --- ՍՏԱՏՈՒՍՆԵՐ (ONLINE/OFFLINE) ---
export const updateUserStatus = (uid, email) => {
  if (!uid) return;
  const statusRef = ref(rtdb, `status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) return;
    onDisconnect(statusRef).set({
      state: "offline",
      last_changed: rtdbTimestamp(),
      email: email,
      id: uid
    });
    set(statusRef, {
      state: "online",
      last_changed: rtdbTimestamp(),
      email: email,
      id: uid
    });
  });
};

export const listenAllStatuses = (callback) => {
  const statusRef = ref(rtdb, `status`);
  return onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.keys(data).map(key => ({ ...data[key], id: key }));
      callback(list);
    } else {
      callback([]);
    }
  });
};