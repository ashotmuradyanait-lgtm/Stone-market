import { ref, set, onValue, onDisconnect, serverTimestamp } from "firebase/database";
import { db } from "./config";

export const setupPresence = (userId) => {
  if (!userId) return;

  const statusRef = ref(db, "/status/" + userId);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === false) return;

    onDisconnect(statusRef).set({
      state: "offline",
      time: serverTimestamp(),
    });

    set(statusRef, {
      state: "online",
      time: serverTimestamp(),
    });
  });
};

export const listenStatus = (cb) => {
  const statusRef = ref(db, "/status");

  return onValue(statusRef, (snap) => {
    cb(snap.val());
  });
};