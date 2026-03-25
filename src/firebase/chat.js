import { ref, push, set, onValue, onDisconnect, serverTimestamp } from "firebase/database";
import { db } from "./config";

const playSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');

  audio.play().catch(err => console.warn("Ձայնը հնարավոր չեղավ նվագարկել:", err));
};

export const sendMessage = (message) => {
  const msgRef = push(ref(db, "messages"));
  return set(msgRef, {
    ...message,
    createdAt: serverTimestamp(), 
  });
};

export const listenMessages = (cb) => {
  const msgRef = ref(db, "messages");
  
  let initialLoad = true;

  return onValue(msgRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messages = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    // Եթե սա առաջին բեռնումը չէ, նշանակում է նոր նամակ է եկել
    if (!initialLoad) {
      playSound();
    }
    
    initialLoad = false;
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
        lastChanged: serverTimestamp() 
      });

      onDisconnect(statusRef).set({ 
        state: "offline", 
        email: email || "Anonymous", 
        lastChanged: serverTimestamp() 
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