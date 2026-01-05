import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllTrips } from "../services/trip";
import TripCard from "../components/TripCard";
import logo from "../assets/icons/logo.svg";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { fetchAllReviews } from "../services/review";

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
        <div className="absolute h-screen inset-0 bg-linear-to-br from-[#dfffff] via-[#cff1ff3f] to-transparent"></div>

        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Plan Your
                <br />
                Trip with Ease
              </h1>
              <p className="text-base sm:text-lg text-gray-800 mb-8 leading-relaxed">
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

      <footer className="bg-linear-to-t from-blue-200 to-sky-50 text-[#112D4E] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="flex flex-row items-center gap-2 z-50">
                <img src={logo} alt="logo" className="size-8 sm:size-9" />
                <h1 className="text-xl sm:text-2xl font-bold">Tripvisito</h1>
              </Link>
              <p className="text-sm text-[#112D4E]">
                Discover the world's most amazing destinations and create
                unforgettable memories with our curated travel experiences.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-[#112D4E] hover:text-blue-500 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#112D4E] hover:text-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#112D4E] hover:text-blue-500 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[#112D4E] hover:text-blue-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#112D4E] font-semibold text-lg mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Tours & Packages
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Travel Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[#112D4E] font-semibold text-lg mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-[#112D4E] hover:text-blue-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[#112D4E] font-semibold text-lg mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <svg
                    className="w-5 h-5 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Galle, Baddegama, Sri Lanaka</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@tourvisto.lk</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+94 769270053</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#1a3f6b]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#112D4E]">
                © {new Date().getFullYear()} Tourvisto. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-[#112D4E]">
                <span>Crafted with ❤️ for travelers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
