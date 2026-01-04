import api from "./api";

export const fetchNotifications = async () => {
  const res = await api.get(`/notifications`);
  return res.data;
}

export const markAsRead = async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
}

export const deleteNotification = async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
}