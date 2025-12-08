import { useEffect, useState } from "react";
import Header from "../../components/Header"
import TripCard from "../../components/TripCard";
import { getAllTrips } from "../../services/trip";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


const TripsPage = () => {

  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await getAllTrips(page, 8);
        setTrips(response.data.trips || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips");
        setLoading(false);
      }
    };

    fetchTrips();
  } , [page]);

  return (
    <main className="w-full min-h-screen  flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header title="Trips" description="Manage all trips here" ctaText="Create a Trip" ctaURL="/trip/create" />
      <section>
        <h1 className="text-xl font-semibold mb-6">Manage Created Trips</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Loading trips...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">No trips found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.tripDetails?.name || ""}
                location={trip.tripDetails?.location?.city || ""}
                imageUrl={trip.imageUrls?.[0] || ""}
                tags={[
                  trip.tripDetails?.budget,
                  trip.tripDetails?.travelStyle,
                  trip.tripDetails?.interests,
                ].filter(Boolean)}
                price={trip.tripDetails?.estimatedPrice || ""}
              />
            ))}
          </div>
        )}

      </section>

      <div className="bg-gray-200 h-px w-full" />

        <div className="flex justify-between items-center border-t border-gray-100">
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:scale-105 px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FiChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {/* First page */}
                <button 
                  onClick={() => setPage(1)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                    page === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>

                {/* Show ellipsis if current page is far from start */}
                {page > 3 && <span className="text-gray-400 px-1">...</span>}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p > 1 && p < totalPages && Math.abs(p - page) <= 1)
                  .map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                        page === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                {/* Show ellipsis if current page is far from end */}
                {page < totalPages - 2 && <span className="text-gray-400 px-1">...</span>}

                {/* Last page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                      page === totalPages ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
      
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:scale-105 px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>

            <div className="bg-gray-200 h-px w-full" />
    </main>
  )
}

export default TripsPage