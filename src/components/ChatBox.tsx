import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../contexts/authContext";
import { IoSend } from "react-icons/io5";
import logo from '../assets/icons/logo.svg'

const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true
});

interface ChatBoxProps {
  roomId: string;
  isAdminView?: boolean;
}

const ChatBox = ({ roomId, isAdminView = false }: ChatBoxProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/history/${roomId}`);
        setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [roomId]);

  useEffect(() => {
    socket.emit("join_chat", roomId);
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => { socket.off("receive_message"); };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room: roomId,
        senderId: user?.id || user?._id,
        message: message,
        sender: { name: user?.name, profileimg: user?.profileimg }
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  return (
    <div className={`flex flex-col bg-white overflow-hidden ${
      !isAdminView 
        ? 'w-80 sm:w-96 h-[500px] shadow-2xl rounded-2xl border border-gray-100 ring-1 ring-black/5' 
        : 'h-full w-full'
    }`}>
      
      {!isAdminView && (
        <div className="shrink-0 bg-linear-to-r from-blue-600 to-sky-500 p-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo"  className=""/>
            <span className="font-bold text-sm">Tripvisito Support</span>
            <div className="size-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => {
          const isMe = msg.sender?._id === (user?.id || user?._id) || msg.senderId === (user?.id || user?._id);
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-xl shadow-xs text-xs leading-relaxed ${
                isMe ? "bg-blue-500 text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
              }`}>
                {msg.message}
                <span className={`text-[8px] block text-right mt-1 opacity-70`}>
                   {new Date(msg.timeStamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="shrink-0 p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Message us..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-sky-400"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-sky-600 active:scale-95 transition-all">
          <IoSend size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;