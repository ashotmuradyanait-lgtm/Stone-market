import { ref, set, onValue, onDisconnect, serverTimestamp, DatabaseReference, DataSnapshot } from "firebase/database";
import { rtdb } from "./config"; // Համոզվիր, որ օգտագործում ես Realtime DB-ն (rtdb)

// 1. Սահմանում ենք ստատուսի տիպը
interface UserStatus {
  state: "online" | "offline";
  time: object; // Firebase serverTimestamp-ը օբյեկտ է
  email?: string;
  id?: string;
}

/**
 * Կարգավորում է օգտատիրոջ online/offline վիճակը
 */
export const setupPresence = (userId: string | undefined): void => {
  if (!userId) return;

  // Ուշադրություն. Presence-ի համար օգտագործում ենք rtdb-ն (Realtime Database)
  const statusRef: DatabaseReference = ref(rtdb, "/status/" + userId);
  const connectedRef: DatabaseReference = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snap: DataSnapshot) => {
    if (snap.val() === false) return;

    // Երբ կապը կտրվում է
    onDisconnect(statusRef).set({
      state: "offline",
      time: serverTimestamp(),
    });

    // Երբ միացած է
    set(statusRef, {
      state: "online",
      time: serverTimestamp(),
    });
  });
};

/**
 * Լսում է բոլոր օգտատերերի ստատուսները
 */
export const listenStatus = (cb: (statuses: Record<string, UserStatus> | null) => void) => {
  const statusRef: DatabaseReference = ref(rtdb, "/status");

  return onValue(statusRef, (snap: DataSnapshot) => {
    // snap.val() կվերադարձնի օբյեկտ, որտեղ key-երը userId-ներն են
    cb(snap.val());
  });
};