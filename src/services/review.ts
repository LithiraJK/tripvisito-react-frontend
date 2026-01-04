import api from "./api";

export const submitTripReview = async (reviewData: { tripId: string; rating: number; comment: string }) => {
    const res = await api.post("/reviews", reviewData);
    return res.data;
};