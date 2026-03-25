import { ref, push, set, onValue, onDisconnect } from "firebase/database";
import { db } from "./config";

export const sendMessage = (message) => {
  const msgRef = push(ref(db, "messages"));
  set(msgRef, {
    ...message,
    createdAt: Date.now(),
  });
};


export const listenMessages = (cb) => {
  const msgRef = ref(db, "messages");
  return onValue(msgRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messages = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
    cb(messages);
  });
};


export const updateUserStatus = (userId, email) => {
  if (!userId) return;

  const statusRef = ref(db, `status/${userId}`);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
      set(statusRef, { 
        state: "online", 
        email: email || "Anonymous", 
        lastChanged: Date.now() 
      });

      onDisconnect(statusRef).set({ 
        state: "offline", 
        email: email || "Anonymous", 
        lastChanged: Date.now() 
      });
    }
  });
};


export const listenAllStatuses = (cb) => {
  const statusRef = ref(db, "status");
  return onValue(statusRef, (snapshot) => {
    const data = snapshot.val() || {};
    const statuses = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
    cb(statuses);
  });
};