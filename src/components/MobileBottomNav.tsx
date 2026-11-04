import { Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoHome,
  IoCompassOutline,
  IoCompass,
  IoHeartOutline,
  IoHeart,
  IoTicketOutline,
  IoTicket,
  IoPersonOutline,
  IoPerson,
} from "react-icons/io5";
import { useAuth } from "../contexts/authContext";
import { useWishlist } from "../contexts/wishlistContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  const currentPath = location.pathname;
  const currentSearch = location.search;

  const isHome = currentPath === "/";
  const isCreateTrip = currentPath === "/create-trip";
  const isSaved = currentPath === "/customer/dashboard" && currentSearch.includes("tab=saved");
  const isBookings = currentPath === "/customer/dashboard" && !currentSearch.includes("tab=saved");
  const isAuth = currentPath === "/login" || currentPath === "/register";

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/90 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-2px_15px_rgba(0,0,0,0.06)] px-3 py-1.5 safe-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            isHome ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {isHome ? <IoHome size={22} /> : <IoHomeOutline size={22} />}
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* AI Trip Planner */}
        <Link
          to="/create-trip"
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            isCreateTrip ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {isCreateTrip ? <IoCompass size={22} /> : <IoCompassOutline size={22} />}
          <span className="text-[10px] mt-0.5">Plan AI</span>
        </Link>

        {/* Saved Bucket List */}
        <Link
          to="/customer/dashboard?tab=saved"
          className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            isSaved ? "text-rose-500 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {isSaved ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
          <span className="text-[10px] mt-0.5">Saved</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1 size-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {wishlist.length > 9 ? "9+" : wishlist.length}
            </span>
          )}
        </Link>

        {/* Bookings / Boarding Passes */}
        <Link
          to={user ? "/customer/dashboard" : "/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            isBookings ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {isBookings ? <IoTicket size={22} /> : <IoTicketOutline size={22} />}
          <span className="text-[10px] mt-0.5">Trips</span>
        </Link>

        {/* Profile / Account */}
        <Link
          to={user ? (user.role === "ADMIN" || user.role === "SUPERADMIN" ? "/admin/dashboard" : "/customer/dashboard") : "/login"}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
            isAuth ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {user?.profileimg ? (
            <img
              src={user.profileimg}
              alt={user.name}
              className="size-5.5 rounded-full object-cover ring-1 ring-blue-500"
            />
          ) : isAuth ? (
            <IoPerson size={22} />
          ) : (
            <IoPersonOutline size={22} />
          )}
          <span className="text-[10px] mt-0.5">{user ? "Account" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
