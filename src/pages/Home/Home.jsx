import styles from "../Home/Home.module.css";
import { useState } from "react";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="app-wrapper">
      <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />

      {/* 슬라이드 메뉴 */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className={styles.content}>
        <p>Home Page</p>
      </div>
    </div>
  );
}
