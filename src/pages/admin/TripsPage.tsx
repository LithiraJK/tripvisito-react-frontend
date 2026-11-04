import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import TripCard from "../../components/TripCard";
import { getTripsByUser, deleteTrip } from "../../services/trip";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import {
  IoSearchOutline,
  IoCloseCircle,
  IoFilterOutline,
  IoTrashOutline,
  IoClose,
  IoEarthOutline,
  IoAirplaneOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [styleFilter, setStyleFilter] = useState("ALL");
  const [budgetFilter, setBudgetFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await getTripsByUser(page, 12);
        setTrips(response.data.trips || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || (response.data.trips || []).length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips");
        setLoading(false);
      }
    };

    fetchTrips();
  }, [page]);

  // Handle Delete Trip
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteTrip(deleteTarget.id);
      setTrips((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setTotalCount((prev) => Math.max(prev - 1, 0));
      toast.success(`Trip "${deleteTarget.name}" removed from catalog!`);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Delete Trip Error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete trip.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & Sorted Trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const details = trip.tripDetails || {};
        const name = (details.name || "").toLowerCase();
        const country = (details.country || "").toLowerCase();
        const city = (details.location?.city || "").toLowerCase();
        const travelStyle = (details.travelStyle || "").toLowerCase();
        const budget = (details.budget || "").toLowerCase();
        const interests = Array.isArray(details.interests)
          ? details.interests.join(" ").toLowerCase()
          : (details.interests || "").toLowerCase();

        // Search Match
        const search = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !search ||
          name.includes(search) ||
          country.includes(search) ||
          city.includes(search) ||
          interests.includes(search);

        // Travel Style Match
        const matchesStyle =
          styleFilter === "ALL" || travelStyle.includes(styleFilter.toLowerCase());

        // Budget Match
        const matchesBudget =
          budgetFilter === "ALL" || budget.includes(budgetFilter.toLowerCase());

        return matchesSearch && matchesStyle && matchesBudget;
      })
      .sort((a, b) => {
        const detailsA = a.tripDetails || {};
        const detailsB = b.tripDetails || {};
        const priceA = Number(String(detailsA.estimatedPrice || "0").replace(/[^0-9.]/g, "")) || 0;
        const priceB = Number(String(detailsB.estimatedPrice || "0").replace(/[^0-9.]/g, "")) || 0;

        if (sortBy === "PRICE_ASC") return priceA - priceB;
        if (sortBy === "PRICE_DESC") return priceB - priceA;
        if (sortBy === "NAME_ASC") return (detailsA.name || "").localeCompare(detailsB.name || "");
        return 0; // Default: API sorting (Newest first)
      });
  }, [trips, searchTerm, styleFilter, budgetFilter, sortBy]);

  // Derived KPI Stats
  const destinationsCount = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => {
      const c = t.tripDetails?.country || t.tripDetails?.location?.city;
      if (c) set.add(c);
    });
    return set.size;
  }, [trips]);

  const avgPrice = useMemo(() => {
    if (trips.length === 0) return 0;
    const total = trips.reduce((acc, t) => {
      const p = Number(String(t.tripDetails?.estimatedPrice || "0").replace(/[^0-9.]/g, "")) || 0;
      return acc + p;
    }, 0);
    return Math.round(total / trips.length);
  }, [trips]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || styleFilter !== "ALL" || budgetFilter !== "ALL" || sortBy !== "NEWEST";

  const resetFilters = () => {
    setSearchTerm("");
    setStyleFilter("ALL");
    setBudgetFilter("ALL");
    setSortBy("NEWEST");
  };

  return (
    <main className="w-full min-h-screen flex flex-col gap-8 max-w-7xl mx-auto px-4 lg:px-8 pb-16">
      <Header
        title="Agency Trips"
        description="Search, manage and curate travel itineraries for your clients"
        ctaText="Create a Trip"
        ctaURL="/admin/trip/create"
        icon={<FaPlus />}
      />

      {/* --- AGENCY METRICS SUMMARY BAR --- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <IoAirplaneOutline size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Packages</p>
            <h3 className="text-2xl font-black text-slate-800">{totalCount || trips.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IoEarthOutline size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destinations Covered</p>
            <h3 className="text-2xl font-black text-slate-800">{destinationsCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <IoPricetagOutline size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Package Value</p>
            <h3 className="text-2xl font-black text-slate-800">${avgPrice.toLocaleString()}</h3>
          </div>
        </div>
      </section>

      {/* --- SEARCH & FILTER CONTROLS TOOLBAR --- */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, country, city or interest..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <IoCloseCircle size={18} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Style Filter */}
            <div className="relative">
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Styles</option>
                <option value="ADVENTURE">Adventure</option>
                <option value="LUXURY">Luxury</option>
                <option value="RELAXED">Relaxed</option>
                <option value="CULTURAL">Cultural</option>
                <option value="CITY_EXPLORATION">City Tour</option>
                <option value="FOOD">Culinary</option>
              </select>
            </div>

            {/* Budget Filter */}
            <div className="relative">
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Budgets</option>
                <option value="BUDGET">Budget / Economy</option>
                <option value="MEDIUM">Standard / Medium</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="NEWEST">Newest First</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="NAME_ASC">Title: A to Z</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>
            Showing <strong className="text-slate-800">{filteredTrips.length}</strong> of{" "}
            <strong className="text-slate-800">{trips.length}</strong> packages on this page
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <IoFilterOutline />
              Filters applied
            </span>
          )}
        </div>
      </section>

      {/* --- TRIPS GRID --- */}
      <section>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <div className="size-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading catalog trips...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20 bg-rose-50 rounded-2xl border border-rose-100">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
            <div className="size-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
              <IoSearchOutline size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-700">No matching packages found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Try adjusting your search keywords, budget, or style filter to see other packages.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
            {filteredTrips.map((trip) => {
              const details = trip.tripDetails || {};
              const displayLocation =
                details.location?.city || details.country || "Global Destination";

              return (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={details.name || "Untitled Trip Package"}
                  location={displayLocation}
                  imageUrl={trip.imageUrls?.[0] || ""}
                  tags={[
                    details.budget,
                    details.travelStyle,
                    details.interests,
                  ].filter(Boolean)}
                  price={details.estimatedPrice || "$0"}
                  onDelete={(id, name) => setDeleteTarget({ id, name })}
                  showAdminActions={true}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-200 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`size-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  page === p
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setDeleteTarget(null)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-5"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <IoTrashOutline size={22} />
                </div>
                <button
                  onClick={() => !isDeleting && setDeleteTarget(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <IoClose size={20} />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Trip Package?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-800">"{deleteTarget.name}"</strong>? This will permanently delete this itinerary from the agency catalog.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Package"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default TripsPage;
