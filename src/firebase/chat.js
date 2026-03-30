import { ref, push, set, onValue, serverTimestamp, onDisconnect } from "firebase/database";
import { db } from "./config";

// 1. Ձայնային ազդանշանի ֆունկցիա
const playSmsSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
  // Կամ եթե ունես public/sms.mp3, օգտագործիր՝ new Audio('/sms.mp3');
  audio.play().catch(err => console.warn("Ձայնի նվագարկման արգելք (Browser policy):", err));
};

/**
 * 2. Օգնող ֆունկցիա՝ սարքում է ունիկալ և նույնական ID երկու օգտատիրոջ համար
 */
export const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};

/**
 * 3. Հաղորդագրություն ուղարկելու ֆունկցիան
 */
export const sendMessage = (chatPath, messageData) => {
  const targetPath = chatPath || "messages";
  const msgRef = push(ref(db, targetPath));
  
  return set(msgRef, {
    ...messageData,
    createdAt: serverTimestamp(),
  });
};

/**
 * 4. Հաղորդագրությունները լսելու ֆունկցիան + ՁԱՅՆ
 */
export const listenMessages = (chatPath, cb) => {
  const targetPath = chatPath || "messages";
  const msgRef = ref(db, targetPath);
  
  let isFirstLoad = true; // Որպեսզի հին նամակների վրա ձայն չհանի

  return onValue(msgRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messages = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    })).sort((a, b) => a.createdAt - b.createdAt);

    // Եթե սա առաջին բեռնումը չէ և նոր նամակ կա՝ միացնում ենք ձայնը
    if (!isFirstLoad && messages.length > 0) {
      playSmsSound();
    }

    isFirstLoad = false;
    cb(messages);
  });
};

/**
 * 5. Օգտատիրոջ ստատուսի թարմացում (Online/Offline)
 */
export const updateUserStatus = (userId, email) => {
  if (!userId) return;

  const statusRef = ref(db, `status/${userId}`);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
      const statusData = { 
        id: userId,
        state: "online", 
        email: email || "Anonymous", 
        lastChanged: serverTimestamp() 
      };

      set(statusRef, statusData);

      // Երբ օգտատերը անջատվում է
      onDisconnect(statusRef).set({ 
        ...statusData,
        state: "offline", 
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