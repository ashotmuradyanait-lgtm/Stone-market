import { ref, push, set, onValue, serverTimestamp, onDisconnect, update } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";

/**
 * 0. Ճիշտ Chat ID-ի ստեղծում (ՍՈՐՏԱՎՈՐՎԱԾ)
 * Սա երաշխավորում է, որ երկու օգտատերերի մոտ էլ նույն "սենյակը" լինի
 */
export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;
  return [uid1, uid2].sort().join("_");
};

/**
 * 1. Ձայնային ազդանշան նոր նամակի դեպքում
 */
const playSmsSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
  audio.play().catch(err => console.warn("Audio play blocked:", err));
};

/**
 * 2. Մեդիա (նկարների) վերբեռնում Firebase Storage
 */
export const uploadMedia = async (file, chatId) => {
  if (!file) return null;
  const storageRef = sRef(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

/**
 * 3. Հաղորդագրություն ուղարկել
 */
export const sendMessage = (chatId, messageData) => {
  if (!chatId) return;
  const msgRef = push(ref(db, `private_chats/${chatId}`));
  
  return set(msgRef, {
    ...messageData,
    id: msgRef.key,
    status: "unread", // Կարևոր է հաշվիչի համար
    createdAt: serverTimestamp(),
  });
};

/**
 * 4. Հաղորդագրությունները կարդացված նշել (Header-ի թիվը պակասեցնելու համար)
 */
export const markAsRead = (chatId, messages, currentUserId) => {
  if (!chatId || !messages.length) return;

  const updates = {};
  messages.forEach((msg) => {
    // Եթե նամակը դիմացինն է գրել ու այն դեռ unread է
    if (msg.userId !== currentUserId && msg.status === "unread") {
      updates[`private_chats/${chatId}/${msg.id}/status`] = "read";
    }
  });

  if (Object.keys(updates).length > 0) {
    update(ref(db), updates);
  }
};

/**
 * 5. Չկարդացած նամակների ընդհանուր քանակը (Header-ի համար)
 * ՍԱ ԱՅՆ ՖՈՒՆԿՑԻԱՆ Է, ՈՐԻ ՊԱՏՃԱՌՈՎ SYNTAX ERROR ԷԻՐ ՍՏԱՆՈՒՄ
 */
export const listenUnreadCount = (currentUserId, cb) => {
  if (!currentUserId) return;
  const chatsRef = ref(db, "private_chats");
  
  return onValue(chatsRef, (snapshot) => {
    const allChats = snapshot.val() || {};
    let totalUnread = 0;

    Object.keys(allChats).forEach(chatKey => {
      // Ստուգում ենք միայն այն չատերը, որտեղ այս user-ը կա
      if (chatKey.includes(currentUserId)) {
        const messages = allChats[chatKey];
        Object.values(messages).forEach(msg => {
          if (msg.userId !== currentUserId && msg.status === "unread") {
            totalUnread++;
          }
        });
      }
    });
    cb(totalUnread);
  });
};

/**
 * 6. Հաղորդագրությունները լսել (Real-time)
 */
export const listenMessages = (chatId, currentUserId, cb) => {
  if (!chatId) return;
  const msgRef = ref(db, `private_chats/${chatId}`);
  let isFirstLoad = true;

  return onValue(msgRef, (snapshot) => {
    const data = snapshot.val() || {};
    const messages = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    })).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    // Եթե նոր նամակ է գալիս (ոչ առաջին բեռնման ժամանակ)
    if (!isFirstLoad && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.userId !== currentUserId) {
        playSmsSound();
      }
    }

    isFirstLoad = false;
    cb(messages);
  });
};

/**
 * 7. Օգտատիրոջ Online/Offline ստատուսը թարմացնել
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
      onDisconnect(statusRef).set({ ...statusData, state: "offline", lastChanged: serverTimestamp() });
    }
  });
};

/**
 * 8. Բոլոր օգտատերերի ստատուսները լսել (Sidebar-ի համար)
 */
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