import axios from "axios";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModeSelectModal.module.css";
import { usePuppet } from "../../context/PuppetContext"; 

const PUPPET_MODES = [
  { id: "MATURE", emoji: "🙂", label: "성숙한" },
  { id: "AFFECTIONATE", emoji: "🤗", label: "다정한" },
  { id: "ENERGETIC", emoji: "😆", label: "활기찬" },
  { id: "REASSURING", emoji: "💪", label: "든든한" },
];


export default function ModeSelectModal({ isOpen, childId, onClose }) {

    const [initialMode, setInitialMode] = useState(null); //변경 이전 모드
    const [selectedMode, setSelectedMode] = useState(null); //현재 선택 모드

    const { updatePuppetMode } = usePuppet();

    //모달이 열릴 때마다 로컬스토리지에서 기존 모드 읽어오기 (기존 모드 카드 활성화)
    useEffect(()=>{
        if (!isOpen) return;

        try{
            const prevMode = window.localStorage.getItem("puppetMode");
            if (prevMode) {
                setInitialMode(prevMode);
                setSelectedMode(prevMode); //일단 기존값이 선택된 상태로
            } else {
                //로컬스토리지에 저장된 모드가 없으면 일단 모두 null 값으로 설정
                // setInitialMode(null);
                // setSelectedMode(null);

                //API 연결 전에 임시로 기본 값 ENERGETIC (추후 지울 예정, 근데 서버 초입에 기본 값이 정해져있는 플로우면 이걸로 유지할 생각)
                const defaultMode = "ENERGETIC";
                setInitialMode(defaultMode);
                setSelectedMode(defaultMode);
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
        //API 연결 시, 아래 코드 활성화 
        // try{
        //     const res = await axios.patch(`/api/children/${childId}/puppet/mode`,
        //     {puppetMode: selectedMode,}, 
        //     {headers: {"Content-Type": "application/json",}, } 
        //     );
        //     updatePuppetMode(selectedMode);

        //     console.log("퍼펫 모드 변경 성공:", res.data);
        // } catch (error) {
        //     console.error("퍼펫 모드 변경 실패:",error);
        // }finally{onClose?.();}

        //일단은 로컬스토리지로만 (API 연결 시 아래 코드는 지울 예정)
        updatePuppetMode(selectedMode);
        onClose?.();

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

