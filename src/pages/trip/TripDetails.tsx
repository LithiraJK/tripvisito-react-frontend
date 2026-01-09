import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { getTripDetails, getAllTrips } from "../../services/trip";
import InfoPill from "../../components/InfoPill";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
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

export interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  description: string;
}

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [popularTrips, setPopularTrips] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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



  // --- STRIPE REDIRECTION LOGIC ---
  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to continue payment");
      navigate("/login", { state: { from: path } });
      return;
    }

    if (!tripDetails) return;

    try {
      setIsProcessing(true);

      const response = await api.post("/payment/checkout", {
        tripId: tripId,
        tripName: name,
        tripImage: imageUrls[0],
        tripDescription: description,

        amount: Number(estimatedPrice.replace(/[^0-9.]/g, "")),
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(
        error.response?.data?.message || "Cannot initiate payment process."
      );
    } finally {
      setIsProcessing(false);
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
        console.log("Trip Data:", response);
        setTripDetails(response.data.trip.tripDetails);
        setImageUrls(response.data.trip.imageUrls || []);
      } catch (error) {
        console.error(error);
        setError("Failed to load trip Data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllTrips = async () => {
      try {
        const response = await getAllTrips(1, 4);
        console.log("All Trips Data:", response);
        setPopularTrips(response.data.trips || []);
      } catch (error) {
        console.error("Error loading popular trips:", error);
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
      } catch (error) {
        console.error("Error fetching reviews:", error);
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
          ctaText="Edit Trip Data"
          ctaURL={`/admin/trip/edit/${tripId}`}
          icon={<AiFillEdit />}
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
      <section className="flex flex-col gap-9 mt-2.5  w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <header>
          <h1 className="text-3xl font-semibold mb-3 text-black md:text-4xl">
            {name || "Loading..."}
          </h1>
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
                {/* Dynamic Stars [cite: 2025-10-11] */}
                {Array(5).fill(null).map((_, index) => (
                    <li key={index} className={index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                      <FaStar />
                    </li>
                  ))}
                <li className="ml-1">
                  {/* Dynamic Chip Label [cite: 2025-09-30] */}
                  <Chip label={`${averageRating.toFixed(1)}/5 (${totalReviews})`} variant="warning" />
                </li>
              </ul>
            </div>
          </section>

          <section className="flex justify-between gap-5 w-full">
            <article className="flex flex-col gap-4">
              <h3 className=" text-xl md:text-3xl text-dark-100 font-semibold">
                {duration}-Day {country} {travelStyle}
              </h3>
              <p className="text-base md:text-xl text-gray-400 font-normal">
                {budget}, {groupType} and {interests}{" "}
              </p>
            </article>

            <h2 className=" text-lg md:text-2xl text-dark-100 font-semibold">
              {estimatedPrice}
            </h2>
          </section>
        </section>
        <p className="text-sm md:text-lg font-normal first-letter:text-3xl first-letter:font-semibold">
          {description}
        </p>

        <ul className="flex flex-col gap-9">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li
              key={index}
              className="flex flex-col max-sm:flex-col  justify-between sm:gap-7 gap-3 text-sm md:text-lg font-normal text-dark-400 list-disc!"
            >
              <h3 className="text-base md:text-xl font-semibold text-black">
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul className="flex flex-col sm:gap-3 gap-7">
                {dayPlan.activities.map((activity, number) => (
                  <li
                    key={number}
                    className="flex flex-col max-sm:flex-col justify-between sm:gap-7 gap-3 text-sm md:text-lg font-normal text-dark-400 list-disc!"
                  >
                    <span className="w-[90px] font-medium">
                      {activity.time}
                    </span>
                    <p>{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeather.map((section) => (
          <section key={section.title} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <h3 className="text-base md:text-xl text-dark-400 font-semibold">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.item?.map((item: any) => (
                  <li
                    key={item}
                    className="flex justify-between gap-7 text-sm md:text-lg font-normal text-dark-400 list-disc"
                  >
                    <p className="grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
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
            className="md:w-full cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-6 leading-relaxed">
            By clicking "Proceed to Pay", you agree to our terms and conditions.
            Your card information is never stored on our servers.
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
    </main>
  );
};

export default TripDetails;
