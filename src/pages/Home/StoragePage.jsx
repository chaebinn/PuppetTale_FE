import React, { useEffect, useState } from 'react';
import axios from "axios"; 


//스타일과 img 
import styles from "./StoragePage.module.css";
import storageEdit from '../../assets/storageEdit.svg';
import editIcon from '../../assets/editIconSmall.svg';
import deleteIcon from '../../assets/delete.svg';
import backIcon from "../../assets/backIcon.svg";
import shelfBase from "../../assets/shelfBase.svg";

//컴포넌트
import DeleteStoryModal from "../../components/Modal/DeleteStoryModal";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";
//더미데이터(임의)
import { fairyDummy } from "../../data/fairyDummy";

//배열을 특정 개수 단위로 잘라주는 함수 (동화 데이터를 3개씩으로 끊어 2차원 배열 만들기 위함)
const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// 동화 보관함 페이지
export default function StoragePage(){

    const [modal, setModal]= useState(null); //모달 상태 설정 ( 'option' || 'rename' || 'delete')
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedFairy, setSelectedFairy] = useState(null); // 어떤 동화인지 저장
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //옵션 모달이 뜨는 위치
    const [optionPos,setOptionPos] = useState({top: 0, left:0});

    const childId = 1; // TODO: 실제 childId는 라우트 params 등에서 가져오기

    // 렌더링 되지마자 실행할 함수/ get으로 동화 목록 가져오기 (일단 더미 데이터로 대체)
    const getFairy = async ()=> {
        //데이터 get
        try{ 
            setLoading(true);
            const res = await axios.get(`/api/children/${childId}/fairytales`);
            setData(res.data.fairyTales);
            console.log("동화 목록 가져오기 성공", res.data);
        }catch(error){
            console.error("동화 목록 가져오기 실패", error);
        } finally{
            setLoading(false);
        }
    }; 

    useEffect(()=>{
        // getFairy(); api 연결 시 해당 코드로 변경 예정

        //아래는 시현용 코드 (추후 지움)
        //로컬 스토리지에 저장된 동화 가져오기
        const saved = localStorage.getItem("fairtTales");
        if (saved) {
            setData(JSON.parse(saved));
            return;
        }
        //없으면 더미 데이터
        setData(fairyDummy.fairyTales);
    },[]);
    
    const fairyArr = chunk(data, 3);

    //frameButton 클릭 시 각 프레임의 옵션 선택 모달 열기
    const handleFrameBtn = (tale, e) => {
        setSelectedFairy(tale);

        const btnRect = e.currentTarget.getBoundingClientRect();
        
        // app-wrapper 요소 가져오기
        const wrapper = document.querySelector(".app-wrapper");  
        if (!wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();

        // app-wrapper 기준 좌표 계산
        const top = btnRect.bottom - wrapperRect.top +2;
        const left = btnRect.right - wrapperRect.left - 58;

        setOptionPos({ top, left });
        setModal("option");
    };
    //'제목 수정' 클릭 시
    const handleRename = () => {
        setModal("rename"); //제목 수정 모달 활성화
    };
    //'동화 삭제' 클릭 시
    const handleDelete = () => {
        setModal("delete"); //동화 삭제 모달 활성화
    };

    //동화 제목 수정, PATCH요청
    const handleSubmitRename = async (newTitle) => {
        if (!selectedFairy) return;
        
        // try-catch-finally API 연결 시 살리기 (일단 주석)
        // try{ 
        //     //API 요청
        //     await axios.patch(
        //         `/api/children/${childId}/fairytales/${selectedFairy.id}`,
        //         {title: newTitle}
        //     );
        //     //프론트 상태 갱신
        //     setData((prev)=>
        //     prev.map((f)=>
        //     f.id === selectedFairy.id? {...f, title:newTitle}: f));

        // }catch(error){
        //     console.error("제목 수정 실패",error);
        //     //일단 모달 닫기
        // }finally{setModal(null);}


        //이 아래는 시연 영상 용 (더미데이터, 로컬 스토리지 활용) : 추후 API 연결 시 삭제 예정
        const updated = data.map((f)=>
        f.id === selectedFairy.id? {...f, title:newTitle}:f);
        setData(updated);

        localStorage.setItem("fairyTales", JSON.stringify(updated));

        setModal(null);
    };

    //동화 삭제 요청, 상태 업데이트
    const handleSubmitDelete = async () => {
        if (!selectedFairy) return;
        // try{
        //     await axios.delete(
        //     `/api/children/${childId}/fairytales/${selectedFairy.id}`
        //     );

        //     setData((prev)=> prev.filter((f)=>f.id!==selectedFairy.id));
        // }catch(error){
        //     console.error("동화 삭제 실패",error);
        //     //일단 모달 닫기
        // }finally{setModal(null);}

        //이 아래는 시연 영상 용: 추후 API 연결 시 삭제 예정
        const updated = data.filter((f)=> f.id!==selectedFairy.id);
        setData(updated);

        localStorage.setItem("fairyTales", JSON.stringify(updated));
        setModal(null);
    };



    return(
        <div className={`${styles.appWrapper} app-wrapper`}>
         {/* 헤더 컴포넌트 */}
         <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />

        {/* 사이드 메뉴바 */}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        {/* 동화 리스트 (+선반) */}
        <div>
            {loading && <p className={styles.loading}>불러오는 중....</p>}
            <div className={styles.fairySection}>
            {fairyArr.map((row, rowIndex)=>(
                <div key={rowIndex} className={styles.framesRowWrapper}>
                    {/* 동화 열 (세 개씩 묶은 덩어리) */}
                    <div className={styles.framesRow}>
                        {row.map((tale) => (
                            // 개별 프레임
                            <div  key={tale.id} className={styles.frameWrapper}>
                            <div className={styles.fairyFrame}>
                                {/* 수정 버튼 */}
                                <button type="button" 
                                className={styles.frameButton} onClick={(e)=> handleFrameBtn(tale,e)}>
                                    <img src={storageEdit}/>
                                </button>
                                {/* 프레임 배경(동화 이미지) */}
                                <div className={styles.thumbnail}
                                style={{backgroundImage:`url(${tale.thumbnailUrl})`}}/>
                            </div>
                            {/* 제목 */}
                            <p className={styles.fairyTitle}>{tale.title}</p>
                            </div>
                        ))}
                    </div>
                    {/* 선반 */}
                    <img src={shelfBase} className={styles.shelfBase}/>
                    
                </div>
            ))}
            </div>

        </div>
        
        {/* 옵션 선택 모달 */}
        <FrameOptionModal
        isOpen={modal==="option"}
        onClose={()=>setModal(null)}
        onEditTitle={handleRename}
        onDelete={handleDelete}
        pos={optionPos}
        />
        {/* 제목 수정 모달 */}
        <EditTitleModal
        isOpen={modal === "rename"}
        initialTitle={selectedFairy?.title || ""}
        onClose={() => setModal(null)}
        onSubmit={handleSubmitRename}
        />
        {/* 동화 삭제 모달 */}
        <DeleteStoryModal
        isOpen={modal === "delete"}
        onCancel={()=>setModal(null)}
        onDelete={handleSubmitDelete}/>
        </div>
    );
}

