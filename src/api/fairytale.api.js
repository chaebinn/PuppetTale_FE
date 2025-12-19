import apiClient from "./client.js";

//로그인 기능이 없으므로, 일단 childId를 3로 고정
const CHILD_ID = 3;

const base = () => `/api/children/${CHILD_ID}/fairytales`;

//동화 목록 조회: GET /api/children/{childId}/fairytales
export const getFairytaleList = () => {
    return apiClient.get(base());
};

//동화 상세 조회: GET /api/children/{childId}/fairytales
export const getFairytaleDetail = (fairyTaleId) => {
  return apiClient.get(`${base()}/${fairyTaleId}`);
};

//동화 제목 수정: PATCH /api/children/{childId}/fairytales/{fairyTaleId}
export const updateFairytaleTitle = (fairyTaleId, title) => {
  return apiClient.patch(`${base()}/${fairyTaleId}`, { title });
};

//동화 삭제: DELETE /api/children/{childId}/fairytales/{fairyTaleId}
export const deleteFairytale = (fairyTaleId) => {
  return apiClient.delete(`${base()}/${fairyTaleId}`);
};

//동화 생성: POST /api/children/{childId}/fairytales/create
export const createFairytale = (payload = null) => {
  const defaultPayload = {
    sessionId: "server_user_001",
    childId: 3,
    userName: "아기사자",
    userAge: 7,
    puppetName: "토리",
  };

  return apiClient.post(
    `${base()}/create`,
    payload ?? defaultPayload
  );
};