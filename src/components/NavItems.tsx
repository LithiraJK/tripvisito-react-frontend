import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { sidebarItems } from "../constants/index.ts";
import logo from "../assets/icons/logo.svg";
import logoutIcon from "../assets/icons/logout.svg";
import toast, { Toaster } from "react-hot-toast";

// Icons
import { 
  IoNotificationsOutline, 
  IoClose, 
  IoCheckmarkDoneOutline, 
  IoTrashOutline 
} from "react-icons/io5";

// Services
import { getMyDetails } from "../services/auth.ts";
import { 
  fetchNotifications, 
  markAsRead, 
  deleteNotification 
} from "../services/notification.ts";

const NavItems = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Initial Data Load
  useEffect(() => {
    let isMounted = true;

    const loadSidebarData = async () => {
      try {
        const [uRes, nRes] = await Promise.all([
          getMyDetails(),
          fetchNotifications()
        ]);

        if (isMounted) {
          // Mapping data based on your service response structure
          setUser(uRes.data || uRes);
          setNotifications(nRes.data || nRes);
        }
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      }
    };

    loadSidebarData();
    return () => { isMounted = false; };
  }, []);

  // 2. Notification Handlers
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <section className="flex flex-col h-full relative">
      <Toaster position="bottom-left" />
      
      {/* --- TOP SECTION: LOGO & NOTIFICATIONS --- */}
      <div className="flex items-center justify-between pr-4 relative">
        <Link
          to="/"
          className="nav-link flex flex-row items-center space-x-2 p-4"
        >
          <img src={logo} alt="logo" className="size-9" />
          <h1 className="text-2xl font-bold">Tripvisito</h1>
        </Link>

        {/* Modern Bell Icon */}
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`relative p-2.5 rounded-xl transition-all duration-300 ${
            isNotifOpen ? "bg-blue-50 text-blue-500" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <IoNotificationsOutline size={22} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </button>

        {/* --- MODERN FLOATING NOTIFICATION PANEL --- */}
        {isNotifOpen && (
          <div className="absolute left-[260px] top-0 w-80 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl z-[100] flex flex-col animate-in fade-in zoom-in duration-200 origin-top-left">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-800">Notifications</h2>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <IoClose size={18}/>
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n._id} 
                    className={`p-4 flex gap-3 transition-colors relative group border-b border-gray-50 last:border-0 ${
                      !n.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] leading-snug ${!n.isRead ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {!n.isRead && (
                         <button onClick={() => handleMarkAsRead(n._id)} className="p-1.5 text-blue-500 hover:bg-white rounded-md shadow-sm border border-blue-50">
                           <IoCheckmarkDoneOutline size={14}/>
                         </button>
                       )}
                       <button onClick={() => handleDeleteNotif(n._id)} className="p-1.5 text-red-500 hover:bg-white rounded-md shadow-sm border border-red-50">
                         <IoTrashOutline size={14}/>
                       </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs italic">
                  No new notifications
                </div>
              )}
            </div>
            <Link 
              to="/admin/notifications" 
              onClick={() => setIsNotifOpen(false)}
              className="p-3 text-center text-[11px] font-bold text-blue-500 hover:bg-gray-50 border-t border-gray-50 rounded-b-2xl"
            >
              See All Activity
            </Link>
          </div>
        )}
      </div>

      {/* --- NAVIGATION ITEMS --- */}
      <div className="flex flex-col gap-9 mt-6 flex-1 px-4">
        <nav>
          {sidebarItems.map(({ id, href, icon: Icon, label }) => (
            <NavLink
              to={href}
              key={id}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3.5 font-medium rounded-xl mb-2 transition-all ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="size-5" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* --- USER FOOTER --- */}
        {user && (
          <footer className="flex items-center gap-3 pb-8 mt-auto border-t border-gray-100 pt-6">
            <img
              src={user.profileimg || "/default-avatar.png"}
              alt={user.name}
              className="size-10 rounded-full shrink-0 border-2 border-white shadow-sm"
            />
            <article className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </article>
            <button
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              onClick={handleLogout}
            >
              <img src={logoutIcon} alt="Logout" className="size-6 opacity-70 group-hover:opacity-100" />
            </button>
          </footer>
        )}
      </div>
    </section>
  );
};

export default NavItems;