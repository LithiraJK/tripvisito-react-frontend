import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";

export interface Activity {
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

interface ItineraryTimelineProps {
  itinerary: DayPlan[];
}

const getTimeBadgeColor = (timeStr: string) => {
  const t = timeStr.toLowerCase();
  if (t.includes("morning")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (t.includes("afternoon")) return "bg-sky-50 text-sky-700 border-sky-200";
  if (t.includes("evening") || t.includes("night")) return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");

  if (!itinerary || itinerary.length === 0) return null;

  const filteredDays = selectedDay === "all"
    ? itinerary
    : itinerary.filter((d) => d.day === selectedDay);

  return (
    <section className="flex flex-col gap-6">
      {/* Day Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDay("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedDay === "all"
              ? "bg-blue-500 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Days ({itinerary.length})
        </button>
        {itinerary.map((dayPlan) => (
          <button
            key={dayPlan.day}
            onClick={() => setSelectedDay(dayPlan.day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === dayPlan.day
                ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Day {dayPlan.day}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredDays.map((dayPlan) => (
            <motion.div
              key={dayPlan.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    D{dayPlan.day}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Day {dayPlan.day}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <IoLocationOutline size={13} className="text-blue-500" />
                      <span>{dayPlan.location}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {dayPlan.activities?.length || 0} activities
                </span>
              </div>

              {/* Day Activities */}
              <div className="space-y-3">
                {dayPlan.activities?.map((act, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100/80 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4"
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 w-fit ${getTimeBadgeColor(
                        act.time
                      )}`}
                    >
                      <IoTimeOutline size={12} />
                      {act.time}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ItineraryTimeline;
