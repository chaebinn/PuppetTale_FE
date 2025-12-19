import axios from "axios";
import React, { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ModeSelectModal.module.css";
import { usePuppet } from "../../context/PuppetContext";
import apiClient from "../../api/client";

const PUPPET_MODES = [
  { id: "MATURE", emoji: "🙂", label: "성숙한" },
  { id: "AFFECTIONATE", emoji: "🤗", label: "다정한" },
  { id: "ENERGETIC", emoji: "😆", label: "활기찬" },
  { id: "REASSURING", emoji: "💪", label: "든든한" },
];

// currentMode(서버값), onSuccess(수정 후 재조회) 추가
export default function ModeSelectModal({
  isOpen,
  currentMode,
  onClose,
  onSuccess,
}) {
  const [initialMode, setInitialMode] = useState(null); // 변경 이전 모드
  const [selectedMode, setSelectedMode] = useState(null); // 현재 선택 모드
  const { updatePuppetMode } = usePuppet();

  //모달이 열릴 때마다 로컬스토리지에서 기존 모드 읽어오기 (기존 모드 카드 활성화)
  useEffect(() => {
    if (!isOpen) return;
    const baseMode = currentMode || "ENERGETIC";
    setInitialMode(baseMode);
    setSelectedMode(baseMode);
  }, [isOpen]);

  // 모드 변경이 된 경우만 버튼 활성화
  const hasChanged = selectedMode !== null && selectedMode !== initialMode;

  const handleSelect = (modeId) => {
    console.log("선택:", modeId);
    setSelectedMode(modeId);
  };

  // '확인' 버튼 선택 시 서버로 PATCH
  const handleSubmit = async () => {
    if (!hasChanged || !selectedMode) return;

    try {
      await apiClient.patch(`/api/children/3/puppet/mode`, {
        puppetMode: selectedMode,
      });

      // 전역 상태 업데이트(옵션/채팅화면 등에서 즉시 반영)
      updatePuppetMode(selectedMode);
      // ✅ MyPage 최신값 재조회해서 화면에 반영
      onSuccess?.();

      console.log("퍼펫 모드 변경 성공:", selectedMode);
    } catch (error) {
      console.error("퍼펫 모드 변경 실패:", error);
    } finally {
      onClose?.();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="대화 모드를 골라주세요"
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
      <div
        className={styles.modeGrid}
        role="radiogroup"
        aria-label="대화 모드 선택"
      >
        {PUPPET_MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={`${styles.mode} ${isSelected ? styles.selected : ""}`}
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
