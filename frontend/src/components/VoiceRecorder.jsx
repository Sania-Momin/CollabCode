import { useState, useRef, useEffect } from "react";
import "./VoiceRecorder.css";

const VoiceRecorder = ({ onSendVoice, socket, roomId, userName }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setShowPreview(true);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setAudioURL(null);
    setShowPreview(false);
    setRecordingTime(0);
  };

  const sendVoiceMessage = () => {
    if (audioURL && audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      // Convert blob to base64 for socket transmission
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        
        const voiceMessage = {
          user: userName,
          audio: base64Audio,
          duration: recordingTime,
          timestamp: new Date().toISOString(),
          type: "voice"
        };

        socket.emit("voiceMessage", { roomId, message: voiceMessage });
        onSendVoice(voiceMessage);
        
        // Reset
        setAudioURL(null);
        setShowPreview(false);
        setRecordingTime(0);
        audioChunksRef.current = [];
      };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showPreview) {
    return (
      <div className="voice-preview-container">
        <div className="voice-preview-content">
          <div className="audio-wave-preview">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
          <audio src={audioURL} controls className="audio-player" />
          <div className="preview-time">{formatTime(recordingTime)}</div>
        </div>
        <div className="voice-preview-actions">
          <button className="voice-btn cancel" onClick={cancelRecording}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="voice-btn send" onClick={sendVoiceMessage}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="voice-recording-container">
        <div className="recording-indicator">
          <div className="pulse-dot"></div>
          <span>Recording...</span>
        </div>
        <div className="recording-visualization">
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
          <div className="wave-bar active"></div>
        </div>
        <div className="recording-time">{formatTime(recordingTime)}</div>
        <div className="recording-actions">
          <button className="voice-btn cancel" onClick={cancelRecording}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="voice-btn stop" onClick={stopRecording}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="mic-button" onClick={startRecording} title="Record voice message">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
};

export default VoiceRecorder;