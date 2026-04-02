import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const myMeeting = async () => {
      // ՍԱ ԿԱՐԵՎՈՐ Է. Տեղադրիր քո իրական AppID-ն և ServerSecret-ը ZegoCloud-ից
      const appID = 123456789; // Փոխիր սա
      const serverSecret = "քո_իրական_server_secret_կոդը"; // Փոխիր սա

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(), // User ID
        "User_" + Math.floor(Math.random() * 100) // User Name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => {
          // Երբ օգտատերը դուրս է գալիս զանգից, վերադառնում է չատ
          navigate('/chat');
        },
      });
    };

    if (containerRef.current) {
      myMeeting();
    }

    // Մաքրման ֆունկցիա (cleanup), երբ էջը փակվում է
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