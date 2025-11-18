import React,{useEffect,useState} from "react";
import backIcon from "../../assets/backIcon.svg";
import styles from "./BaseModal.module.css";

//모달 컴포넌트는, 바로 위의 부모 요소가 app-wrapper이 되도록 설정하기 
export default function BaseModal({isOpen, onClose ,title, children, footer}) {

    if(!isOpen) return null; //isOpen이 false면 나감
    


  return (
    /*app-wrapper 중심으로 modal-wrapper이 세로로 가운데 위치*/
    /*modal-wrapper의 width:100%, flex로 modal-wrapper 안의 modal을 정가운데 위치 해두기*/

    <div className={styles.modalWrapper}> 
        <div className={styles.modal}>

            {/*모달 헤더(제목)이 있는 경우에만 표시*/}
            {title &&
            (<div className={styles.modalHeader}>
                <div className={styles.iCon}></div>
                <h1>{title}</h1>
                <img className={styles.iCon} src={backIcon} onClick={onClose}/>
            </div>
            )}

            <div className={styles.modalContentBox}>
                {children}
            </div>

            <div className={styles.modalBtnBox}>
                {footer}
            </div>
        </div>
    </div> 
  );
}
