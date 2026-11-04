import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { getTripDetails, getAllTrips } from "../../services/trip";
import InfoPill from "../../components/InfoPill";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline, IoShareSocialOutline, IoDownloadOutline } from "react-icons/io5";
import { cn } from "../../lib/utils";
import Chip from "../../components/Chip";
import { FaStar } from "react-icons/fa";
import TripCard from "../../components/TripCard";
import Button from "../../components/Button";
import WorldMap from "../../components/WorldMap";
import { AiFillEdit } from "react-icons/ai";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/authContext";
import CostBreakdown from "../../components/CostBreakdown";
import ItineraryTimeline from "../../components/ItineraryTimeline";
import ShareModal from "../../components/ShareModal";
import { exportTripToPDF } from "../../lib/pdfExport";

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [popularTrips, setPopularTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const path = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = path.pathname.startsWith("/admin");

  const {
    name,
    description,
    estimatedPrice,
    duration,
    budget,
    travelStyle,
    country,
    interests,
    groupType,
    bestTimeToVisit,
    weatherInfo,
    itinerary,
  } = tripDetails || {};

  const chipsData = [budget, travelStyle, interests, groupType];
  const visitTimeAndWeather = [
    { title: "Best Time to Visit : ", item: bestTimeToVisit },
    { title: "Weather : ", item: weatherInfo },
  ];

  // --- STRIPE REDIRECTION LOGIC (LOG-03) ---
  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to continue payment");
      navigate("/login", { state: { from: path } });
      return;
    }

    if (!tripDetails) return;

    const numericAmount = Number(String(estimatedPrice || "0").replace(/[^0-9.]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Valid trip price not found. Cannot proceed to payment.");
      return;
    }

    try {
      setIsProcessing(true);

      const response = await api.post("/payment/checkout", {
        tripId: tripId,
        tripName: name || "Trip Booking",
        tripImage: imageUrls[0] || "",
        tripDescription: description || "",
        amount: numericAmount,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (checkoutError: any) {
      console.error("Checkout Error:", checkoutError);
      toast.error(
        checkoutError.response?.data?.message || "Cannot initiate payment process."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      setIsDownloadingPDF(true);
      exportTripToPDF({
        title: name || "Trip Itinerary",
        country: country || "",
        duration: duration || 0,
        budget: budget || "",
        travelStyle: travelStyle || "",
        estimatedPrice: estimatedPrice || "",
        description: description || "",
        itinerary: itinerary || [],
        bestTimeToVisit: bestTimeToVisit || [],
        weatherInfo: weatherInfo || [],
      });
      toast.success("PDF travel guide generated successfully!");
    } catch (pdfErr) {
      console.error("PDF export error:", pdfErr);
      toast.error("Failed to generate PDF guide");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  useEffect(() => {
    const getTripData = async () => {
      if (!tripId) {
        setError("Trip ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getTripDetails(tripId);
        setTripDetails(response.data.trip.tripDetails);
        setImageUrls(response.data.trip.imageUrls || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip Data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTrips = async () => {
      try {
        const response = await getAllTrips(1, 4);
        setPopularTrips(response.data.trips || []);
      } catch (err) {
        console.error("Error loading popular trips:", err);
      }
    };

    // Fetch Ratings Logic 
    const fetchTripReviews = async () => {
      try {
        const response = await api.get(`/reviews/trip/${tripId}`);
        const reviews = response.data.data;
        
        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
          setAverageRating(total / reviews.length);
          setTotalReviews(reviews.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    getTripData();
    fetchAllTrips();
    fetchTripReviews();
  }, [tripId]);

  if (loading) {
    return (
      <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
          {...(isAdmin && {
            ctaText: "Edit Trip Data",
            ctaURL: `/admin/trip/edit/${tripId}`,
            icon: <AiFillEdit />,
          })}
        />
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
          {...(isAdmin && {
            ctaText: "Edit Trip Data",
            ctaURL: `/admin/trip/edit/${tripId}`,
            icon: <AiFillEdit />,
          })}
        />
        <div className="text-center py-20">
          <h2 className="text-xl font-bold mb-2 text-red-600">{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
        {...(isAdmin && {
          ctaText: "Edit Trip Data",
          ctaURL: `/admin/trip/edit/${tripId}`,
          icon: <AiFillEdit />,
        })}
      />
      <section className="flex flex-col gap-9 mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-3 text-black md:text-4xl">
              {name || "Loading..."}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <InfoPill text={`${duration} days`} icon={<MdOutlineDateRange />} />
              <InfoPill
                text={
                  itinerary
                    ?.slice(0, 2)
                    .map((item: any) => item.location)
                    .join(", ") || ""
                }
                icon={<IoLocationOutline />}
              />
            </div>
          </div>

          {/* Quick Action Buttons (Share & Download PDF) */}
          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={() => setIsShareModalOpen(true)}
              aria-label="Share Trip"
              title="Share Trip"
              className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <IoShareSocialOutline size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              aria-label="Download PDF"
              title="Download PDF"
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <IoDownloadOutline size={18} />
              <span className="hidden sm:inline">
                {isDownloadingPDF ? "Exporting..." : "PDF Guide"}
              </span>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-7 mt-1">
          {imageUrls.map((url: string, index: number) => (
            <img
              key={index}
              src={url}
              alt={`Trip Image ${index + 1}`}
              className={cn(
                "w-full rounded-xl object-cover",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <section className="flex gap-3 md:gap-5 justify-between items-center flex-wrap">
            <div className="flex gap-0.5 justify-between">
              {chipsData.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  variant={
                    budget === data
                      ? "primary"
                      : travelStyle === data
                      ? "pink"
                      : interests === data
                      ? "success"
                      : groupType === data
                      ? "purple"
                      : "default"
                  }
                  className="mr-3"
                />
              ))}
            </div>
             <div>
              <ul className="flex gap-1 justify-between items-center">
                {Array(5).fill(null).map((_, index) => (
                    <li key={index} className={index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                      <FaStar />
                    </li>
                  ))}
                <li className="ml-1">
                  <Chip label={`${averageRating.toFixed(1)}/5 (${totalReviews})`} variant="warning" />
                </li>
              </ul>
            </div>
          </section>

          <section className="flex justify-between gap-5 w-full">
            <article className="flex flex-col gap-2">
              <h3 className="text-xl md:text-3xl text-dark-100 font-semibold">
                {duration}-Day {country} {travelStyle}
              </h3>
              <p className="text-base text-gray-500 font-normal">
                {budget}, {groupType} and {interests}
              </p>
            </article>

            <h2 className="text-xl md:text-3xl text-blue-600 font-bold whitespace-nowrap">
              {estimatedPrice}
            </h2>
          </section>
        </section>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
          {description}
        </p>

        {/* Cost Breakdown Widget */}
        <CostBreakdown estimatedPrice={estimatedPrice} />

        {/* Interactive Day-by-Day Timeline */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Daily Plan</h2>
          <ItineraryTimeline itinerary={itinerary} />
        </div>

        {visitTimeAndWeather.map((section) => (
          <section key={section.title} className="flex flex-col gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-base md:text-lg text-gray-900 font-semibold">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {section.item?.map((item: any) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-gray-600"
                >
                  <span className="text-blue-500">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="location-map">
          <div className="bg-gray-200 h-px w-full" />
          <WorldMap />
          <div className="bg-gray-200 h-px w-full" />
        </section>

        <div>
          <Button
            ctaText={
              isProcessing
                ? "Processing..."
                : `Proceed to Pay ${estimatedPrice}`
            }
            onClick={handlePayment}
            disabled={isProcessing || isAdmin}
            variant="primary"
            className="md:w-full cursor-pointer py-3.5"
          />
          <p className="text-xs text-gray-400 mt-4 leading-relaxed text-center">
            By clicking "Proceed to Pay", you agree to our terms and conditions.
            Your card information is securely processed through Stripe.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="bg-gray-200 h-px w-full" />
        <h2 className="text-2xl font-semibold">Popular Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
          {popularTrips.map((trip) => (
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
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripTitle={name || "Tripvisito Trip"}
        tripUrl={window.location.href}
      />
    </main>
  );
};

export default TripDetails;
