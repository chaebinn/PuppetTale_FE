import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SideMenu.module.css";

function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 이동 + 현재 페이지면 닫기만
  const handleNavigate = (path) => {
    if (location.pathname === path) {
      onClose(); // 이미 같은 페이지 → 이동하지 않고 닫기만
    } else {
      navigate(path); // 다른 페이지 → 이동
      onClose(); // 이동 후 메뉴 닫기
    }
  };
  return (
    <>
      {/* 어두운 배경 (클릭하면 닫힘) */}
      <div
        className={`${styles.dim} ${isOpen ? styles.show : ""}`}
        onClick={onClose}
      />

      {/* 왼쪽에서 슬라이드되는 시트 */}
      <aside className={`${styles.sheet} ${isOpen ? styles.open : ""}`}>
        <div className={styles.headerRow}>
          <div className={styles.logo}></div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.menuList}>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigate("/chat")}
          >
            <span className={styles.chatIcon}></span>
            <span>대화</span>
          </button>

          <button
            className={styles.menuItem}
            onClick={() => handleNavigate("/fairytales")}
          >
            <span className={styles.bookIcon}></span>
            <span>동화관리</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default SideMenu;
