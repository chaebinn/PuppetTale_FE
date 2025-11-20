//가장 최신 값들(puppet 이름, 모드 등의 정보를 전역으로 갖다 쓰기 위함
import { createContext, useContext, useState, useEffect } from "react";

const PuppetContext = createContext();

const PUPPET_MODES = [
  { id: "MATURE", emoji: "🙂", label: "성숙한" },
  { id: "AFFECTIONATE", emoji: "🤗", label: "다정한" },
  { id: "ENERGETIC", emoji: "😆", label: " 활기찬" },
  { id: "REASSURING", emoji: "💪", label: "든든한" },
];

export function PuppetProvider({ children }) {
  const [puppetName, setPuppetName] = useState("");
  const [puppetMode, setPuppetMode] = useState("");

  // 로컬스토리지에서 값 불러오기
  useEffect(() => {
    const savedName = localStorage.getItem("puppetName");
    if (savedName) setPuppetName(savedName);

    const savedMode = localStorage.getItem("puppetMode");
    if (savedMode) setPuppetMode(savedMode);
  }, []);

  // 업데이트 함수
  const updatePuppetName = (name) => {
    setPuppetName(name);
    localStorage.setItem("puppetName", name);
  };

  const updatePuppetMode = (mode) => {
    setPuppetMode(mode);
    localStorage.setItem("puppetMode", mode);
  };

  //mode -> label로! (modeId 가 아니라 라벨 자체를 갖다 쓸 수 있도록)
  const puppetModeLabel =
    PUPPET_MODES.find((m) => m.id === puppetMode)?.label || "";

  return (
    <PuppetContext.Provider
      value={{
        puppetName,
        puppetMode,
        puppetModeLabel,
        updatePuppetName,
        updatePuppetMode,
      }}
    >
      {children}
    </PuppetContext.Provider>
  );
}

// Hook
export function usePuppet() {
  return useContext(PuppetContext);
}
