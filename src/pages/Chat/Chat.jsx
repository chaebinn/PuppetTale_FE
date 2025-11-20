import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./Chat.module.css";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

// 백엔드에 넘길 땐 false 로
const USE_MOCK = false;

const MUSIC_OPTIONS = [
  { id: "breeze", label: "🍃 잔잔한 바람소리" },
  { id: "forest", label: "🌳 평온한 숲" },
  { id: "ocean", label: "🌊 시원한 바다" },
  { id: "none", label: "음악 없음" },
];

// 프론트에서 현재 시간 포맷 (유저 메시지용)
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 백엔드 timestamp(ISO 문자열) 포맷 (AI 메시지용)
const formatTimestamp = (isoString) => {
  if (!isoString) return getCurrentTime();
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return getCurrentTime();
  }
};

export default function Chat() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedMusic, setSelectedMusic] = useState(null);
  const [currentSoundId, setCurrentSoundId] = useState("none");
  const [backgroundImageUrl, setBackgroundImageUrl] =
    useState("/images/none.png");

  const [input, setInput] = useState("");

  // 메시지 ID용 ref (키 중복 방지)
  const messageIdRef = useRef(2); // 초기 메시지가 id:1 이라서 2부터 시작
  const getNextMessageId = () => {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "오늘은 뭐하고 지냈어?",
      time: getCurrentTime(),
    },
  ]);

  // 오디오 재생용 ref
  const audioRef = useRef(null);

  // currentSoundId가 바뀔 때마다 음악 로딩/재생
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!currentSoundId || currentSoundId === "none") return;

    const audio = new Audio(`/sounds/${currentSoundId}.mp3`);
    audio.loop = true;

    audio
      .play()
      .then(() => {
        audioRef.current = audio;
      })
      .catch((err) => {
        console.error("음악 재생 실패:", err);
      });

    return () => {
      audio.pause();
    };
  }, [currentSoundId]);

  // 공통 응답 처리 함수 (mock / 실제 응답 둘 다 여기로 모음)
  const applyChatResponse = (data, { showMessage = true } = {}) => {
    // 어시스턴트 말풍선 표시 여부
    if (showMessage && data.aiResponse) {
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId(),
          role: "assistant",
          text: data.aiResponse,
          time: formatTimestamp(data.timestamp),
        },
      ]);
    }

    // 배경 이미지 업데이트
    if (data.backgroundImageUrl) {
      setBackgroundImageUrl(
        data.backgroundImageUrl.startsWith("/")
          ? data.backgroundImageUrl
          : `/${data.backgroundImageUrl}`
      );
    }

    // 사운드 아이디 업데이트
    if (data.currentSoundId) {
      setCurrentSoundId(data.currentSoundId);
    }
  };

  // axios + mock 스위치가 있는 API 호출 함수
  const callChatApi = async ({ userMessage, soundId, showMessage = true }) => {
    // 1) mock 모드 (로컬에서 혼자 테스트할 때만 사용)
    if (USE_MOCK) {
      console.log("[MOCK] callChatApi:", { userMessage, soundId });

      const nowIso = new Date().toISOString();

      const mockData = {
        sessionId: "test_user_001",
        aiResponse: `이건 목업 응답이야! 너가 보낸 말: "${userMessage}"`,
        timestamp: nowIso,
        currentSoundId:
          soundId === undefined || soundId === null
            ? currentSoundId || "breeze"
            : soundId,
        backgroundImageUrl:
          soundId === "forest"
            ? "/images/forest.png"
            : soundId === "ocean"
            ? "/images/ocean.png"
            : soundId === "none"
            ? "/images/none.png"
            : "/images/breeze.png",
      };

      applyChatResponse(mockData, { showMessage });
      return;
    }

    // 2) 실제 백엔드 호출 모드
    try {
      const body = {
        sessionId: "test_user_001", // 임의로 고정해둔 값
        userMessage,
      };

      if (soundId !== undefined) {
        body.soundId = soundId; // "breeze" | "forest" | "ocean" | "none" | null
      }

      const res = await axios.post("/api/chat/process", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      applyChatResponse(data, { showMessage });
    } catch (error) {
      console.error("채팅 API 호출 실패:", error);
      // TODO: 사용자에게 에러 토스트 띄우기 
    }
  };

  // 음악 선택 시 (첫 요청) → 음악/배경만 바꾸고 말풍선은 안 뜨게
  const handleSelectMusic = async (option) => {

    //선택된 음악 표시(버튼)
    setSelectedMusic(option);

    //음악 즉시 변경(API 응답 기다리지 않고)
    setCurrentSoundId(option.id);

    // 배경 이미지 즉시 변경
    const backgroundMap = {
      forest: "/images/forest.png",
      ocean: "/images/ocean.png",
      breeze: "/images/breeze.png",
      none: "/images/none.png",
    };
    setBackgroundImageUrl(backgroundMap[option.id] || "/images/breeze.png");
    
    await callChatApi({
      userMessage: "오늘 대화를 시작할게. 이 음악으로 들려줘.",
      soundId: option.id,
      showMessage: false, 
    });
  };

  // 일반 메시지 보내기
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: getNextMessageId(),
        role: "user",
        text: userText,
        time: getCurrentTime(),
      },
    ]);

    setInput("");

    await callChatApi({
      userMessage: userText,
      soundId: null, // 이후 대화에서는 사운드 유지
      showMessage: true,
    });
  };

  return (
    <div
      className="app-wrapper"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`, // 백엔드가 내려준 이미지 사용
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.chatPage}>
        {/* 캐릭터 영역 */}
        <div className={styles.topSection}>
          <div className={styles.characterArea}>
            <div className={styles.avatar} />
            <span className={styles.characterName}>토리</span>
          </div>
        </div>
        <div className={styles.scrollArea}>
          {/* 음악 선택 카드 */}
          <div className={styles.musicCard}>
            <p className={styles.musicQuestion}>
              “아기사자야, 안녕! 오늘 하루는 어땠어? <br />
              대화에 어울리는 음악을 골라줘!”
            </p>

            <div className={styles.musicOptions}>
              {MUSIC_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.musicOptionButton} ${
                    selectedMusic?.id === option.id
                      ? styles.musicOptionButtonSelected
                      : ""
                  }`}
                  onClick={() => handleSelectMusic(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 채팅 버블 영역 */}
          <div className={styles.messageList}>
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";

              return (
                <div
                  key={msg.id}
                  className={
                    isAssistant
                      ? styles.messageWrapperLeft
                      : styles.messageWrapperRight
                  }
                >
                  {isAssistant ? (
                    <>
                      {/* 어시스턴트: 버블 - 시간 */}
                      <div className={styles.assistantBubble}>
                        <p>{msg.text}</p>
                      </div>
                      {msg.time && (
                        <span className={styles.timeLeft}>{msg.time}</span>
                      )}
                    </>
                  ) : (
                    <>
                      {/* 사용자: 시간 - 버블 */}
                      {msg.time && (
                        <span className={styles.timeRight}>{msg.time}</span>
                      )}
                      <div className={styles.userBubble}>
                        <p>{msg.text}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 입력창 */}
        <div className={styles.inputBar}>
          <input
            className={styles.input}
            placeholder="메시지 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.sendButton} onClick={handleSend}></button>
        </div>
      </div>
    </div>
  );
}
