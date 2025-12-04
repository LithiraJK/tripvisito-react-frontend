import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { getTripDetails } from "../../services/trip";
import InfoPill from "../../components/InfoPill";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { cn } from "../../lib/utils";

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [imageUrls , setImageUrls] = useState<string[]>([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


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
    location,
    itinerary,
  } = tripDetails || {};

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

    getTripData(); // runs AFTER the component mounts and renders
  }, [tripId]); // Re-runs when tripId changes

  if (loading) {
    return (
      <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title="Trip Details"
          description="View and edit AI-generated travel plans"
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
      />
      <section className="flex flex-col gap-9 mt-2.5  w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <header>
          <h1 className="font-semibold text-black text-2xl">
            {name || "Loading..."}
          </h1>
          <InfoPill text={`${duration} days`} icon={<MdOutlineDateRange />} />
          <InfoPill
            text={itinerary
              ?.slice(0, 2)
              .map((item : any) => item.location)
              .join(", ") || ""}
            icon={<IoLocationOutline />}
          />
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-7 mt-1">
            {imageUrls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Trip Image ${index + 1}`}
                className={cn("w-full rounded-xl object-cover" , index === 0 ? 'md:col-span-2 md:row-span-2 h-[330px]' : 'md:row-span-1 h-[150px]')}
              />
            ))}

        </section>

        <section className="flex gap-3 md:gap-5 items-center flex-wrap">

        </section>
      </section>
    </main>
  );
};

export default TripDetails;

/**
 "data": {
        "trip": {
            "_id": "69310faf1a773752a3c57f61",
            "tripDetails": {
                "name": "Sri Lankan Adventure for Two",
                "description": "Experience the thrill of Sri Lanka with your loved one on this 5-day adventure! Hike to majestic waterfalls, explore ancient ruins, and surf the waves of the Indian Ocean. This itinerary balances adrenaline-pumping activities with moments of relaxation in stunning settings.",
                "estimatedPrice": "$850",
                "duration": 5,
                "budget": "Mid-Range",
                "travelStyle": "Adventure",
                "country": "Sri Lanaka",
                "interests": "undefined",
                "groupType": "Couple",
                "bestTimeToVisit": [
                    "☀️ December to March: Best time for the west and south coasts and the hill country, offering dry weather for hiking and beach activities.",
                    "🌸 April to September: Ideal for the east coast, with sunny skies and calm seas perfect for surfing and diving.",
                    "🍁 Shoulder Seasons (March/April & September/October): Less crowded and offer a good balance of weather conditions across the island.",
                    "🌧️ May to August: Monsoon season in the southwest, expect rain but lower prices."
                ],
                "weatherInfo": [
                    "☀️ Dry Season (West & South): 27-31°C (81-88°F)",
                    "☀️ Dry Season (East): 28-32°C (82-90°F)",
                    "🌦️ Shoulder Seasons: 26-30°C (79-86°F)",
                    "🌧️ Monsoon Season (Southwest): 25-29°C (77-84°F)"
                ],
                "location": {
                    "city": "Colombo",
                    "coordinates": [
                        6.9271,
                        79.8612
                    ],
                    "openStreetMap": "https://www.openstreetmap.org/#map=12/6.9271/79.8612"
                },
                "itinerary": [
                    {
                        "day": 1,
                        "location": "Kitulgala",
                        "activities": [
                            {
                                "time": "Morning",
                                "description": "🚣‍♀️ Arrive in Kitulgala and embark on a white water rafting adventure on the Kelani River. Experience thrilling rapids and stunning scenery."
                            },
                            {
                                "time": "Afternoon",
                                "description": "🏞️ Go canyoning! Rappel down waterfalls and slide through natural rock formations in a lush jungle setting. Safety gear and instruction will be provided."
                            },
                            {
                                "time": "Evening",
                                "description": "🏕️ Check into your eco-lodge and enjoy a relaxing dinner with views of the surrounding rainforest. Afterwards chill."
                            }
                        ]
                    },
                    {
                        "day": 2,
                        "location": "Nuwara Eliya",
                        "activities": [
                            {
                                "time": "Morning",
                                "description": "⛰️ Hike to a scenic viewpoint in the surrounding hills of Kitulgala for panoramic vistas. Enjoy the trek!"
                            },
                            {
                                "time": "Afternoon",
                                "description": "🚂 Take a scenic train ride from Peradeniya to Nuwara Eliya, passing through tea plantations and rolling hills. A classic Sri Lankan experience."
                            },
                            {
                                "time": "Evening",
                                "description": "☕ Check into your hotel in Nuwara Eliya and enjoy a traditional high tea experience at The Grand Hotel. A touch of colonial elegance."
                            }
                        ]
                    },
                    {
                        "day": 3,
                        "location": "Ella",
                        "activities": [
                            {
                                "time": "Morning",
                                "description": "🌄 Hike to Little Adam's Peak for stunning sunrise views of the surrounding landscape. A relatively easy hike with rewarding vistas."
                            },
                            {
                                "time": "Afternoon",
                                "description": "🌉 Trek across the Nine Arch Bridge, a stunning example of colonial-era railway construction. Capture incredible photos!"
                            },
                            {
                                "time": "Evening",
                                "description": "🍲 Enjoy a delicious Sri Lankan cooking class and learn to prepare local specialties. Dine on your creations!"
                            }
                        ]
                    },
                    {
                        "day": 4,
                        "location": "Arugam Bay",
                        "activities": [
                            {
                                "time": "Morning",
                                "description": "🏄‍♀️ Travel to Arugam Bay, the surf capital of Sri Lanka. Take a surfing lesson and catch some waves. Perfect for beginners and experienced surfers alike."
                            },
                            {
                                "time": "Afternoon",
                                "description": "🐊 Take a lagoon safari to spot wildlife, including crocodiles, elephants, and various bird species. A unique and immersive experience."
                            },
                            {
                                "time": "Evening",
                                "description": "🏖️ Relax on the beach and enjoy a seafood dinner at a beachfront restaurant. Watch the sunset over the Indian Ocean."
                            }
                        ]
                    },
                    {
                        "day": 5,
                        "location": "Colombo",
                        "activities": [
                            {
                                "time": "Morning",
                                "description": "🌊 Enjoy a final morning of surfing or relaxing on the beach in Arugam Bay."
                            },
                            {
                                "time": "Afternoon",
                                "description": "✈️ Transfer to Colombo (domestic flight recommended to save time) for your departure flight."
                            },
                            {
                                "time": "Evening",
                                "description": "Departure from Colombo."
                            }
                        ]
                    }
                ]
            },
            "imageUrls": [
                "https://images.unsplash.com/photo-1599668187742-d047e6c6e0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzg5MzR8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5ha2ElMjBBZHZlbnR1cmV8ZW58MHwwfHx8MTc2NDc4NjkwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                "https://images.unsplash.com/photo-1616479923713-a29f86b74895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzg5MzR8MHwxfHNlYXJjaHwyfHxTcmklMjBMYW5ha2ElMjBBZHZlbnR1cmV8ZW58MHwwfHx8MTc2NDc4NjkwNXww&ixlib=rb-4.1.0&q=80&w=1080",
                "https://images.unsplash.com/photo-1657634889654-932db6ec0fcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzg5MzR8MHwxfHNlYXJjaHwzfHxTcmklMjBMYW5ha2ElMjBBZHZlbnR1cmV8ZW58MHwwfHx8MTc2NDc4NjkwNXww&ixlib=rb-4.1.0&q=80&w=1080"
            ],
            "paymentLink": "",
            "createdAt": "2025-12-04T04:35:59.378Z",
            "userId": "6922d9e5c9d0162d835b1122",
            "__v": 0
        }
    }
 */
