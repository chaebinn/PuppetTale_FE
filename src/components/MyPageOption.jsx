import React, { useEffect, useState } from "react";
import profileImg from "../assets/profile.svg";
import editNameImg from "../assets/editName.svg";
import modeImg from "../assets/mode.svg";
import styles from "./MyPageOption.module.css";
import chevron from "../assets/chevron.svg"

export default function MyPageOption({ type, onClick }) {
  const [src, setSrc] = useState(profileImg); // 기본값
  const [h1,setH1] = useState("내 정보 수정");
  const [p,setP] =useState("이름, 나이, 프로필 변경");

  useEffect(() => {
    switch (type) {
      case 1:
        setSrc(profileImg);
        setH1('내 정보 수정');
        setP('이름, 나이, 프로필 변경');
        break;
      case 2:
        setSrc(editNameImg);
        setH1('퍼펫 이름 바꾸기');
        setP('토리');
        break;
      case 3:
        setSrc(modeImg);
        setH1('대화 모드 변경');
        setP('재미있게 놀기');
        break;
    }
  }, [type]);

  return (
    <div className={styles.mypageOptionWrapper} onClick={onClick}>
      <img src={src} alt="아이콘" />
      <div className={styles.myPageOptionTextBox}>
        <h1>{h1}</h1>
        <p>{p}</p>
      </div>
      <img src={chevron}/>
    </div>
  );
}


