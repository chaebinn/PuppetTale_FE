import { Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import apiClient from "../../api/client";
//스타일과 img
import styles from "./MyPage.module.css";
import profileImg from "../../assets/puppet.svg";
import profileEdit from "../../assets/profileEdit.svg";
import CtaButton from "../../components/CtaButton";
//컴포넌트
import MyPageOption from "../../components/MyPageOption";
import ModeSelectModal from "../../components/Modal/ModeSelectModal";
import RenamePetModal from "../../components/Modal/RenamePetModal";
import CreateStoryModal from "../../components/Modal/CreateStoryModal";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

export default function MyPage() {
  // 프로필 사진 변경 함수
  const editProfileImg = () => {
    console.log("프로필 이미지 수정 버튼 잘 작동");
  };
  //모달 종류 : 'mode' | 'rename' | 'congrats' | 'delete'
  const [modal, setModal] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //state 추가
  const [myPage, setMyPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMyPage = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/children/3/mypage");
      setMyPage(res.data);
    } catch (err) {
      console.error("마이페이지 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyPage();
  }, []);

  return (
    <div className="app-wrapper">
      {/* 헤더 */}
      <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />

      {/* 사이드 메뉴바 */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.myPageWrapper}>
        {/* 프로필 박스 */}
        <div className={styles.profileBox}>
          <div className={styles.profileImgBox}>
            <img className={styles.profileImg} src={profileImg} />
            <img
              className={styles.profileEditImg}
              src={profileEdit}
              onClick={editProfileImg}
            />
          </div>

          <div className={styles.profileTextBox}>
            {/*데이터 가져온 경우
                <h1>{username}</h1>
                <p>{userAge}・{hospitalDay}</p>
                */}
            <h1>{myPage?.name ?? "아기사자"}</h1>
            <p>
              {myPage?.age}・<span>{myPage?.hospitalizationDays}</span>
            </p>
          </div>
        </div>

        {/* 옵션 선택 박스 */}
        <div className={styles.myPageOptionBox}>
          <MyPageOption type={1} />
          <MyPageOption
            type={2}
            value={myPage?.puppetName}
            onClick={() => setModal("rename")}
          />
          <MyPageOption
            type={3}
            value={myPage?.puppetMode}
            onClick={() => setModal("mode")}
          />
        </div>

        {/* 버튼 박스 */}
        <div className={styles.buttonBox}>
          <CtaButton title="퇴원하기" onClick={() => setModal("congrats")} />
        </div>
      </div>
      {/*모달들*/}

      {/*퍼펫 모드 선택 모달*/}
      <ModeSelectModal
        isOpen={modal === "mode"}
        currentMode={myPage?.puppetMode} // 모달 초기 선택값
        onClose={() => setModal(null)}
        onSuccess={fetchMyPage}
      />

      {/*이름 변경 모달*/}
      <RenamePetModal
        isOpen={modal === "rename"}
        currentName={myPage?.puppetName} // 모달 input 초기값
        onClose={() => setModal(null)}
        onSuccess={() => {
          setModal(null);
          fetchMyPage(); // 수정 후 다시 불러오기
        }}
      />

      {/*퇴원하기 모달*/}
      <CreateStoryModal
        isOpen={modal === "congrats"}
        onClose={() => setModal(null)}
        onLater={() => setModal(null)}
      />
    </div>
  );
}
