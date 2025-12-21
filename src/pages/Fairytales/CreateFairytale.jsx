import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { createFairytale } from "../../api/fairytale.api";
import { getMyPage } from "../../api/mypage.api";

import styles from "./CreateFairytale.module.css";
import profileImg from "../../assets/puppet.svg";
import CtaButton from "../../components/CtaButton";
import fairytales from "../../assets/fairytales.png";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

export default function CreateFairytale() {
  const [pages, setPages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDot, setActiveDot] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigator = useNavigate();

  //랜더링 시에 바로 (마이페이지 조회 후 ->)동화 생성하기
  useEffect(() => {
    const makeFairytales = async () => {
      try {
        setLoading(true);

        // 1 마이페이지 조회
        const myRes = await getMyPage();
        const my = myRes.data;

        const userAge =
          Number(String(my?.age ?? "").replace(/[^0-9]/g, "")) || 0;

        // 3) create 요청 바디 구성 (mypage 응답값 활용)
        const payload = {
          sessionId: "test_user_001",
          childId: 3,
          userName: my?.name ?? "아기사자",
          userAge,
          puppetName: my?.puppetName ?? "토리",
        };

        // 4) 동화 생성
        const res = await createFairytale(payload);
        const data = res?.data ?? res;

        // pages 정렬
        const sortedPages = Array.isArray(data?.pages)
          ? [...data.pages].sort(
              (a, b) => (a?.pageNumber ?? 0) - (b?.pageNumber ?? 0)
            )
          : [];

        setPages(sortedPages);
        setCurrentIndex(0);

        // 생성된 동화 id 저장(선택)
        if (data?.fairyTaleId) {
          sessionStorage.setItem("latestFairyTaleId", data.fairyTaleId);
        }
      } catch (err) {
        console.error(err);
        setError("동화 생성 중 문제가 발생했어요.");
      } finally {
        setLoading(false);
      }
    };

    makeFairytales();
  }, []);

  //로딩중
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3); // 0,1,2 반복
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  //스와이프(페이지 넘김)
  const startRef = useRef({ x: null, y: null });
  const SWIPE_THRESHOLD = 50;
  const RESTRAINT_Y = 70;

  const clampIndex = (next) => {
    const max = Math.max(pages.length - 1, 0);
    return Math.min(Math.max(next, 0), max);
  };

  const goNext = () => setCurrentIndex((prev) => clampIndex(prev + 1));
  const goPrev = () => setCurrentIndex((prev) => clampIndex(prev - 1));

  const onStart = (x, y) => {
    startRef.current = { x, y };
  };

  const onEnd = (x, y) => {
    const { x: startX, y: startY } = startRef.current;
    startRef.current = { x: null, y: null };
    if (startX == null || startY == null) return;

    const dx = x - startX;
    const dy = y - startY;

    if (Math.abs(dy) > RESTRAINT_Y) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0) goNext(); // 왼쪽 스와이프 -> 다음
    else goPrev(); // 오른쪽 스와이프 -> 이전
  };

  const handleTouchStart = (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    onStart(t.clientX, t.clientY);
  };

  const handleTouchEnd = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;
    onEnd(t.clientX, t.clientY);
  };

  // 마우스 드래그도 되게(pointer)
  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    onStart(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    onEnd(e.clientX, e.clientY);
  };

  const currentPage = pages[currentIndex] ?? null;
  const currentImageSrc = currentPage?.imageUrl || fairytales;
  const currentText = currentPage?.text || "";

  return (
    <>
      {loading ? (
        <div className={`app-wrapper ${styles.appWrapper}`}>
          {/* 헤더 */}
          <Header
            isTransparent={true}
            onMenuClick={() => setIsMenuOpen(true)}
          />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          <div className={styles.loadingBox}>
            <img
              src={profileImg}
              className={styles.profileImg}
              alt="프로필 이미지"
            />
            <div className={styles.loadingDots}>
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${
                    activeDot === idx ? styles.activeDot : ""
                  }`}
                />
              ))}
            </div>
            <h1>잠깐만 기다려줘!</h1>
            <p>
              그동안의 대화를 바탕으로
              <br />
              동화를 생성중이야. 조금만 기다려줘!
            </p>
          </div>
        </div>
      ) : (
        <div className={`app-wrapper ${styles.appWrapper}`}>
          {/* 헤더 */}
          <Header
            isTransparent={true}
            onMenuClick={() => setIsMenuOpen(true)}
          />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          {/* 스와이프 영역: 이미지 + 텍스트 */}
          <div
            className={styles.completePageWrapper}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <img
              src={currentImageSrc}
              className={styles.fairytalesImg}
              alt="동화 이미지"
            />

            <p className={styles.fairytalesContent}>
              {currentText
                ? currentText.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : "동화 내용을 불러오는 중이야..."}
            </p>
          </div>

          {/* 저장하기 버튼, 누르면 /storage로 이동*/}
          <div className={styles.buttonBox}>
            <CtaButton title="저장하기" onClick={() => navigator("/storage")} />
          </div>
        </div>
      )}
    </>
  );
}
