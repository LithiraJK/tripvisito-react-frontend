import { useState, useEffect, use } from "react";
import ComboBox from "../../components/ComboBox";
import Header from "../../components/Header";
import WorldMap from "../../components/WorldMap";
import Button from "../../components/Button";
import { BsStars } from "react-icons/bs";
import { TbLoader3 } from "react-icons/tb";
import Chip from "../../components/Chip";
import { toast } from "react-hot-toast";
import { generateTrip } from "../../services/trip";
import { useNavigate } from "react-router-dom";

export interface Country {
  cca2: string;
  name: {
    common: string;
  };
  flags?: {
    png: string;
    svg: string;
  };
}

export interface TripFormData {
  country: string;
  travelStyle: string;
  interests: string;
  budget: string;
  duration: number;
  groupType: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error("Invalid data format received:", data);
      return [];
    }

    // Sort them A-Z immediately
    const sortedData = data.sort((a: Country, b: Country) =>
      a.name.common.localeCompare(b.name.common)
    );

    return sortedData;
  } catch (error) {
    console.error("Error fetching Country data:", error);
    return [];
  }
};

export const CreateTrip = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    travelStyle: "",
    interests: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.country ||
      !formData.duration ||
      !formData.groupType ||
      !formData.travelStyle ||
      !formData.interests ||
      !formData.budget
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      toast.error("Please fill all required fields.");
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      toast.error("Duration must be between 1 and 10 days");
      return;
    }

    try {
      console.log("Form submitted:", formData);
      setLoading(true);
      const tripData = await generateTrip(
        formData.country,
        formData.travelStyle,
        formData.interests,
        formData.budget,
        formData.duration,
        formData.groupType
      );

      if(!tripData){
        setError("No trip data received from server");
      }

      console.log("Generated Trip Data:", tripData);
      setLoading(false);

      //navigate to edit page with tripData
      if(tripData.data && tripData.data.tripId){
        navigate(`/trips/${tripData.data.tripId}`);
      }else{
        setError("Invalid trip data received from server");
      }

    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
    icon: country.flags?.png || country.flags?.svg,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <form
          className="flex flex-col gap-6 py-6 bg-white rounded-xl shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="country"
            >
              Country
            </label>
            <ComboBox
              options={countryOptions}
              value={formData.country}
              onChange={(value) => handleChange("country", value)}
              placeholder="Select a country..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400 "
              htmlFor="duration"
            >
              Duration
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              placeholder="Enter a number of days..."
              value={formData.duration || ""}
              className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="groupType"
            >
              Group Type
            </label>
            <ComboBox
              options={[
                { value: "family", label: "Family" },
                { value: "friends", label: "Friends" },
                { value: "solo", label: "Solo" },
                { value: "couple", label: "Couple" },
              ]}
              value={formData.groupType}
              onChange={(value) => handleChange("groupType", value)}
              placeholder="Select group type..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="travelStyle"
            >
              Travel Style
            </label>
            <ComboBox
              options={[
                { value: "adventure", label: "Adventure" },
                { value: "relaxation", label: "Relaxation" },
                { value: "cultural", label: "Cultural" },
                { value: "romantic", label: "Romantic" },
              ]}
              value={formData.travelStyle}
              onChange={(value) => handleChange("travelStyle", value)}
              placeholder="Select a travel style..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="interest"
            >
              Interests
            </label>
            <ComboBox
              options={[
                { value: "nature", label: "Nature" },
                { value: "history", label: "History" },
                { value: "food", label: "Food" },
                { value: "art", label: "Art" },
              ]}
              value={formData.interests}
              onChange={(value) => handleChange("interests", value)}
              placeholder="Select your interests..."
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="travelStyle"
            >
              Budget Estimate
            </label>
            <ComboBox
              options={[
                { value: "budget", label: "Budget" },
                { value: "midrange", label: "Mid-range" },
                { value: "luxury", label: "Luxury" },
              ]}
              value={formData.budget}
              onChange={(value) => handleChange("budget", value)}
              placeholder="Select your budget preference"
            />
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="worldMap"
            >
              Location on the world map
            </label>
            <div className="w-full h-[300px] md:h-[400px] border-2 rounded-lg duration-200 bg-white border-gray-200 overflow-hidden">
              <WorldMap
                selectedCountry={formData.country}
                onCountryClick={(countryName) =>
                  handleChange("country", countryName)
                }
              />
            </div>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="px-6">
              <Chip
                variant="danger"
                label={error}
                className="rounded-md w-full justify-center py-2"
              />
            </div>
          )}

          <footer className="w-full px-6">
            <Button
              type="submit"
              ctaText={loading ? "Generating Trip..." : "Generate Trip"}
              icon={
                loading ? <TbLoader3 className="animate-spin" /> : <BsStars />
              }
              variant="primary"
              fullWidth={true}
              disabled={loading}
            />
          </footer>
        </form>
      </section>
    </main>
  );
};
