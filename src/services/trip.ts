import api from "./api";

export const generateTrip = async (country: string,travelStyle: string,interests: string,budget: string,duration: number,groupType: string) => {
  const res = await api.post("/trip/generate-trip", {country,travelStyle,interests,budget,duration,groupType});
  return res.data;
};

export const getTripDetails = async (tripId: string) => {
  const res = await api.get(`/trip/${tripId}`);
  return res.data;
};

export const getAllTrips = async () => {
  const res = await api.get("/trip/all");
  return res.data;
}
