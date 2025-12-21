import { useState, useRef, useEffect } from "react";
import apiClient from "../../api/client";
import styles from "./Chat.module.css";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import { useLocation } from "react-router-dom";

// 백엔드에 넘길 땐 false 로
const USE_MOCK = false;

// 음악 옵션 이모지 매핑
const MUSIC_EMOJI_MAP = {
  breeze: "🍃",
  amusement: "🎠",
  ocean: "🌊",
  none: "",
};

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
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/none.png"
  );
  const [input, setInput] = useState("");
  const [musicOptions, setMusicOptions] = useState([]);
  const messageEndRef = useRef(null);
  const location = useLocation();
  const initialMusicId = location.state?.selectedMusicId || null;
  const [puppetName, setPuppetName] = useState("");
  // 퍼펫 이름 가져오기
  useEffect(() => {
    const fetchPuppetName = async () => {
      try {
        const res = await apiClient.get("/api/children/3/mypage");
        setPuppetName(res.data.puppetName || "토리");
      } catch (err) {
        console.error("퍼펫 이름 불러오기 실패:", err);
      }
    };

    fetchPuppetName();
  }, []);

  // 메시지 ID용 ref (키 중복 방지)
  const messageIdRef = useRef(2);
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
  // 배경 이미지 매핑 추가
  const backgroundMap = {
    breeze:
      "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/breeze.png",
    amusement:
      "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/amusement.png",
    ocean:
      "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/ocean.png",
    none: "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/none.png",
  };
  // 초기 음악 설정
  useEffect(() => {
    if (initialMusicId) {
      setCurrentSoundId(initialMusicId);
      setSelectedMusic(musicOptions.find((opt) => opt.id === initialMusicId));
      setBackgroundImageUrl(
        backgroundMap[initialMusicId] || backgroundMap.none
      );
    }
  }, [initialMusicId, musicOptions]);
  // 음악 옵션 API 호출
  useEffect(() => {
    const fetchMusicOptions = async () => {
      if (USE_MOCK) {
        // Mock 데이터
        setMusicOptions([
          { id: "breeze", name: "잔잔한 바람소리" },
          { id: "amusement", name: "신나는 놀이공원" },
          { id: "ocean", name: "시원한 바다" },
          { id: "none", name: "음악 없음" },
        ]);
        return;
      }

      try {
        const res = await apiClient.get("/api/sounds");
        setMusicOptions(res.data);
      } catch (error) {
        console.error("음악 옵션 로드 실패:", error);
        // 폴백 데이터
        setMusicOptions([
          { id: "breeze", name: "잔잔한 바람소리" },
          { id: "amusement", name: "신나는 놀이공원" },
          { id: "ocean", name: "시원한 바다" },
          { id: "none", name: "음악 없음" },
        ]);
      }
    };

    fetchMusicOptions();
  }, []);

  // 새 메시지 추가될때마다 자동으로 아래 스크롤되게
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // 오디오 재생용 ref
  const audioRef = useRef(null);

  // currentSoundId가 바뀔 때마다 음악 로딩/재생
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!currentSoundId || currentSoundId === "none") return;

    // 음악 로드될 때까지 기다림
    if (musicOptions.length === 0) {
      console.log("⏳ 음악 옵션 로딩 중...");
      return;
    }

    const selectedOption = musicOptions.find(
      (opt) => opt.id === currentSoundId
    );

    // 옵션을 찾지 못했거나 fileUrl이 없으면 중단
    if (!selectedOption) {
      console.warn(`음악 옵션을 찾을 수 없음: ${currentSoundId}`);
      return;
    }

    if (!selectedOption.fileUrl) {
      console.log(`${selectedOption.name}은 음악 파일이 없습니다.`);
      return;
    }

    console.log(`🎵 음악 재생: ${selectedOption.name}`, selectedOption.fileUrl);

    const audio = new Audio(selectedOption.fileUrl);
    audio.loop = true;
    audio
      .play()
      .then(() => {
        audioRef.current = audio;
        console.log("음악 재생 성공");
      })
      .catch((err) => {
        console.error("음악 재생 실패:", err);
      });

    return () => {
      audio.pause();
    };
  }, [currentSoundId, musicOptions]);
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
          time: getCurrentTime(),
        },
      ]);
    }

    // // 배경 이미지 업데이트
    // if (data.backgroundImageUrl) {
    //   const url = data.backgroundImageUrl;
    //   setBackgroundImageUrl(
    //     url.startsWith("http") ? url : url.startsWith("/") ? url : `/${url}`
    //   );
    // }

    // // 사운드 아이디 업데이트
    // if (data.currentSoundId) {
    //   setCurrentSoundId(data.currentSoundId);
    // }
  };

  // axios + mock 스위치가 있는 API 호출 함수
  const callChatApi = async ({
    userMessage,
    soundId,
    showMessage = true,
    loadingMessageId,
  }) => {
    try {
      const res = await apiClient.post("/api/chat/process", {
        sessionId: "test_user_001",
        childId: 3,
        userMessage,
        ...(soundId !== undefined && { soundId }),
      });

      const data = res.data;

      // 로딩 말풍선 제거
      if (loadingMessageId) {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessageId)
        );
      }
      applyChatResponse(data, { showMessage });
    } catch (error) {
      console.error("채팅 API 호출 실패:", error);
      // TODO: 사용자에게 에러 토스트 띄우기
    }
  };

  // 음악 선택 시 (첫 요청) → 음악/배경만 바꾸고 말풍선은 안 뜨게
  const handleSelectMusic = async (option) => {
    setSelectedMusic(option);
    setCurrentSoundId(option.id);

    // 배경 이미지 즉시 변경
    const backgroundMap = {
      breeze:
        "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/breeze.png",
      amusement:
        "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/amusement.png",
      ocean:
        "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/ocean.png",
      none: "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/none.png",
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
    const loadingMessageId = getNextMessageId();

    setMessages((prev) => [
      ...prev,
      {
        id: getNextMessageId(),
        role: "user",
        text: userText,
        time: getCurrentTime(),
      },
      {
        id: loadingMessageId,
        role: "assistant-loading",
        text: "대답을 생각 중이에요…",
        time: getCurrentTime(),
      },
    ]);
    setInput("");

    await callChatApi({
      userMessage: userText,
      soundId: null,
      showMessage: true,
      loadingMessageId,
    });
  };

  return (
    <div
      className="app-wrapper"
      style={{
        backgroundImage: `url('${backgroundImageUrl}')`,
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
            <span className={styles.characterName}>{puppetName}</span>
          </div>
        </div>

        <div className={styles.scrollArea}>
          {/* 음악 선택 카드 */}
          <div className={styles.musicCard}>
            <p className={styles.musicQuestion}>
              "아기사자야, 안녕! 오늘 하루는 어땠어? <br />
              대화에 어울리는 음악을 골라줘!"
            </p>
            <div className={styles.musicOptions}>
              {musicOptions.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.musicOptionButton} ${
                    selectedMusic?.id === option.id
                      ? styles.musicOptionButtonSelected
                      : ""
                  }`}
                  onClick={() => handleSelectMusic(option)}
                >
                  {MUSIC_EMOJI_MAP[option.id] || "🎵"} {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* 채팅 버블 영역 */}
          <div className={styles.messageList}>
            {messages.map((msg) => {
              if (msg.role === "assistant-loading") {
                return (
                  <div key={msg.id} className={styles.messageWrapperLeft}>
                    <div className={styles.assistantBubble}>
                      <p className={styles.loadingText}>🤔 {msg.text}</p>
                    </div>
                    <span className={styles.timeLeft}>{msg.time}</span>
                  </div>
                );
              }
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
                      <div className={styles.assistantBubble}>
                        <p>{msg.text}</p>
                      </div>
                      {msg.time && (
                        <span className={styles.timeLeft}>{msg.time}</span>
                      )}
                    </>
                  ) : (
                    <>
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
            <div ref={messageEndRef} />
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
