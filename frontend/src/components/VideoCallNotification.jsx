import { useEffect, useState } from "react";
import "./VideoCallNotification.css";

export default function VideoCallNotification({ socket, roomId, onAccept, onDecline }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [ringtone] = useState(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77NiGwU7k9r0yXksBSh+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXx0YI2Bxt0xvDdlUQMF2q64+qoVxIMS6Li8bZnHgU5kdT0yn0vBSh/zfPajTsKGGS66+ijUhELTKXh8bllHAU2jdXx0YI2Bxt0xvDdlUQMF2q64+qoVxIMS6Li8bZnHgU5kdT0yn0vBSh/zfPajTsKGGS66+ijUhELTKXh8bllHAU2jdXx0YI2Bxt0xvDdlUQMF2q64+qoVxIMS6Li8bZnHgU5kdT0yn0vBSh/zfPajTsKGGS66+ijUhELTKXh8bllHAU2jdXx0YI2Bxt0xvDdlUQMF2q64+qoVxIMS6Li8bZnHgU5kdT0yn0vBSh/zfPajTsKGGS66+ijUhELTKXh8bllHAU2jdXx0YI2B'));
  
  useEffect(() => {
    const handleIncomingVideoCall = ({ callerId, callerName }) => {
      setIncomingCall({ callerId, callerName });
      
      // Play ringtone
      ringtone.loop = true;
      ringtone.play().catch(err => console.log("Ringtone play failed:", err));
    };

    socket.on("incomingVideoCall", handleIncomingVideoCall);

    return () => {
      socket.off("incomingVideoCall");
      ringtone.pause();
      ringtone.currentTime = 0;
    };
  }, [socket, ringtone]);

  const handleAccept = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
    
    socket.emit("acceptVideoCall", { 
      roomId, 
      callerId: incomingCall.callerId 
    });
    
    setIncomingCall(null);
    onAccept();
  };

  const handleDecline = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
    
    socket.emit("declineVideoCall", { 
      roomId, 
      callerId: incomingCall.callerId 
    });
    
    setIncomingCall(null);
    onDecline();
  };

  if (!incomingCall) return null;

  return (
    <div className="video-call-notification-overlay">
      <div className="video-call-notification">
        <div className="notification-header">
          <div className="caller-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="notification-pulse"></div>
        </div>
        
        <div className="notification-content">
          <h2>Incoming Video Call</h2>
          <p className="caller-name">{incomingCall.callerName}</p>
          <p className="call-type">wants to start a video call</p>
        </div>

        <div className="notification-actions">
          <button className="accept-btn" onClick={handleAccept}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            Accept
          </button>
          
          <button className="decline-btn" onClick={handleDecline}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}