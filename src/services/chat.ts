// chat.ts
import api from "./api";


export const fetchChatUsers = async () => {
  const res = await api.get(`/chat/active-users`);
  return res.data;
};