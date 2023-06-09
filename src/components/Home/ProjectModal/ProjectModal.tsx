import { Link } from "react-router-dom";
import { GitHub, Paperclip, Star } from "react-feather";
import { updateProjectInDatabase } from "../../../helpers/db";
import { useState } from "react";
import Modal from "../../Modal/Modal";
import styles from "./ProjectModal.module.css";

interface Project {
  thumbnail?: string;
  title?: string;
  overview?: string;
  github?: string;
  link?: string;
  points?: string[];
  pid?: string;
  starCount?: number;
}

interface ProjectModalProps {
  details: Project;
  onClose?: () => void;
  isauthenticated: boolean;
}

function ProjectModal(props: ProjectModalProps) {
  const { details, isauthenticated } = props;
  const [isStarFilled, setIsStarFilled] = useState(false);

  const toggleStar = async () => {
    setIsStarFilled((prevValue) => {
      const updatedValue = !prevValue;
      const updatedDetails = {
        ...details,
        starCount: updatedValue
          ? (details.starCount || 0) + 1
          : (details.starCount || 0) - 1,
      };
      updateProjectInDatabase(updatedDetails, details.pid!);
      return updatedValue;
    });
  };
  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className={styles.container}>
        <p className={styles.heading}>Project Details</p>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img
                src={
                  details?.thumbnail ||
                  "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                }
                alt="Project thumbnail"
              />
            </div>
            <div className={styles.links}>
              <Link target="_blank" to={`${details.github}`}>
                <GitHub />
              </Link>
              <Link target="_blank" to={`${details.link}`}>
                <Paperclip />
              </Link>
              {isauthenticated ? (
                <Star
                  onClick={toggleStar}
                  fill={isStarFilled ? "yellow" : "none"}
                />
              ) : (
                `${details.starCount} ⭐`
              )}
            </div>
          </div>
          <div className={styles.right}>
            <p className={styles.title}>{details.title}</p>
            <p className={styles.overview}>{details.overview}</p>
            <ul>
              {details.points!.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
export default ProjectModal;
