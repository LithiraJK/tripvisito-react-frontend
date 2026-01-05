import api from "./api";

export const submitTripReview = async (reviewData: { tripId: string; rating: number; comment: string }) => {
    const res = await api.post("/reviews/submit", reviewData);
    return res.data;
};

export const fetchTripReviews = async (tripId: string) => {
    const res = await api.get(`/reviews/trip/${tripId}`);
    return res.data;
};

export const fetchAllReviews = async (page: number, limit: number) => {
    const res = await api.get(`/reviews?page=${page}&limit=${limit}`);
    return res.data;
};