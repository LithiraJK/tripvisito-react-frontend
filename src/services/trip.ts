import api from "./api";

export const generateTrip = async (country: string,travelStyle: string,interests: string,budget: string,duration: number,groupType: string) => {
  const trip = await api.post("/trip/generate-trip", {country,travelStyle,interests,budget,duration,groupType});
  return trip.data;
};
