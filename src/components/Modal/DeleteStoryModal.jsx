  import BaseModal from "./BaseModal";
import congratulation from '../../assets/congratulation.svg'
import styles from "./CreateStoryModal.module.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function DeleteStoryModal({
  isOpen,
  onCancel,
  onDelete,
}) {
    return (
        <BaseModal
        isOpen={isOpen}
        onClose={onCancel}
        footer={
            <div className={styles.btnBox}>
            <button className={styles.secondaryBtn} onClick={onCancel}>
                <p>취소</p>
            </button>
            <button className={styles.primaryBtn} onClick={onDelete}>
                <p>확인</p>
            </button>
            </div>
        }
        >
        <div className={styles.textBox}>
            <h1>선택한 동화를 삭제하시겠습니까?</h1>
        </div>
        </BaseModal> 
    );
}
