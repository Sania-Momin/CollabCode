import { useState, useEffect, useRef } from "react";
import "./VideoCall.css";

export default function VideoCall({ socket, roomId, userName, isOpen, onClose }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const remoteVideoRefs = useRef(new Map());

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    if (!isOpen) return;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("joinVideoCall", { roomId, userName });
      } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Unable to access camera/microphone. Please check permissions.");
      }
    };

    initializeMedia();

    // Socket event listeners
    socket.on("userJoinedVideoCall", ({ userId, userName: participantName }) => {
      console.log(`📹 ${participantName} joined video call`);
      setParticipants(prev => [...prev, { userId, userName: participantName }]);
      createPeerConnection(userId, participantName, true);
    });

    socket.on("userLeftVideoCall", ({ userId }) => {
      console.log(`📹 User ${userId} left video call`);
      closePeerConnection(userId);
      setParticipants(prev => prev.filter(p => p.userId !== userId));
    });

    socket.on("videoOffer", async ({ offer, senderId, senderName }) => {
      console.log(`📹 Received offer from ${senderName}`);
      await handleVideoOffer(offer, senderId, senderName);
    });

    socket.on("videoAnswer", async ({ answer, senderId }) => {
      console.log(`📹 Received answer from ${senderId}`);
      const pc = peerConnections.current.get(senderId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("iceCandidate", async ({ candidate, senderId }) => {
      const pc = peerConnections.current.get(senderId);
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("userJoinedVideoCall");
      socket.off("userLeftVideoCall");
      socket.off("videoOffer");
      socket.off("videoAnswer");
      socket.off("iceCandidate");
    };
  }, [isOpen, socket, roomId, userName]);

  const createPeerConnection = (userId, participantName, createOffer) => {
    const pc = new RTCPeerConnection(configuration);
    peerConnections.current.set(userId, pc);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      console.log(`📹 Received remote track from ${participantName}`);
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, { stream: event.streams[0], userName: participantName });
        return newMap;
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", {
          roomId,
          candidate: event.candidate,
          targetId: userId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`📹 Connection state: ${pc.connectionState}`);
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        closePeerConnection(userId);
      }
    };

    if (createOffer) {
      createAndSendOffer(pc, userId);
    }

    return pc;
  };

  const createAndSendOffer = async (pc, targetId) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("videoOffer", {
        roomId,
        offer,
        targetId,
        senderName: userName,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleVideoOffer = async (offer, senderId, senderName) => {
    let pc = peerConnections.current.get(senderId);
    if (!pc) {
      pc = createPeerConnection(senderId, senderName, false);
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit("videoAnswer", {
        roomId,
        answer,
        targetId: senderId,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const closePeerConnection = (userId) => {
    const pc = peerConnections.current.get(userId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(userId);
    }
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const handleClose = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    setRemoteStreams(new Map());
    
    socket.emit("leaveVideoCall", { roomId });
    onClose();
  };

  useEffect(() => {
    remoteStreams.forEach((data, userId) => {
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement && data.stream) {
        videoElement.srcObject = data.stream;
      }
    });
  }, [remoteStreams]);

  if (!isOpen) return null;

  return (
    <div className={`video-call-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="video-call-header">
        <div className="video-call-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <span>Video Call ({participants.length + 1} participants)</span>
        </div>
        <div className="video-call-controls-header">
          <button 
            className="minimize-btn" 
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 14 10 14 10 20"/>
                <polyline points="20 10 14 10 14 4"/>
                <line x1="14" y1="10" x2="21" y2="3"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            )}
          </button>
          <button className="close-video-btn" onClick={handleClose} title="End Call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="video-grid">
            {/* Local Video */}
            <div className="video-wrapper local">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="video-element"
              />
              <div className="video-label">
                <span className="video-name">{userName} (You)</span>
                {!isVideoEnabled && <span className="video-status">Camera Off</span>}
                {!isAudioEnabled && <span className="video-status">Muted</span>}
              </div>
            </div>

            {/* Remote Videos */}
            {Array.from(remoteStreams.entries()).map(([userId, data]) => (
              <div key={userId} className="video-wrapper remote">
                <video
                  ref={el => {
                    if (el) remoteVideoRefs.current.set(userId, el);
                  }}
                  autoPlay
                  playsInline
                  className="video-element"
                />
                <div className="video-label">
                  <span className="video-name">{data.userName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="video-call-controls">
            <button 
              className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
              onClick={toggleAudio}
              title={isAudioEnabled ? "Mute" : "Unmute"}
            >
              {isAudioEnabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                </svg>
              )}
            </button>

            <button 
              className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
              onClick={toggleVideo}
              title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoEnabled ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
                </svg>
              )}
            </button>

            <button 
              className="control-btn end-call"
              onClick={handleClose}
              title="End Call"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
       .<path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1z"/>
                </svg>
            </button>
            </div>
        </>
        )}
    </div>
    );
}