import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./FairytaleDetail.module.css";
import CtaButton from "../../components/CtaButton";
import fairytales from "../../assets/fairytales.png";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

import { getFairytaleDetail } from "../../api/fairytale.api";

export default function FairytaleDetail(){
    
    const navigator = useNavigate();
    const {id} = useParams();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 상세 데이터 저장
    const [detail, setDetail] = useState(null);
    const [pages, setPages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 스와이프용
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

        if (dx < 0) goNext();
        else goPrev();
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

    const handlePointerDown = (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        onStart(e.clientX, e.clientY);
    };

    const handlePointerUp = (e) => {
        onEnd(e.clientX, e.clientY);
    };

    //동화 생성 api
    useEffect(() => {
    (async () => {
      try {
        const res = await getFairytaleDetail(id);
        setDetail(res.data);

        const sortedPages = Array.isArray(res.data?.pages)
          ? [...res.data.pages].sort((a, b) => (a?.pageNumber ?? 0) - (b?.pageNumber ?? 0))
          : [];

        setPages(sortedPages);
        setCurrentIndex(0);
      } catch (error) {
        console.error("동화 상세 조회 실패", error);
      }
    })();
    }, [id]);

 
    // 현재 페이지 데이터
    const currentPage = pages[currentIndex] ?? null;
    const currentImageSrc = currentPage?.imageUrl || fairytales;
    const currentText = currentPage?.text || "";

    return (
        <div className={`app-wrapper ${styles.appWrapper}`}>

        {/* 헤더 */}
        <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* 동화 이미지/내용 영역 ()스와이프 연결) */}
        <div
        className={styles.completePageWrapper}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        >
            <img src={currentImageSrc} className={styles.fairytalesImg} alt="동화 이미지" />

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

        {/* 저장하기 버튼, 누르면 /storage로 이동 */}
        <div className={styles.buttonBox}>
        <CtaButton title="보관함으로 돌아가기" onClick={() => navigator("/storage")} />
        </div>
        
        </div>
    );
}
