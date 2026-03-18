import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;  

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: new Date()
    });

    setMessage("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">

      <div className="border h-80 overflow-y-scroll p-4 mb-4 rounded-lg">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 bg-gray-200 p-2 rounded-lg">
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default Chat;