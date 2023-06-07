import styles from "./Home.module.css";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import HomeImage from "../../assets/home-image.svg";
import { getAllProjects } from "../../helpers/db";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ProjectModal from "./ProjectModal/ProjectModal";

interface Project {
  thumbnail?: string;
  title?: string;
  overview?: string;
  github?: string;
  link?: string;
  points?: string[];
  pid?: string;
}
interface HomeProps {
  authenticate?: boolean;
}
function Home(props: HomeProps) {
  const navigate = useNavigate();
  const isauthenticated = props.authenticate ? true : false;
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState<Project | {}>({});

  const handleNextButtonClick = () => {
    if (isauthenticated) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjects();
    setProjectsLoaded(true);
    if (!result) {
      return;
    }

    const tempProjects: Project[] = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));

    setProjects(tempProjects);
  };

  const handleProjectCardClick = (project: Project) => {
    setShowProjectModal(true);
    setProjectDetails(project);
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);
  return (
    <div className={styles.container}>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          details={projectDetails}
        />
      )}
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading}>Projects Expo</p>
          <p className={styles.subHeading}>
            A centralized platform for software development projects.
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

      <div className={styles.body}>
        <p className={styles.title}>All Projects</p>
        <div className={styles.projects}>
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item) => (
                <div
                  className={styles.project}
                  key={item.pid}
                  onClick={() => handleProjectCardClick(item)}
                >
                  <div className={styles.image}>
                    <img
                      src={
                        item.thumbnail ||
                        "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"
                      }
                      alt="Project thumbnail"
                    />
                  </div>
                  <p className={styles.title}>{item.title}</p>
                </div>
              ))
            ) : (
              <p>No projects found</p>
            )
          ) : (
            <div className="spinner">
              <ClipLoader color="purple" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
