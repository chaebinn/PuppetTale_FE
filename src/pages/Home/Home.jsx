import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import styles from "./Home.module.css";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
import puppetGif from "../../assets/puppet.gif";

const USE_MOCK = false;

// 음악 옵션 이모지 매핑
const MUSIC_EMOJI_MAP = {
  breeze: "🍃",
  amusement: "🎠",
  ocean: "🌊",
  none: "",
};

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [musicOptions, setMusicOptions] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "https://puppettale-images.s3.ap-northeast-2.amazonaws.com/images/none.png"
  );
  // 음악 옵션 API 호출
  useEffect(() => {
    const fetchMusicOptions = async () => {
      if (USE_MOCK) {
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

  // 음악 선택 후 Chat 페이지로 이동
  const handleSelectMusic = (option) => {
    setSelectedMusic(option);
    // 선택한 음악 정보를 state로 전달하며 Chat 페이지로 이동
    navigate("/chat", { state: { selectedMusicId: option.id } });
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

      <div className={styles.musicSelectPage}>
        <div className={styles.content}>
          {/* 캐릭터 영역 */}
          <div className={styles.characterSection}>
            <h1 className={styles.greeting}>
              아기사자야, 안녕!
              <br />
              오늘 하루는 어땠어?
            </h1>
            <img src={puppetGif} className={styles.characterImage} />
          </div>

          {/* 음악 선택 영역 */}
          <div className={styles.musicSection}>
            <p className={styles.musicPrompt}>오늘의 음악을 골라줘!</p>
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
                  <span className={styles.emoji}>
                    {MUSIC_EMOJI_MAP[option.id] || "🎵"}
                  </span>
                  <span className={styles.musicName}>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 입력창 */}
        <div className={styles.inputBar}>
          <input
            className={styles.input}
            placeholder="메시지 입력"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.sendButton}></button>
        </div>
      </div>
    </div>
  );
}
