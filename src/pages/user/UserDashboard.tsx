import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  IoChatbubblesSharp,
  IoClose,
  IoNotificationsOutline,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
  IoStar,
  IoStarOutline,
  IoHeart,
  IoTicketOutline,
  IoTimeOutline,
} from "react-icons/io5";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import BoardingPassCard from "../../components/BoardingPassCard";
import ChatBox from "../../components/ChatBox";
import toast from "react-hot-toast";
import { getMyDetails } from "../../services/auth";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "../../services/notification";
import { getMyBookedTrips } from "../../services/payment";
import { submitTripReview } from "../../services/review";
import { useWishlist } from "../../contexts/wishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  pageVariants,
  modalVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../../lib/animations";

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const initialTab = searchParams.get("tab")?.toUpperCase() === "SAVED" ? "SAVED" : "CONFIRMED";
  const [activeTab, setActiveTab] = useState<"CONFIRMED" | "PENDING" | "SAVED">(initialTab as any);

  const { wishlist } = useWishlist();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toUpperCase();
    if (tabParam === "SAVED") {
      setActiveTab("SAVED");
    }
  }, [searchParams]);

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
        toast.error("Please select a star rating before submitting.");
        return;
      }

      if (!reviewText.trim()) {
        toast.error("Please provide a comment for your review.");
        return;
      }

      await submitTripReview({
        tripId,
        rating,
        comment: reviewText.trim(),
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

  const confirmedTrips = bookings.filter((b) => b.status === "CONFIRMED");
  const pendingTrips = bookings.filter((b) => b.status === "PENDING");

  return (
    <motion.main 
      className="relative flex flex-col gap-8 w-full pb-24 max-w-7xl mx-auto px-4 lg:px-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >

      {/* --- HEADER --- */}
      <div className="flex justify-between items-start">
        <Header
          title={`Welcome back, ${user?.name ?? "Explorer"} 👋`}
          description="Manage your boarding passes, pending trips, and saved bucket list."
        />
        <button
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          aria-label="Toggle Notifications"
          className="relative p-3 mt-4 bg-white shadow-md rounded-2xl hover:bg-gray-50 transition-all border border-gray-100 cursor-pointer"
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

      {/* --- BOOKING TABS --- */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("CONFIRMED"); setSearchParams({}); }}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === "CONFIRMED"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <IoTicketOutline size={18} />
            Boarding Passes ({confirmedTrips.length})
          </button>

          <button
            onClick={() => { setActiveTab("PENDING"); setSearchParams({}); }}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === "PENDING"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <IoTimeOutline size={18} />
            Pending Payments ({pendingTrips.length})
          </button>

          <button
            onClick={() => { setActiveTab("SAVED"); setSearchParams({ tab: "saved" }); }}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === "SAVED"
                ? "border-rose-500 text-rose-500"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <IoHeart size={18} className={activeTab === "SAVED" ? "text-rose-500" : "text-gray-400"} />
            Saved Bucket List ({wishlist.length})
          </button>
        </div>

        {/* --- TAB CONTENT: CONFIRMED BOARDING PASSES --- */}
        {activeTab === "CONFIRMED" && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-7"
            key="confirmed"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {confirmedTrips.length > 0 ? (
              confirmedTrips.map((book) => (
                <motion.div key={book._id} variants={staggerItemVariants}>
                  <BoardingPassCard
                    booking={book}
                    passengerName={user?.name || "Explorer"}
                    onRateClick={() => {
                      setSelectedBooking(book);
                      setShowReviewModal(true);
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50/70 rounded-3xl border-2 border-dashed border-gray-200">
                <IoTicketOutline size={48} className="mx-auto text-gray-300 mb-3" />
                <h4 className="text-base font-bold text-gray-700">No confirmed bookings yet</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Ready for your next journey? Explore our AI-curated trips and book to receive your digital boarding pass!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* --- TAB CONTENT: PENDING PAYMENTS --- */}
        {activeTab === "PENDING" && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7"
            key="pending"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {pendingTrips.length > 0 ? (
              pendingTrips.map((book) => {
                const trip = book.tripId;
                const details = trip?.tripDetails;
                const displayPrice =
                  typeof book.amount === "number"
                    ? `$${book.amount.toFixed(2)}`
                    : `$${book.amount || "0"}`;

                return (
                  <motion.div 
                    key={book._id} 
                    className="flex flex-col gap-3 group"
                    variants={staggerItemVariants}
                  >
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
                      price={displayPrice}
                    />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50/70 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 italic">No pending payments found.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* --- TAB CONTENT: SAVED BUCKET LIST --- */}
        {activeTab === "SAVED" && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7"
            key="saved"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {wishlist.length > 0 ? (
              wishlist.map((item) => (
                <motion.div key={item.id} variants={staggerItemVariants}>
                  <TripCard
                    id={item.id}
                    name={item.name}
                    location={item.location}
                    imageUrl={item.imageUrl}
                    tags={item.tags || []}
                    price={item.price}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50/70 rounded-3xl border-2 border-dashed border-gray-200">
                <IoHeart size={44} className="mx-auto text-rose-300 mb-3" />
                <h4 className="text-base font-bold text-gray-700">Your Bucket List is empty</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Click the ❤️ heart icon on any trip card across the app to bookmark it here for later.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div 
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div 
              className="bg-white w-full max-w-md rounded-4xl shadow-2xl p-8 flex flex-col gap-6"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Trip Review</h3>
              <button onClick={() => setShowReviewModal(false)} aria-label="Close" className="hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest text-center">
                How was your experience in {selectedBooking?.tripId?.tripDetails?.country}?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} aria-label={`${star} star`} className="hover:scale-110 transition-transform cursor-pointer">
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
              disabled={rating === 0 || !reviewText.trim()}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95 cursor-pointer"
            >
              Submit Review
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION DRAWER --- */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-55" 
              onClick={() => setIsNotifOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-60 border-l border-gray-100 flex flex-col rounded-bl-3xl rounded-tl-3xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
            <div className="p-6 border-b rounded-tl-3xl flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Your Activity</h2>
              <button onClick={() => setIsNotifOpen(false)} aria-label="Close" className="hover:bg-gray-200 p-1 rounded-full cursor-pointer">
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
                        <button onClick={() => handleMarkAsRead(n._id)} aria-label="Mark as read" className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer">
                          <IoCheckmarkDoneOutline size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteNotif(n._id)} aria-label="Delete notification" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg cursor-pointer">
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400">No notifications yet.</div>
              )}
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CHAT WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && user && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBox roomId={user.id || user._id} isAdminView={false} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Toggle chat"
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isChatOpen ? <IoClose size={28} /> : <IoChatbubblesSharp size={28} />}
        </motion.button>
      </div>
    </motion.main>
  );
};

export default UserDashboard;
