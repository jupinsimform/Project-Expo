import styles from "./Home.module.css";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import HomeImage from "../../assets/home-image.svg";
import { Search } from "react-feather";
import { InputBase } from "@mui/material";
import Nodata from "../../assets/nodata.svg";
import { getAllProjects } from "../../helpers/db";
import { ChangeEvent, useEffect, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleNextButtonClick = () => {
    if (isauthenticated) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  const filteredProjects = projects.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.points?.some((point) =>
        point.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  useEffect(() => {
    fetchAllProjects();
  }, []);
  return (
    <div className={styles.container}>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          details={projectDetails}
          isauthenticated={isauthenticated}
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
      <hr />

      <div className={styles.body}>
        <p className={styles.title}>All Projects</p>
        <div className={styles.searchBar}>
          <div className={styles.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            classes={{
              root: styles.inputRoot,
              input: styles.inputInput,
            }}
          />
        </div>
        <div className={styles.projects}>
          {projectsLoaded ? (
            filteredProjects.length > 0 ? (
              filteredProjects.map((item) => (
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
              <img src={Nodata} alt="" className={styles.nodata} />
            )
          ) : (
            <div className="spinner">
              <ClipLoader color="purple" />
            </div>
          )}
        </div>
      </div>
      <div className={styles.background_clip}></div>
    </div>
  );
}

export default Home;
