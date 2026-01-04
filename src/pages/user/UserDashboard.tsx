import { useEffect, useState } from "react";
import {
  IoChatbubblesSharp,
  IoClose,
  IoNotificationsOutline,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import ChatBox from "../../components/ChatBox";
import toast, { Toaster } from "react-hot-toast";
import { getMyDetails } from "../../services/auth";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "../../services/notification";
import { getMyBookedTrips } from "../../services/payment";
import { submitTripReview } from "../../services/review";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"CONFIRMED" | "PENDING">("CONFIRMED");

  // Review System State [cite: 2025-09-30]
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, bRes, nRes] = await Promise.all([
          getMyDetails(),
          getMyBookedTrips(),
          fetchNotifications(),
        ]);

        setUser(uRes.data || uRes);
        setBookings(bRes.data || bRes);
        setNotifications(nRes.data || nRes);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        toast.error("Failed to sync dashboard data.");
      }
    };
    fetchData();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleReviewSubmit = async () => {
    try {
        const tripId = selectedBooking?.tripId?._id || selectedBooking?.tripId?.id;

        if (!tripId || rating === 0) {
            toast.error("Please provide a rating before submitting.");
            return;
        }

        await submitTripReview({
            tripId,
            rating,
            comment: reviewText
        });

        toast.success(`Thank you! Your review for ${selectedBooking?.tripId?.tripDetails?.name} is live.`);
        
        setShowReviewModal(false);
        setRating(0);
        setReviewText("");
        
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to submit review";
        toast.error(errorMessage);
        console.error("Review Error:", err);
    }
};

  const filteredTrips = bookings.filter((b) => b.status === activeTab);

  return (
    <main className="relative flex flex-col gap-8 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8">
      <Toaster position="bottom-center" />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        <Header
          title={`Welcome, ${user?.name ?? "Guest"} 👋`}
          description="Manage your bookings and stay updated."
        />
        <button
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative p-3 mt-4 bg-white shadow-md rounded-xl hover:bg-gray-50 transition-all border border-gray-100"
        >
          <IoNotificationsOutline size={24} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>

      {/* --- BOOKING TABS --- [cite: 2025-10-11] */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800">My Trip History</h2>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("CONFIRMED")}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === "CONFIRMED"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Confirmed Trips ({bookings.filter((b) => b.status === "CONFIRMED").length})
          </button>
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === "PENDING"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Pending Payments ({bookings.filter((b) => b.status === "PENDING").length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((book) => {
              const trip = book.tripId;
              const details = trip?.tripDetails;

              return (
                <div key={book._id} className="flex flex-col gap-3 group">
                  <TripCard
                    id={trip?._id || trip?.id}
                    name={details?.name || "Booking Information"}
                    location={details?.country || "Location not set"}
                    imageUrl={trip?.imageUrls?.[0] || ""}
                    tags={[
                      details?.budget,
                      details?.travelStyle,
                      details?.interests,
                    ].filter(Boolean)}
                    price={book.amount}
                  />
                  
                  {/* Review Button only for Confirmed Trips */}
                  {activeTab === "CONFIRMED" && (
                    <button
                      onClick={() => { setSelectedBooking(book); setShowReviewModal(true); }}
                      className="w-full py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      Rate this Trip
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 italic bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
              No {activeTab.toLowerCase()} trips found.
            </div>
          )}
        </div>
      </section>

      {/* --- REVIEW MODAL --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 flex flex-col gap-6 animate-in zoom-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Trip Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center">
                How was your experience in {selectedBooking?.tripId?.tripDetails?.country}?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="hover:scale-110 transition-transform">
                    {star <= rating ? (
                      <IoStar size={36} className="text-amber-400" />
                    ) : (
                      <IoStarOutline size={36} className="text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="Tell us about your adventure..."
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button 
              onClick={handleReviewSubmit}
              disabled={rating === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION DRAWER --- */}
      {isNotifOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-55" onClick={() => setIsNotifOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-60 border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300 rounded-bl-3xl rounded-tl-3xl">
            <div className="p-6 border-b rounded-tl-3xl flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Your Activity</h2>
              <button onClick={() => setIsNotifOpen(false)} className="hover:bg-gray-200 p-1 rounded-full">
                <IoClose size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className={`p-4 group flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/30" : ""}`}>
                    <div className={`mt-1.5 size-2 rounded-full shrink-0 ${!n.isRead ? "bg-blue-500" : "bg-gray-200"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.isRead ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.isRead && (
                        <button onClick={() => handleMarkAsRead(n._id)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg">
                          <IoCheckmarkDoneOutline size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteNotif(n._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400">No notifications yet.</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* --- CHAT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && user && (
          <div className="mb-4 transition-all animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300 origin-bottom-right">
            <ChatBox roomId={user.id || user._id} isAdminView={false} />
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isChatOpen ? <IoClose size={28} /> : <IoChatbubblesSharp size={28} />}
        </button>
      </div>
    </main>
  );
};

export default UserDashboard;