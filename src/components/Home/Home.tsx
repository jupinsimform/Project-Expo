import styles from "./Home.module.css";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import HomeImage from "../../assets/home-image.svg";

function Home() {
  const navigate = useNavigate();

  const handleNextButtonClick = () => {
    navigate("/login");
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading}>Projects Fair</p>
          <p className={styles.subHeading}>
            One stop destination for all software development Projects
          </p>
          <button onClick={handleNextButtonClick}>
            Get Started
            <ArrowRight />{" "}
          </button>
        </div>
        <div className={styles.right}>
          <img src={HomeImage} alt="Projects" />
        </div>
      </div>
    </div>
  );
}

export default Home;
