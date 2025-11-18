import axios from "axios";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModeSelectModal.module.css";

const PUPPET_MODES = [
  { id: "MATURE", emoji: "🙂", label: "성숙한" },
  { id: "AFFECTIONATE", emoji: "🤗", label: "다정한" },
  { id: "ENERGETIC", emoji: "😆", label: "활기찬" },
  { id: "REASSURING", emoji: "💪", label: "든든한" },
];


export default function ModeSelectModal({ isOpen, childId, onClose }) {

    const [initialMode, setInitialMode] = useState(null); //변경 이전 모드
    const [selectedMode, setSelectedMode] = useState(null); //현재 선택 모드


    //모달이 열릴 때마다 로컬스토리지에서 기존 모드 읽어오기 (기존 모드 카드 활성화)
    useEffect(()=>{
        if (!isOpen) return;

        try{
            const prevMode = window.localStorage.getItem("puppetMode");
            if (prevMode) {
                setInitialMode(prevMode);
                setSelectedMode(prevMode); //일단 기존값이 선택된 상태로
            } else {
                //API 연결 전에 임시로 기본 값 AFFECTIONATE
                 const defaultMode = "AFFECTIONATE";
                setInitialMode(defaultMode);
                setSelectedMode(defaultMode);
               // setInitialMode(null);
               // setSelectedMode(null);
            }}
            catch(e){
                console.error("저장된 모드가 없습니다", e);
                setInitialMode(null);
                setSelectedMode(null);    
            }
        }, [isOpen]);

    //모드 변경이 된 경우만 버튼 활성화 (hasChanged가 true면 값이 변경된것임)
    const hasChanged = selectedMode !== null && selectedMode !== initialMode;


    //각 모드 카드 선택 시
    const handleSelect = (modeId) => {setSelectedMode(modeId);}
    

    //'확인'버튼 선택 시 서버로 모드 POST
    const handleSubmit = async ()=>{
        if (!hasChanged || !selectedMode) return;

        try{
            const res = await axios.patch(`/api/children/${childId}/puppet/mode`,
            {puppetMode: selectedMode,}, 
            {headers: {"Content-Type": "application/json",}, } 
            );
            window.localStorage.setItem("puppetMode",selectedMode);

            console.log("퍼펫 모드 변경 성공:", res.data);
        } catch (error) {
            console.error("퍼펫 모드 변경 실패:",error);
        }finally{onClose?.();}
    };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="대화 모드를 골라주세요"
      footer={
        <button className={`${styles.confirmBtn} ${hasChanged ? styles.isActive : ""}`} 
        onClick={handleSubmit} disabled={!hasChanged}>
         <p className={styles.confirmText}>확인</p>
        </button>
      }
    >

      <div className={styles.modeGrid} role="radiogroup" aria-label="대화 모드 선택">
        {PUPPET_MODES.map((mode)=>{
            const isSelected = selectedMode === mode.id;

            return ( 
            <button
              key={mode.id}
              type="button"
              className={`${styles.mode} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => handleSelect(mode.id)}
              role="radio"
              aria-checked={isSelected}
            >
                <span className={styles.emoji}>{mode.emoji}</span>
                <span className={styles.label}>{mode.label}</span>
            </button>
            );
        })}
        </div>
    </BaseModal>
  );
}

