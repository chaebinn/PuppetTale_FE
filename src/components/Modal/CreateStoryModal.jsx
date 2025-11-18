import BaseModal from "./BaseModal";
import congratulation from '../../assets/congratulation.svg'
import styles from "./CreateStoryModal.module.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function CreateStoryModal({
  isOpen,
  onClose,
  onLater,
}) {
    const navigator = useNavigate();

    const onCreateStory = ()=>{ onClose?.(); navigator('/fairytales');}

    return (
        <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        footer={
            <div className={styles.btnBox}>
            <button className={styles.secondaryBtn} onClick={onLater}>
                <p>아직이에요</p>
            </button>
            <button className={styles.primaryBtn} onClick={onCreateStory}>
                <p>동화 만들기</p>
            </button>
            </div>
        }
        >
        <div className={styles.textBox}>
            <img src={congratulation} className={styles.icon}/>
            <h1>퇴원을 축하해요!</h1>
            <p>지금까지 퍼펫과 나눈<br/>소중한 이야기를 담아<br/><span>특별한 동화책</span>을 만들어 줄게!</p>
        </div>
        </BaseModal>
    );
}
