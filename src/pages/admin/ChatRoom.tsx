import { useEffect, useState } from "react";
import { IoSearch, IoChatbubblesOutline, IoClose, IoArrowBack } from "react-icons/io5";
import Header from "../../components/Header";
import ChatBox from "../../components/ChatBox";
import { fetchChatUsers } from "../../services/chat";
import io from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(import.meta.env.VITE_API_SOCKET_URL);

const ChatRoom = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const response = await fetchChatUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error loading chat users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 2. Real-time Synchronization 
  useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      loadUsers();

      const isCurrentlySelected = selectedUser?._id === newMessage.senderId;
      if (!isCurrentlySelected) {
        toast.success(`New message from ${newMessage.sender.name}`, {
          icon: '💬',
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser, users]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="w-full min-h-screen flex flex-col gap-6 max-w-7xl mx-auto px-4 lg:px-8 pb-4">

      <Header title="Message Center" description="Connect with your customers in real-time." />

      <section className="grid grid-cols-1 md:grid-cols-12 bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100 h-[75vh] md:h-[650px]">
        
        {/* --- SIDEBAR (USER LIST) --- */}
        <aside className={`${selectedUser ? "hidden" : "flex"} md:col-span-4 md:flex border-r border-gray-100 flex-col bg-white h-full`}>
          <div className="p-5 border-b border-gray-50 bg-gray-50/30 shrink-0">
            <div className="relative">
              <IoSearch className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-400 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`flex items-center gap-4 p-4 cursor-pointer border-b border-gray-50 hover:bg-sky-50/50 transition-all ${
                    selectedUser?._id === u._id ? "bg-sky-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={u.profileimg} alt="" className="size-11 rounded-full border shadow-sm" />
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-sm font-bold text-gray-800 truncate">{u.name}</h3>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {u.lastTimestamp ? new Date(u.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate leading-tight italic">
                      {u.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-10 text-sm italic">No active users</p>
            )}
          </div>
        </aside>

        {/* --- CHAT WINDOW --- */}
        <section className={`${selectedUser ? "flex" : "hidden"} md:col-span-8 md:flex bg-white flex-col h-full overflow-hidden`}>
          {selectedUser ? (
            <div className="flex flex-col h-full">
              <div className="shrink-0 flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-full">
                    <IoArrowBack size={24} />
                  </button>
                  <img src={selectedUser.profileimg} className="size-10 rounded-full border shadow-sm" alt="" />
                  <div>
                    <h2 className="font-bold text-gray-800 text-sm">{selectedUser.name}</h2>
                    <p className="text-[10px] text-green-500">Connected</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="hidden md:block p-2 text-gray-400 hover:text-red-500">
                  <IoClose size={22} />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox roomId={selectedUser._id} isAdminView={true} /> 
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full gap-5 text-center p-10">
              <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                <IoChatbubblesOutline size={60} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Inbox</h2>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">Select a customer from the left to view their inquiries and start a conversation.</p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default ChatRoom;