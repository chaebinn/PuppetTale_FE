import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

import menu1 from "../assets/menu.svg"; // 아이콘만 있는 버전
import user1 from "../assets/user.svg";
import menu2 from "../assets/menuBtn.svg"; // 동그란 버튼 버전
import user2 from "../assets/userBtn.svg";

function Header({ isTransparent = true, onMenuClick }) {
  const navigate = useNavigate();
  // isTransparent에 따라 아이콘 버전 선택
  const menuIcon = isTransparent ? menu2 : menu1;
  const userIcon = isTransparent ? user2 : user1;

  return (
    <div className={styles.header}>
      {/* 둘 다 투명 */}
      {/* 왼쪽 메뉴 버튼 : 사이드 메뉴 열기*/}
      <button className={styles.iconButton} onClick={onMenuClick}>
        <img src={menuIcon} alt="menu" />
      </button>

      {/* 오른쪽 유저 버튼 */}
      <button className={styles.iconButton} onClick={() => navigate("/mypage")}>
        <img src={userIcon} alt="user" />
      </button>
    </div>
  );
}

export default Header;