// 옵션 선택 모달
function FrameOptionModal({isOpen, onClose, onEditTitle, onDelete, pos}){
    if (!isOpen) return null;

    return(
        <div className={styles.optionsWrapper} onClick={onClose}>
            <div className={styles.optionBox} onClick={(e)=>e.stopPropagation()}
                style={{position:"absolute", top:pos.top,left: pos.left}}>
                <button type="button" className={styles.optionItem} onClick={onEditTitle}>
                    <img src={editIcon}/>
                    <p>제목 수정</p>
                </button>
                <button type="button" className={styles.optionItem} onClick={onDelete}>
                    <img src={deleteIcon}/>
                    <p>동화 삭제</p>
                </button>
            </div>
        </div>
    );
};

// 제목 수정 모달 
function EditTitleModal ({isOpen, initialTitle, onClose, onSubmit}){
    const [value, setValue] = useState(initialTitle);

    useEffect(()=>{
        setValue(initialTitle);
    },[initialTitle]);

    if(!isOpen) return null;

    const handleSubmit = () => {
        if (!value.trim()) return;
        onSubmit(value.trim());
    };

    const length = value.length;
    const hasChanged = value.trim().length > 0;


    return(
        // 백드롭
        <div className={styles.bottomBackdrop} onClick={onClose}>
            {/* 입력 창 백드롭 영역에서 제외 */}
            <div className={styles.bottomSheet}
            onClick={(e)=> e.stopPropagation()}>
                {/* 모달 헤더 */}
                <div className={styles.EditTitleModalHeader}>
                    <div className={styles.Icon}/>
                    <h1>제목 수정</h1>
                    <img src={backIcon} className={styles.backIcon} onClick={onClose}/>
                </div>
                {/* 모달 내용 */}
                <div className={styles.EditTitleModalContent}>
                    <p>나만의 제목을 만들어 볼까요?</p>
                    <div className={styles.inputWrapper}>
                        <input className={styles.titleInput} type="text" maxLength={50} 
                        value={value} onChange={(e)=> setValue(e.target.value)}/>
                        <span className={styles.charCount}>
                            {length}/50
                        </span>
                    </div>
                </div>

                <button className={`${styles.confirmBtn} ${hasChanged ? styles.isActive : ""}`} 
                onClick={handleSubmit} disabled={!hasChanged}>
                    <p className={styles.confirmText}>수정하기</p>
                </button>

                
            </div>
        </div>
    )
     
}