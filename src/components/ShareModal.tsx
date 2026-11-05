import React, { useState } from "react";
import { IoClose, IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  tripTitle,
  tripUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tripUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Check out this amazing trip to "${tripTitle}" on Tripvisito! 🌴✈️\n${tripUrl}`
  );

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Share This Trip</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 mb-4">
          Invite your friends or travel companions to view this itinerary.
        </p>

        {/* Quick Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <FaWhatsapp size={24} />
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
          >
            <FaTwitter size={22} />
            <span className="text-xs font-semibold">Twitter</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tripUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <FaFacebook size={22} />
            <span className="text-xs font-semibold">Facebook</span>
          </a>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
          <input
            type="text"
            readOnly
            value={tripUrl}
            className="flex-1 bg-transparent px-3 text-xs text-gray-600 outline-none select-all"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {copied ? <IoCheckmark size={16} /> : <IoCopyOutline size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
