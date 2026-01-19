import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllTrips } from "../services/trip";
import TripCard from "../components/TripCard";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { fetchAllReviews } from "../services/review";
import Footer from "../components/Footer";

const Index = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const nextReview = () => {
  setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
};

const prevReview = () => {
  setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
};

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

    const loadReviews = async () => {
      try {
        const response = await fetchAllReviews(1, 3);

        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    fetchTrips();
    loadReviews();
  }, [page]);

  return (
    <div className="absolute w-full top-0 left-0">
      {/* Hero Section */}
      <section className='w-full min-h-screen flex items-center bg-[url("https://res.cloudinary.com/dxs4vmk1i/image/upload/v1767602256/hero-img_yaygpb.png")] bg-cover bg-center bg-no-repeat'>
        <div className="absolute h-screen inset-0 bg-linear-to-br from-black/60 via-[#cff1ff3f] to-transparent"></div>

        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-100 mb-6 leading-tight">
                Plan Your
                <br />
                Trip with Ease
              </h1>
              <p className="text-base sm:text-lg text-gray-100 mb-8 leading-relaxed">
                Customize your travel itinerary in minutes—pick your
                destination, set your preferences, and explore with confidence.
              </p>
              <Link
                to="/login"
                className="inline-block bg-white/20 hover:scale-105 transition-colors px-8 py-3 font-semibold rounded-lg shadow-lg border-2  text-white"
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
            title={"Featured Travel Destinations"}
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    Australia Tour
                  </h3>
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    Australia Tour
                  </h3>
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    Japan Tour
                  </h3>
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    London, United State
                  </h3>
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    Japan Tour
                  </h3>
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
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-orange-500 font-semibold px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                    3.5
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    Japan Tour
                  </h3>
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
          title={"Handpicked Trips for You"}
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
                  ? "bg-blue-500 text-white"
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
                      ? "bg-blue-500 text-white"
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
                    ? "bg-blue-500 text-white"
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

     <section className="relative mb-20 w-full min-h-[700px] flex items-center justify-center overflow-hidden">
    {/* 1. Background Image with Overlay */}
    <div 
      className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?')] bg-cover bg-center transition-all duration-700"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
      <div className="flex flex-col items-center gap-12">
        
        {/* Header with light text for dark background */}
        <div className="text-center">
           <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">What Our Guests Say</h2>
           <p className="text-gray-200 max-w-xl mx-auto">Real stories from travelers who explored the world with Tripvisito.</p>
        </div>

        {/* 2. Slider Container */}
        <div className="relative w-full max-w-4xl flex items-center justify-center">
          
          {/* Left Arrow */}
          <button 
            onClick={prevReview}
            className="absolute left-0 md:-left-20 z-20 p-4 bg-transparent rounded-full text-white backdrop-blur-md hover:bg-white/10 transition-all active:scale-95"
          >
            <FiChevronLeft size={60} />
          </button>

          {reviews.length > 0 && (
            <div className="w-150 h-100 bg-white/10 backdrop-blur-xl p-10 md:p-16 rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-500">
              <div className="flex flex-col items-center text-center gap-8">
                
                <FaQuoteLeft className="text-white/20 size-16 absolute top-10 left-10" />

                

                <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic max-w-2xl">
                  "{reviews[currentReviewIndex].comment}"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < reviews[currentReviewIndex].rating ? "text-amber-400" : "text-white/20"} 
                      size={20}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <img 
                    src={reviews[currentReviewIndex].userId?.profileimg || "/default-avatar.png"} 
                    alt="user" 
                    className="size-16 rounded-full object-cover ring-4 ring-white/20"
                  />
                  <div>
                    
                    <h4 className="font-bold text-white text-lg">{reviews[currentReviewIndex].userId?.name}</h4>
                  
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Arrow */}
          <button 
            onClick={nextReview}
            className="absolute right-0 md:-right-20 z-20 p-4 bg-transparent rounded-full text-white backdrop-blur-md hover:bg-white/10 transition-all active:scale-95"
          >
            <FiChevronRight size={60} />
          </button>
        </div>

        {/* Slider Indicators (Dots) */}
        <div className="flex gap-2">
          {reviews.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentReviewIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <Footer />

    </div>
  );
};

export default Index;
