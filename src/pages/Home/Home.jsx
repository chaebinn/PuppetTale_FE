import styles from "../Home/Home.module.css";
import Header from "../../components/Header";
export default function Home() {
  return (
    <div className="app-wrapper">
      <Header isTransparent={false} />
      <div className={styles.content}>
        <p>Home Page</p>
      </div>
    </div>
  );
}
