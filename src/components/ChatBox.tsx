import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../contexts/authContext";
import { IoSend, IoSparklesOutline } from "react-icons/io5";
import logo from '../assets/icons/logo.svg';

interface ChatBoxProps {
  roomId: string;
  isAdminView?: boolean;
}

const FAQ_CHIPS = [
  "💳 How do payments work?",
  "📅 Cancellation policy",
  "🛂 Visa & requirements",
  "🙋 Speak to human agent",
];

const ChatBox = ({ roomId, isAdminView = false }: ChatBoxProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history/${roomId}`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    if (roomId) {
      fetchHistory();
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
      transports: ["websocket"],
      upgrade: false,
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.emit("join_chat", roomId);
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || message).trim();
    if (content && socketRef.current) {
      const messageData = {
        room: roomId,
        senderId: user?.id || user?._id,
        message: content,
        sender: { name: user?.name, profileimg: user?.profileimg },
      };
      socketRef.current.emit("send_message", messageData);
      setMessage("");

      // Simulate brief typing indicator for admin reply if not admin
      if (!isAdminView) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  };

  return (
    <div className={`flex flex-col bg-white overflow-hidden ${
      !isAdminView 
        ? 'w-80 sm:w-96 h-[520px] shadow-2xl rounded-3xl border border-slate-100 ring-1 ring-black/5' 
        : 'h-full w-full'
    }`}>
      
      {!isAdminView && (
        <div className="shrink-0 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-white/20 backdrop-blur-md p-1 flex items-center justify-center">
              <img src={logo} alt="logo" className="size-5 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Tripvisito Concierge</span>
                <div className="size-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-[10px] text-white/80">Active · Usually replies in minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-slate-50/60">
        {messages.length === 0 && !isAdminView && (
          <div className="text-center py-6 px-4">
            <div className="size-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
              <IoSparklesOutline size={24} />
            </div>
            <h4 className="text-xs font-bold text-slate-700">How can we help your travels?</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Ask us anything about itineraries, visa requirements, booking changes, or custom requests.
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.sender?._id === (user?.id || user?._id) || msg.senderId === (user?.id || user?._id);
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-xs text-xs leading-relaxed ${
                isMe 
                  ? "bg-blue-600 text-white rounded-tr-xs" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-xs"
              }`}>
                {msg.message}
                <span className={`text-[9px] block text-right mt-1 ${isMe ? "text-blue-100" : "text-slate-400"}`}>
                   {new Date(msg.timeStamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-xs">
              <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Quick Reply FAQ Chips */}
      {!isAdminView && (
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {FAQ_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Message Concierge..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          onClick={() => handleSendMessage()} 
          aria-label="Send message"
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <IoSend size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
