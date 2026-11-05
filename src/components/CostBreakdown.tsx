import React from "react";
import { FaHotel, FaTicketAlt, FaCar, FaCoins } from "react-icons/fa";

interface CostBreakdownProps {
  estimatedPrice: string;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ estimatedPrice }) => {
  const numericPrice = Number(String(estimatedPrice || "0").replace(/[^0-9.]/g, "")) || 500;

  const accommodation = Math.round(numericPrice * 0.4);
  const activities = Math.round(numericPrice * 0.35);
  const transport = Math.round(numericPrice * 0.25);

  const items = [
    {
      title: "Accommodation & Stays",
      share: "40%",
      amount: accommodation,
      icon: <FaHotel className="text-blue-500" />,
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
    },
    {
      title: "Activities & Sightseeing",
      share: "35%",
      amount: activities,
      icon: <FaTicketAlt className="text-emerald-500" />,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50",
    },
    {
      title: "Transport & Dining",
      share: "25%",
      amount: transport,
      icon: <FaCar className="text-amber-500" />,
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <FaCoins size={18} />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Estimated Cost Breakdown</h3>
            <p className="text-xs text-gray-500">Transparent budget distribution guide</p>
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900">${numericPrice}</span>
      </header>

      {/* Progress Distribution Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 mb-5">
        <div style={{ width: "40%" }} className="bg-blue-500 h-full transition-all" title="Accommodation (40%)" />
        <div style={{ width: "35%" }} className="bg-emerald-500 h-full transition-all" title="Activities (35%)" />
        <div style={{ width: "25%" }} className="bg-amber-500 h-full transition-all" title="Transport (25%)" />
      </div>

      {/* Breakdown Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className={`p-3 rounded-xl border border-gray-100 ${item.lightBg} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-white rounded-lg shadow-2xs">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">{item.title}</p>
                <span className="text-[11px] text-gray-400">{item.share}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-800">${item.amount}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CostBreakdown;
