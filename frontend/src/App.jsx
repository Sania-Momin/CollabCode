import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AIChatbot from "./components/AIChatbot";
import FileManager from "./components/FileManager";
import VoiceRecorder from "./components/VoiceRecorder";
import VideoCall from "./components/VideoCall";
import VideoCallNotification from "./components/VideoCallNotification";

const socket = io("http://localhost:5000");

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return token && user ? children : <Navigate to="/login" />;
};

// VoiceMessage component
const VoiceMessage = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useState(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="voice-message-container">
      <div className="voice-message-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
        <span>Voice Message</span>
      </div>
      <div className="voice-message-player">
        <button className="play-voice-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <div className="voice-waveform">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`voice-waveform-bar ${isPlaying ? 'playing' : ''}`} />
          ))}
        </div>
        <span className="voice-duration">{message.duration}s</span>
      </div>
      <audio ref={audioRef} src={message.audio} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

// EditorRoom component
const EditorRoom = () => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [errors, setErrors] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [version, setVersion] = useState("*");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showRoomOptions, setShowRoomOptions] = useState(true);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  
  // Video call states
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [showVideoNotification, setShowVideoNotification] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserName(storedUser.name);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("voiceMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("languageUpdate", (newLanguage) => setLanguage(newLanguage));
    socket.on("codeResponse", (response) => {
      setOutPut(response.output || "");
      setErrors(response.stderr || "");
    });

    socket.on("fileContentUpdated", ({ id, content }) => {
      if (currentFile && currentFile.id === id) {
        setCode(content);
      }
    });

    socket.on("fileSelected", ({ file, language: detectedLanguage }) => {
      if (file && file.type === "file") {
        setCurrentFile(file);
        setCode(file.content || "// File is empty");
        
        if (detectedLanguage && detectedLanguage !== language) {
          setLanguage(detectedLanguage);
        }
      }
    });

    // Video call notification
    socket.on("incomingVideoCall", () => {
      setShowVideoNotification(true);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("voiceMessage");
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
      socket.off("fileContentUpdated");
      socket.off("fileSelected");
      socket.off("incomingVideoCall");
    };
  }, [currentFile, language]);

  useEffect(() => {
    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const createRoom = () => {
    const uniqueRoomId = `room-${Math.random().toString(36).substr(2, 9)}`;
    setRoomId(uniqueRoomId);
    socket.emit("join", { roomId: uniqueRoomId, userName });
    setJoined(true);
    setShowRoomOptions(false);
  };

  const handleJoinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
      setShowRoomOptions(false);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setCode("// start code here");
    setLanguage("javascript");
    setShowRoomOptions(true);
    setCurrentFile(null);
    setIsVideoCallOpen(false);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
    
    if (currentFile) {
      socket.emit("updateFileContent", {
        roomId,
        fileId: currentFile.id,
        content: newCode,
      });
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    const nonExecutableLanguages = ['html', 'css', 'json', 'markdown'];
    
    if (nonExecutableLanguages.includes(language)) {
      switch(language) {
        case 'html':
          const htmlBlob = new Blob([code], { type: 'text/html' });
          const htmlUrl = URL.createObjectURL(htmlBlob);
          window.open(htmlUrl, '_blank');
          setOutPut("✅ HTML opened in new tab");
          break;
        case 'css':
          setOutPut("ℹ️ CSS is a styling language. It needs HTML to be applied.");
          break;
        case 'json':
          try {
            JSON.parse(code);
            setOutPut("✅ Valid JSON syntax");
          } catch (error) {
            setErrors(`❌ Invalid JSON: ${error.message}`);
          }
          break;
        case 'markdown':
          setOutPut("📝 Markdown Content:\n" + code);
          break;
      }
      setErrors("");
      return;
    }

    setOutPut("Running...");
    setErrors("");
    
    const versionMap = {
      'javascript': '18.15.0',
      'typescript': '5.0.3',
      'python': '3.10.0',
      'java': '15.0.2',
      'cpp': '10.2.0',
      'c': '10.2.0',
      'php': '8.2.3',
      'ruby': '3.2.2',
      'go': '1.16.2',
      'rust': '1.68.2'
    };

    const version = versionMap[language] || '*';
    
    socket.emit("compileCode", { 
      code, 
      roomId, 
      language, 
      version, 
      input: inputCode 
    });
  };

  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    const msg = { user: userName, text: chatInput, type: "text" };
    socket.emit("chatMessage", { roomId, msg });
    setMessages((prev) => [...prev, msg]);
    setChatInput("");
  };

  const handleVoiceSend = (voiceMessage) => {
    setMessages((prev) => [...prev, voiceMessage]);
  };

  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCode(file.content || "// File is empty");
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown'
    };
    
    const detectedLanguage = languageMap[fileExtension] || 'javascript';
    
    if (detectedLanguage !== language) {
      setLanguage(detectedLanguage);
      socket.emit("languageChange", { roomId, language: detectedLanguage });
    }
  };

  const startVideoCall = () => {
    socket.emit("startVideoCall", { roomId, userName });
    setIsVideoCallOpen(true);
  };

  const handleAcceptCall = () => {
    setShowVideoNotification(false);
    setIsVideoCallOpen(true);
  };

  const handleDeclineCall = () => {
    setShowVideoNotification(false);
  };

  if (!joined) {
    if (showRoomOptions) {
      return (
        <div className="join-container">
          <div className="room-options-container">
            <h1>Welcome, {userName.split(' ')[0]}! 👋</h1>
            <p className="subtitle">Choose how you want to collaborate</p>
            
            <div className="options-grid">
              <div className="option-card" onClick={createRoom}>
                <div className="option-icon create">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </div>
                <h2>Create New Room</h2>
                <p>Start a fresh coding session with a unique room ID</p>
                <button className="option-btn create-btn">Create Room</button>
              </div>

              <div className="option-card" onClick={() => setShowRoomOptions(false)}>
                <div className="option-icon join">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </div>
                <h2>Join Existing Room</h2>
                <p>Enter a room ID to join your team's session</p>
                <button className="option-btn join-btn">Join Room</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="join-container">
        <div className="join-form">
          <button className="back-button" onClick={() => setShowRoomOptions(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back To Room Selection
          </button>
          
          <div className="form-header">
            <h1>Join Code Room</h1>
            <p className="join-subtitle">Enter the room ID shared by your team</p>
          </div>

          <div className="join-form-input-group">
            <div>
              <div className="input-label">Room ID</div>
              <input
                type="text"
                placeholder="Enter Room ID (e.g., room-abc123xyz)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            
            <div>
              <div className="input-label">Your Name</div>
              <input 
                type="text" 
                value={userName} 
                readOnly 
                placeholder="Your display name"
              />
            </div>
          </div>

          <button onClick={handleJoinRoom} disabled={!roomId.trim()}>
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="editor-container">
        <div className="sidebar">
          <div className="room-info">
            <h2>Code Room: {roomId}</h2>
            <button onClick={copyRoomId} className="copy-button">
              Copy Id
            </button>
            {copySuccess && <span className="copy-success">{copySuccess}</span>}
          </div>
          <h3>Users:</h3>
          <ul>
            {users.map((user, i) => (
              <li key={i}>{user.slice(0, 8)}...</li>
            ))}
          </ul>
          <p className="typing-indicator">{typing}</p>
          <select className="language-selector" value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="php">PHP</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
          
          <button className="video-call-button" onClick={startVideoCall}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Start Video Call
          </button>

          <button className="file-manager-button" onClick={() => setIsFileManagerOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            File Manager
          </button>

          <button className="ai-assistant-button" onClick={() => setIsAIChatOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            AI Assistant
          </button>

          <button className="leave-button" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>

        <div className="editor-wrapper">
          {currentFile && (
            <div className="editor-file-tab">
              <span className="file-tab-icon">{currentFile.type === "folder" ? "📁" : "📄"}</span>
              <span className="file-tab-name">{currentFile.name}</span>
            </div>
          )}
          <Editor
            height={"50%"}
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />

          <div className="io-section">
            <textarea
              className="input-box"
              placeholder="Enter program input..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button className="run-btn" onClick={runCode}>Run Code</button>

            <div className="output-section">
              <h3>Output:</h3>
              <pre className="output-console">{outPut || "No output yet..."}</pre>

              {errors && (
                <>
                  <h3 style={{ color: "#ff5252" }}>Errors:</h3>
                  <pre className="error-console">{errors}</pre>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="chat-section">
          <h3>Chat Section</h3>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.user === userName ? "self" : ""}`}>
                {msg.type === "voice" ? (
                  <>
                    <strong>{msg.user.slice(0, 8)}:</strong>
                    <VoiceMessage message={msg} />
                  </>
                ) : (
                  <>
                    <strong>{msg.user.slice(0, 8)}:</strong> {msg.text}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <VoiceRecorder 
              onSendVoice={handleVoiceSend}
              socket={socket}
              roomId={roomId}
              userName={userName}
            />
          </div>
        </div>
      </div>

      <AIChatbot 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)}
        currentCode={code}
        currentLanguage={language}
      />

      <FileManager
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        onFileSelect={handleFileSelect}
        currentFile={currentFile}
        socket={socket}
        roomId={roomId}
        code={code}
      />

      <VideoCall
        socket={socket}
        roomId={roomId}
        userName={userName}
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
      />

      {showVideoNotification && (
        <VideoCallNotification
          socket={socket}
          roomId={roomId}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </>
  );
};

const AppWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <EditorRoom />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppWrapper;