import { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";

const AIChatbot = ({ isOpen, onClose, currentCode, currentLanguage }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI coding assistant. I can help you with:\n\n• Explaining code snippets\n• Debugging errors\n• Suggesting solutions\n• Best practices\n• Documentation & examples\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build context with current code if available
      let contextMessage = input;
      if (currentCode && currentCode !== "// start code here") {
        contextMessage = `I'm working with ${currentLanguage} code:\n\`\`\`${currentLanguage}\n${currentCode}\n\`\`\`\n\nQuestion: ${input}`;
      }

      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contextMessage,
          history: messages.slice(-6) // Last 3 exchanges for context
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I encountered an error. Please try again or check your connection."
      }]);
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertCodeContext = () => {
    if (currentCode && currentCode !== "// start code here") {
      setInput(`Can you help me with this ${currentLanguage} code?\n\n\`\`\`${currentLanguage}\n${currentCode}\n\`\`\``);
    }
  };

  const quickActions = [
    { text: "Explain this code", action: () => setInput("Can you explain what this code does?") },
    { text: "Find bugs", action: () => setInput("Are there any bugs or issues in my code?") },
    { text: "Optimize code", action: () => setInput("How can I optimize this code?") },
    { text: "Add comments", action: () => setInput("Can you add explanatory comments to this code?") }
  ];

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-overlay">
      <div className="ai-chatbot-container">
        <div className="ai-chatbot-header">
          <div className="ai-header-left">
            <div className="ai-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2>AI Code Assistant</h2>
              <p className="ai-status">
                <span className="status-dot"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="ai-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="ai-chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === "assistant" ? "🤖" : "👤"}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {msg.content.split("```").map((part, i) => {
                    if (i % 2 === 1) {
                      const lines = part.split("\n");
                      const lang = lines[0];
                      const code = lines.slice(1).join("\n");
                      return (
                        <pre key={i} className="code-block">
                          <div className="code-header">{lang || "code"}</div>
                          <code>{code}</code>
                        </pre>
                      );
                    }
                    return part.split("\n").map((line, j) => (
                      <p key={`${i}-${j}`}>{line}</p>
                    ));
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-quick-actions">
          <button onClick={insertCodeContext} className="quick-action-btn code-context-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Insert Current Code
          </button>
          {quickActions.map((action, i) => (
            <button key={i} onClick={action.action} className="quick-action-btn">
              {action.text}
            </button>
          ))}
        </div>

        <div className="ai-chatbot-input">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your code..."
            disabled={isLoading}
            rows={1}
          />
          <button onClick={sendMessage} disabled={!input.trim() || isLoading} className="send-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;