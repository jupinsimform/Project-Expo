import styles from "./Account.module.css";
import { Camera, LogOut, Edit2, Trash, Paperclip, GitHub } from "react-feather";
import Nodata from "../../assets/nodata.svg";
import Swal from "sweetalert2";
import { LinearProgress, TextField } from "@mui/material";
import ProjectForm from "./ProjectForm/ProjectForm";
import { Navigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { signOut } from "firebase/auth";
import {
  auth,
  updateUserDatabase,
  uploadImage,
  getAllProjectsForUser,
  deleteProject,
} from "../../helpers/db";
import { useState, useRef, ChangeEvent, useEffect } from "react";

interface Project {
  thumbnail?: string;
  title?: string;
  overview?: string;
  github?: string;
  link?: string;
  points?: string[];
  pid?: string;
}

interface UserDetails {
  profileImage?: string;
  name?: string;
  designation?: string;
  github?: string;
  linkedin?: string;
  uid: string;
}

interface AccountProps {
  userDetails: UserDetails;
  authenticate: boolean;
}

function Account(props: AccountProps) {
  const { userDetails, authenticate } = props;
  const imagePicker = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState(
    userDetails.profileImage ||
      "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg"
  );
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);

  const [userProfileValues, setUserProfileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkedin || "",
  });

  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditProjectModal, setIsEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | {}>({});

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCameraClick = () => {
    if (imagePicker.current) {
      (imagePicker.current as HTMLInputElement).click();
    }
  };

  const updateProfileImageToDatabase = async (url: string) => {
    await updateUserDatabase(
      { ...userProfileValues, profileImage: url },
      userDetails.uid
    );
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress: number) => {
        setProgress(progress);
      },
      (url: string) => {
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err: string) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(false);
      }
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    setShowSaveDetailsButton(true);

    setUserProfileValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };

  const saveDetailsToDatabase = async () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    await updateUserDatabase({ ...userProfileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid);
    if (!result) {
      setProjectsLoaded(true);
      return;
    }
    setProjectsLoaded(true);

    let tempProjects: Project[] = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));
    setProjects(tempProjects);
  };

  const handleEditClick = (project: Project) => {
    setIsEditProjectModal(true);
    setEditProject(project);
    setShowProjectForm(true);
  };

  const handleDeletion = (pid: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your Project has been deleted.", "success");
        await deleteProject(pid);
      }
      fetchAllProjects();
    });
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return authenticate ? (
    <div className={styles.container}>
      {showProjectForm && (
        <ProjectForm
          onSubmission={fetchAllProjects}
          onClose={() => setShowProjectForm(false)}
          uid={userDetails.uid}
          isEdit={isEditProjectModal}
          default={editProject}
        />
      )}
      <div className={styles.header}>
        <p className={styles.heading}>
          <span>Welcome {userProfileValues.name}</span>
        </p>

        <div className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </div>
      </div>
      <input
        type="file"
        ref={imagePicker}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className={styles.section}>
        <div className={styles.title}>Your profile</div>
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={profileImageUrl} alt="Profile image" />
              <div className={styles.camera} onClick={handleCameraClick}>
                <Camera />
              </div>
            </div>
            {profileImageUploadStarted ? (
              <p className={styles.progress}>
                <LinearProgress
                  color="success"
                  variant="determinate"
                  value={progress}
                />
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <TextField
                id="outlined-basic-Aname"
                label="Name"
                type="text"
                variant="outlined"
                size="small"
                value={userProfileValues.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "name")
                }
              />
              <TextField
                id="outlined-basic-role"
                label="Role"
                type="text"
                variant="outlined"
                size="small"
                placeholder="eg. Full stack developer"
                value={userProfileValues.designation}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "designation")
                }
              />
            </div>
            <div className={styles.row}>
              <TextField
                id="outlined-basic-github"
                label="Github"
                type="text"
                variant="outlined"
                size="small"
                placeholder="Enter your github link"
                value={userProfileValues.github}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "github")
                }
              />
              <TextField
                id="outlined-basic-Linkedin"
                label="Linkedin"
                type="text"
                variant="outlined"
                size="small"
                placeholder="Enter your linkedin link"
                value={userProfileValues.linkedin}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "linkedin")
                }
              />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton && (
                <button
                  disabled={saveButtonDisabled}
                  className={styles.savebutton}
                  onClick={saveDetailsToDatabase}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className={styles.section}>
        <div className={styles.projectsHeader}>
          <div className={styles.title}>Your Projects</div>
          <button
            className={styles.savebutton}
            onClick={() => setShowProjectForm(true)}
          >
            Add Project
          </button>
        </div>

        <div className={styles.projects}>
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item, index) => (
                <div className={styles.project} key={item.title ?? +index}>
                  <p className={styles.title}>{item.title}</p>

                  <div className={styles.links}>
                    <Edit2 onClick={() => handleEditClick(item)} />
                    <Trash onClick={() => handleDeletion(item.pid!)} />
                    <Link target="_blank" to={`${item.github}`}>
                      <GitHub />
                    </Link>
                    {item.link ? (
                      <Link target="_blank" to={`${item.link}`}>
                        <Paperclip />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
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
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Account;
