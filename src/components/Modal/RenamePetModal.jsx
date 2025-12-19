import axios from "axios";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./RenamePetModal.module.css";
import profileImg from "../../assets/puppet.svg";
import { usePuppet } from "../../context/PuppetContext";
import apiClient from "../../api/client";

export default function RenamePetModal({
  isOpen,
  onClose,
  currentName,
  onSuccess,
}) {
  const [preName, setPreName] = useState(""); //기존 퍼펫 이름
  const [editedName, setEditedName] = useState(""); //사용자가 새로 입력한 이름
  const { updatePuppetName } = usePuppet();

  //모달이 열릴 때, 로컬스토리지에서 기존의 퍼펫 이름 불러오기(입력 값이랑 기존 이름 달라야 버튼 활성화)
  useEffect(() => {
    if (!isOpen) return;
    const base = currentName || "";
    setPreName(base);
    setEditedName(base); // 열자마자 기존 이름이 input에 들어가게
    // setPreName(window.localStorage.getItem("puppetName") || "아기사자"); //일단 기본값 아기사자
  }, [isOpen, currentName]);

  //입력값과 저장되어있던 퍼펫 이름 비교 후, 다르면 버튼 활성화
  const hasChanged = editedName !== "" && editedName !== preName;

  //'확인' 버튼 누르면 값 path, 로컬 스토리지에도 저장
  const handleSubmit = async () => {
    if (!hasChanged) return;

    try {
      await apiClient.patch(`/api/children/3/puppet/name`, {
        puppetName: editedName.trim(),
      });

      onSuccess?.(); // MyPage 재조회
    } catch (error) {
      console.error("퍼펫 이름 변경 실패:", error);
      // TODO: 토스트/에러 UI
    }
    //  API 연결 시 활성화 코드
    // try{
    //     const res = await axios.patch(`/api/children/${childId}/puppet/name`,
    //     {puppetName: editedName,},
    //     {headers: {"Content-Type": "application/json",}, }
    //     );
    //     updatePuppetName(editedName);

    //     console.log("퍼펫 이름 변경 성공:", res.data);

    // } catch (error) {
    //     console.error("퍼펫 이름 변경 실패:",error);
    // }finally{onClose?.();}

    //시현 영상용 (추후 삭제 예정)
    // updatePuppetName(editedName);
    onClose?.();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="퍼펫 이름 바꾸기"
      onClose={onClose}
      footer={
        <button
          className={`${styles.confirmBtn} ${
            hasChanged ? styles.isActive : ""
          }`}
          onClick={handleSubmit}
          disabled={!hasChanged}
        >
          <p className={styles.confirmText}>확인</p>
        </button>
      }
    >
      <div className={styles.contentBox}>
        <img src={profileImg} className={styles.profileImg} />
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="예: 토리, 뽀로로, 쿠키"
          className={styles.input}
        />
      </div>
    </BaseModal>
  );
}
