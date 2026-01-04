import api from "./api";

export const getMyBookedTrips = async () => {
  const res = await api.get("/payment/my-bookings");
  return res.data;
};
