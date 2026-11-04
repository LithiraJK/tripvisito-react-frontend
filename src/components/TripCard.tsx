import { Link, useLocation } from "react-router-dom";
import Chip from "./Chip";
import {
  IoLocationOutline,
  IoHeart,
  IoHeartOutline,
  IoPencilOutline,
  IoEyeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import { cardHoverVariants, fadeInUpVariants, scrollRevealViewport } from "../lib/animations";
import { useWishlist } from "../contexts/wishlistContext";

export interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  tags: string[];
  price: string | number;
  onDelete?: (id: string, name: string) => void;
  showAdminActions?: boolean;
}

const formatPrice = (rawPrice: string | number) => {
  if (!rawPrice) return "$0";
  const num = Number(String(rawPrice).replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num === 0) {
    return String(rawPrice).startsWith("$") ? String(rawPrice) : `$${rawPrice}`;
  }
  return `$${num.toLocaleString()}`;
};

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
  onDelete,
  showAdminActions,
}: TripCardProps) => {
  const path = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const isAdmin = path.pathname.startsWith("/admin") || Boolean(showAdminActions);
  const isSaved = isWishlisted(id);

  const formattedPrice = formatPrice(price);
  const displayLocation = location?.trim() ? location : "Global Destination";

  const tripLink = isAdmin
    ? `/admin/trip/${id}`
    : `/trip/${id}`;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, name, location: displayLocation, imageUrl, tags, price: formattedPrice });
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={scrollRevealViewport}
      variants={fadeInUpVariants}
    >
      <motion.div
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
      >
        <Link
          to={tripLink}
          className="bg-white rounded-2xl flex-col w-full relative shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out block group"
        >
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-44 object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Wishlist Heart Button (Traveler View) */}
            {!isAdmin && (
              <motion.button
                onClick={handleHeartClick}
                aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-2.5 left-3 size-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-colors cursor-pointer ${
                  isSaved
                    ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500"
                }`}
                whileTap={{ scale: 0.8 }}
              >
                {isSaved ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
              </motion.button>
            )}

            {/* Admin Status Badge (Admin View) */}
            {isAdmin && (
              <span className="absolute top-2.5 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-white/95 text-emerald-700 shadow-md backdrop-blur-xs flex items-center gap-1 border border-emerald-100">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Package
              </span>
            )}

            {/* Price Badge */}
            <article className="bg-white/95 backdrop-blur-xs py-1 px-3 rounded-2xl absolute top-2.5 right-3 text-dark-100 text-xs md:text-sm font-bold shadow-xs">
              {formattedPrice}
            </article>
          </div>

          <article className="flex flex-col gap-2 mt-4 pl-[18px] pr-3.5">
            <h2 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {name}
            </h2>
            <figure className="flex items-center gap-1.5 text-gray-500">
              <IoLocationOutline className="text-blue-500 shrink-0" size={16} />
              <figcaption className="text-xs md:text-sm font-medium line-clamp-1">
                {displayLocation}
              </figcaption>
            </figure>
          </article>

          <div className="mt-4 pl-[18px] pr-3.5 pb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant={
                  index === 0
                    ? "success"
                    : index === 1
                    ? "pink"
                    : index === 2
                    ? "warning"
                    : "default"
                }
              />
            ))}
          </div>

          {/* Admin Quick Action Toolbar */}
          {isAdmin && (
            <div className="pt-2.5 pb-3 border-t border-slate-100 flex items-center justify-between text-xs px-[18px]">
              <span className="text-[11px] font-semibold text-slate-400">Quick Actions:</span>
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Link
                  to={`/admin/trip/edit/${id}`}
                  aria-label="Edit package"
                  title="Edit package"
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <IoPencilOutline size={16} />
                </Link>
                <Link
                  to={`/trip/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Preview public page"
                  title="Preview public page"
                  className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <IoEyeOutline size={16} />
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(id, name)}
                    aria-label="Delete package"
                    title="Delete package"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TripCard;
