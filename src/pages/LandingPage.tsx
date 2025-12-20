import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllTrips } from "../services/trip";
import TripCard from "../components/TripCard";


const Index = () => {

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
  }, [page]);


  return (
    <>
      {/* Hero Section */}
      <section className='relative w-full min-h-screen flex items-center bg-[url("src/assets/images/hero-img.png")] bg-cover bg-center bg-no-repeat'>
        <div className="absolute inset-0 bg-gradient-to-br from-white/100 via-white/20 to-transparent"></div>
        
        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Plan Your<br />Trip with Ease
              </h1>
              <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                Customize your travel itinerary in minutes—pick your destination, set your preferences, and explore with confidence.
              </p>
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-3 text-white font-semibold rounded-lg shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Travel Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div>
         <Header
              title={'Featured Travel Destinations'}
              description="Check out some of the best places you can visit around the world."
            />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
             {/* Australia Tour - Medium card */}
            <div className="relative sm:col-span-2 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?" 
                alt="Australia Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Australia Tour</h3>
                  <p className="text-xs sm:text-sm flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

            {/* Australia Tour - Small card */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?" 
                alt="Australia Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">Australia Tour</h3>
                  <p className="text-xs flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

            {/* Japan Tour - Small card */}
            <div className="relative sm:row-span-2 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?" 
                alt="Japan Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">Japan Tour</h3>
                  <p className="text-xs flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

            {/* London, United State - Medium card */}
            <div className="relative sm:row-span-2 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?" 
                alt="London, United State" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">London, United State</h3>
                  <p className="text-xs flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

           

            {/* Japan Tour - Small card */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?" 
                alt="Japan Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">Japan Tour</h3>
                  <p className="text-xs flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

               {/* Japan Tour - Small card */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?" 
                alt="Japan Tour" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">3.5</span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">Japan Tour</h3>
                  <p className="text-xs flex items-center gap-1">
                    <span>🏔️</span> 196 Activities
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Handpicked Trips Section */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Header
              title={'Handpicked Trips for You'}
              description="Browse well-planned trips designed for different travel styles and interests"
            />
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


      <div className="flex justify-between items-center border-t border-gray-100 my-5 py-5">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
              page === 1
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            1
          </button>

          {/* Show ellipsis if current page is far from start */}
          {page > 3 && <span className="text-gray-400 px-1">...</span>}

          {/* Pages around current page */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p > 1 && p < totalPages && Math.abs(p - page) <= 1)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                  page === p
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

          {/* Show ellipsis if current page is far from end */}
          {page < totalPages - 2 && (
            <span className="text-gray-400 px-1">...</span>
          )}

          {/* Last page */}
          {totalPages > 1 && (
            <button
              onClick={() => setPage(totalPages)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                page === totalPages
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {totalPages}
            </button>
          )}
        </div>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:scale-105 px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Next
          <FiChevronRight size={16} />
        </button>
      </div>
      </section>

     

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-xl font-bold text-blue-600">🌍 Tourvisto</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Terms & Condition</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
