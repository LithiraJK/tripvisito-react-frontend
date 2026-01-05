import { useState, useEffect } from "react";
import {
  IoTrashOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notification"; // Using your service [cite: 2025-10-11]
import toast from "react-hot-toast";
import Header from "../components/Header";

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Data Load
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      // Ensure we set an array even if the data is empty
      setNotifications(res.data || []);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // 2. Filter Logic (Facebook Style)
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "new") {
      const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
      return new Date(n.createdAt).getTime() > oneDayAgo;
    }
    return true;
  });

  // 3. Mark as Read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      // Optimistic Update: Update UI state immediately
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Notification read");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // 4. Delete Notification [cite: 2025-10-11]
  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col gap-6 max-w-7xl mx-auto px-4 lg:px-8 pb-4">

      <Header
        title="Notification Center"
        description="Manage your notifications and stay updated."
      />
        <div className="">
          {/* Tab Panes */}
          <div className="flex px-4 gap-8 border-b border-b-gray-300">
            {["all", "unread", "new"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-4 text-sm font-semibold capitalize transition-all relative ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {/* Animated Underline */}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                )}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="p-20 text-center animate-pulse text-gray-400">
                Loading your alerts...
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((n) => (
                <div
                  key={n._id}
                  className={`group p-4 flex items-start gap-4 hover:bg-gray-50/80 transition-all relative ${
                    !n.isRead ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  <div
                    className={`mt-2 size-2.5 rounded-full shrink-0 transition-all ${
                      !n.isRead
                        ? "bg-blue-600 scale-100"
                        : "bg-transparent scale-0"
                    }`}
                  ></div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !n.isRead
                          ? "text-gray-900 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium flex items-center gap-1">
                      {new Date(n.createdAt).toLocaleDateString()} •{" "}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Facebook Style Hover Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <IoCheckmarkDoneOutline size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-3">
                <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <IoCheckmarkDoneOutline size={30} />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No {activeTab} notifications to show.
                </p>
              </div>
            )}
          </div>
        </div>
    </main>
  );
};

export default NotificationPage;
