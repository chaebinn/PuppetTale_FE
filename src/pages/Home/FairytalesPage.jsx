import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FairytalesPage.module.css";
import profileImg from "../../assets/puppet.svg";
import CtaButton from "../../components/CtaButton";
import fairytales from "../../assets/fairytales.png";
import Header from "../../components/Header";
import SideMenu from "../../components/SideMenu";

export default function FairytalesPage(){

    const [loading, setLoading]=useState(false);
    const [activeDot, setActiveDot] = useState(0);

    const navigator = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    //랜더링 시에 바로 동화 만들기위한 axios문 포함하기
    const makeFairytales = async ()=> {
        try{ 
            setLoading(true);
            //동화 만들기, 동화 불러오기

            //동화 만들기, 동화 불러오기 성공하면 
        }
        catch(e){
            console.error("동화 생성을 실패했습니다.", e);
        } finally {setLoading(false);}
   }

    useEffect (()=>{
      //api 연결 시, makeFairytales() 함수 호출 활성화 예정 
      //makeFairytales();
      //일단은 시현용 코드 (3초 로딩 true 후, 로딩 false 로직) <-  api 연결 후 삭제 예정!!
      setLoading(true);

      const timer = setTimeout(()=>{
        setLoading(false);
      },3000);

    },[]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3); // 0,1,2 반복
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
        {loading ? (
          <div className={`app-wrapper ${styles.appWrapper}`}>
          {/* 헤더 */}
          <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
            <div className={styles.loadingBox}>
              <img src={profileImg} className={styles.profileImg} alt="프로필 이미지" />
              <div className={styles.loadingDots}>
                {[0, 1, 2].map((idx) => (
                  <span
                    key={idx}
                    className={`${styles.dot} ${activeDot === idx ? styles.activeDot : ""}`}
                  />
                ))}
              </div>
              <h1>잠깐만 기다려줘!</h1>
              <p>그동안의 대화를 바탕으로<br/>동화를 생성중이야. 조금만 기다려줘!</p>
            </div>

          </div>
        ) : (
          <div className={`app-wrapper ${styles.appWrapper}`}>
          {/* 헤더 */}
          <Header isTransparent={true} onMenuClick={() => setIsMenuOpen(true)} />
          <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            {/* 일단 동화 이미지(임의) */}
            <div className={styles.completePageWrapper}>
            <img src={fairytales} className={styles.fairytalesImg}/>
            {/* 동화 내용도 임의 */}
            <p className={styles.fairytalesContent}>
            오늘 꼬마별 루나는 병원에서 주사를 맞았어요.<br/> 눈물이 찔끔 나왔지만, 퍼펫 친구 토리가 손을 꼭 잡아주었죠. “괜찮아, 루나야. 용감했어!”<br/> 그 말을 들은 루나는 웃으며<br/>하늘에 반짝이는 별을 보았답니다.
            </p>
            {/* 저장하기 버튼, 누르면 /storage로 이동*/}
            <div className={styles.buttonBox}>
                <CtaButton title="저장하기" onClick={() => navigator('/storage')}/>
            </div>
            </div>
          </div>
        )}
    </>
  );
}
