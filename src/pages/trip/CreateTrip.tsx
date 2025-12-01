import { useState, useEffect } from "react";
import ComboBox from "../../components/ComboBox";
import Header from "../../components/Header";

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
  interest: string;
  budget: string;
  duration: number;
  groupType: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flags");
    
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
  const [selectedCountry, setSelectedCountry] = useState("");


  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected country:", selectedCountry);
  };

  const handleChange = (key: keyof TripFormData, value: string) => {
    setSelectedCountry(value);

  }

  const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    icon: country.flags?.png || country.flags?.svg
  }));

  
  return (
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />
      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">
        <form
          className="flex flex-col gap-6 py-6 bg-white border border-light-200 rounded-xl shadow-100"
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
              value={selectedCountry}
              onChange={(value) => handleChange("country", value)}
              placeholder="Select a country..."
            />
          </div>
        
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label className="text-sm font-normal text-gray-400 " htmlFor="duration">Duration</label>
           <input
                type="number"
                id="budget"
                name="budget"
                placeholder="Enter a number of days..."
                className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
                onChange={(e) => handleChange('budget', e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label className="text-sm font-normal text-gray-400" htmlFor="travelStyle">Travel Style</label>
            <ComboBox
              options={[
                { value: 'adventure', label: 'Adventure' },
                { value: 'relaxation', label: 'Relaxation' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'romantic', label: 'Romantic' },
              ]}
              value={selectedCountry}
              onChange={(value) => handleChange("travelStyle", value)}
              placeholder="Select a travel style..."
            />
          </div>
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label className="text-sm font-normal text-gray-400" htmlFor="interest">Interests</label>
            <ComboBox
              options={[
                { value: 'adventure', label: 'Adventure' },
                { value: 'relaxation', label: 'Relaxation' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'romantic', label: 'Romantic' },
              ]}
              value={selectedCountry}
              onChange={(value) => handleChange("travelStyle", value)}
              placeholder="Select a travel style..."
            />
          </div>
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label className="text-sm font-normal text-gray-400" htmlFor="travelStyle">Budget Estimate</label>
            <ComboBox
              options={[
                { value: 'adventure', label: 'Adventure' },
                { value: 'relaxation', label: 'Relaxation' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'romantic', label: 'Romantic' },
              ]}
              value={selectedCountry}
              onChange={(value) => handleChange("travelStyle", value)}
              placeholder="Select your budget preference"
            />
          </div>
        </form>
      </section>
    </main>
  );
};
