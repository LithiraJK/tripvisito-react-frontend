import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { IoAirplane, IoTicketOutline, IoEyeOutline } from "react-icons/io5";
import { motion } from "framer-motion";

interface BoardingPassProps {
  booking: any;
  passengerName: string;
  onRateClick: () => void;
}

const getAirportCode = (country: string = "") => {
  const c = country.toLowerCase();
  if (c.includes("sri lanka")) return "CMB";
  if (c.includes("maldives")) return "MLE";
  if (c.includes("japan") || c.includes("tokyo")) return "NRT";
  if (c.includes("bali") || c.includes("indonesia")) return "DPS";
  if (c.includes("france") || c.includes("paris")) return "CDG";
  if (c.includes("thailand") || c.includes("bangkok")) return "BKK";
  if (c.includes("dubai") || c.includes("uae")) return "DXB";
  if (c.includes("italy") || c.includes("rome")) return "FCO";
  if (c.includes("switzerland")) return "ZRH";
  if (c.includes("singapore")) return "SIN";
  return country.slice(0, 3).toUpperCase() || "INT";
};

const BoardingPassCard: React.FC<BoardingPassProps> = ({
  booking,
  passengerName,
  onRateClick,
}) => {
  const trip = booking?.tripId;
  const details = trip?.tripDetails;
  const tripId = trip?._id || trip?.id;

  const destCode = getAirportCode(details?.country || details?.name);
  const bookingRef = `TV-${(booking?._id || "TRIP77").slice(-6).toUpperCase()}`;

  // Countdown timer calculation (simulating trip 7 days after booking or fixed horizon)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number }>({
    days: 4,
    hours: 18,
    mins: 32,
  });

  useEffect(() => {
    const bookingDate = new Date(booking?.createdAt || Date.now());
    const targetDate = new Date(bookingDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({ days, hours, mins });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [booking?.createdAt]);

  const qrData = JSON.stringify({
    ref: bookingRef,
    passenger: passengerName,
    destination: details?.country || "Worldwide",
    tripId: tripId,
    amount: booking?.amount,
    status: booking?.status,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col justify-between relative"
    >
      {/* Top Banner: Airlines Branding + Status */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IoTicketOutline className="text-cyan-200 text-xl" />
          <span className="text-xs font-black tracking-widest uppercase">
            Tripvisito Express Airways
          </span>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-400/90 text-emerald-950 shadow-xs">
          Confirmed Ticket
        </span>
      </div>

      {/* Main Boarding Pass Body */}
      <div className="p-6 flex flex-col gap-5">
        {/* Countdown Banner */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌴</span>
            <div>
              <p className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                Adventure Countdown
              </p>
              <p className="text-xs font-semibold text-slate-600">
                Departure in <span className="font-bold text-blue-600">{timeLeft.days} Days · {timeLeft.hours} Hours · {timeLeft.mins} Mins</span>
              </p>
            </div>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        </div>

        {/* Airport Flight Path */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">CMB</span>
            <span className="text-[11px] font-semibold text-slate-400">ORIGIN</span>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center w-full justify-center gap-1">
              <div className="h-[2px] flex-1 bg-slate-200"></div>
              <IoAirplane className="text-blue-500 text-lg rotate-90 mx-1 shrink-0" />
              <div className="h-[2px] flex-1 bg-slate-200"></div>
            </div>
            <span className="text-[10px] font-bold text-blue-500 tracking-wider mt-1">
              {details?.duration ? `${details.duration} DAYS ADVENTURE` : "DIRECT"}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">{destCode}</span>
            <span className="text-[11px] font-semibold text-slate-400 text-right uppercase">
              {details?.country || "DEST"}
            </span>
          </div>
        </div>

        {/* Trip Name */}
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1">
            {details?.name || "Exclusive AI Curated Journey"}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {details?.travelStyle || "Custom"} · {details?.budget || "Standard"} · {details?.interests || "Sightseeing"}
          </p>
        </div>

        {/* Passenger & Ticket Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Passenger</p>
            <p className="font-bold text-slate-800 line-clamp-1">{passengerName || "Explorer"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Booking Ref</p>
            <p className="font-mono font-bold text-blue-600">{bookingRef}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Seat / Class</p>
            <p className="font-bold text-slate-800">VIP Premium</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Paid Amount</p>
            <p className="font-bold text-emerald-600">${booking?.amount?.toFixed?.(2) || booking?.amount || "0"}</p>
          </div>
        </div>
      </div>

      {/* Perforated Tear-off Line with Cutouts */}
      <div className="relative flex items-center my-1">
        <div className="w-5 h-6 bg-gray-50 rounded-r-full border-r border-t border-b border-slate-200"></div>
        <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2"></div>
        <div className="w-5 h-6 bg-gray-50 rounded-l-full border-l border-t border-b border-slate-200"></div>
      </div>

      {/* Bottom QR & Actions Stub */}
      <div className="p-6 pt-3 bg-slate-50/60 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
            <QRCodeSVG value={qrData} size={64} level="M" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-800 tracking-wider">GATE PASS VERIFIED</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Present this QR code or PDF at partner counters</span>
            <span className="font-mono text-[9px] text-slate-400 mt-1">E-TKT: {bookingRef}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {tripId && (
            <Link
              to={`/trip/${tripId}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <IoEyeOutline size={15} />
              View Trip
            </Link>
          )}
          <button
            onClick={onRateClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Review Trip
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BoardingPassCard;
