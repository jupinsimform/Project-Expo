import styles from "./Home.module.css";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import HomeImage from "../../assets/home-image.png";

interface HomeProps {
  authenticate?: boolean;
}
function Home(props: HomeProps) {
  const navigate = useNavigate();
  const isauthenticated = props.authenticate ? true : false;

  const handleNextButtonClick = () => {
    if (isauthenticated) {
      navigate("/account");
    } else {
      navigate("/login");
    }
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
            {isauthenticated ? "Manage your Projects" : "Get Started"}
            <ArrowRight />
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
