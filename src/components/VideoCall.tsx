import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function VideoCall() {
  // 1. Տիպավորում ենք roomId-ն որպես string
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  // 2. Տիպավորում ենք ref-ը HTMLDivElement-ի համար
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async () => {
      // ՍԱ ԿԱՐԵՎՈՐ Է. Տեղադրիր քո իրական AppID-ն և ServerSecret-ը
      const appID: number = 123456789; 
      const serverSecret: string = "քո_իրական_server_secret_կոդը";

      if (!roomId) return;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(), // User ID
        "User_" + Math.floor(Math.random() * 100) // User Name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      if (containerRef.current) {
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          onLeaveRoom: () => {
            navigate('/chat');
          },
        });
      }
    };

    if (containerRef.current) {
      myMeeting();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [roomId, navigate]);

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
      <div 
        ref={containerRef} 
        className="w-full h-full"
      ></div>
    </div>
  );
}