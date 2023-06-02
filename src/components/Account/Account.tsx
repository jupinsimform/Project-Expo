import styles from "./Account.module.css";
import { Camera, LogOut, Edit2, Trash, GitHub, Paperclip } from "react-feather";
import InputControl from "../InputControl/InputControl";
import HomeImage from "../../assets/home-image.png";

function Account() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>Welcome User</p>

        <div className={styles.logout}>
          <LogOut /> Logout
        </div>
      </div>
      <input type="file" style={{ display: "none" }} />
      <div className={styles.section}>
        <div className={styles.title}>Your profile</div>
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={HomeImage} alt="Profile image" />

              <Camera />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <InputControl label="Name" placeholder="Enter your Name" />
              <InputControl
                label="Title"
                placeholder="eg. Full stack developer"
              />
            </div>
            <div className={styles.row}>
              <InputControl
                label="Github"
                placeholder="Enter your github link"
              />
              <InputControl
                label="Linkedin"
                placeholder="Enter your linkedin link"
              />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>error</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
