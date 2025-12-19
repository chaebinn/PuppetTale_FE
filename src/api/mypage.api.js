import apiClient from "./client.js";

const CHILD_ID = 3;
const base = () => `/api/children/${CHILD_ID}`;

// 마이페이지 조회: GET /api/children/{childId}/mypage
export const getMyPage = () => {
  return apiClient.get(`${base()}/mypage`);
};
