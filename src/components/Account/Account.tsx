import { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";
import { Camera, LogOut, Edit2, Trash, Paperclip, GitHub } from "react-feather";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { Navigate, Link } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { signOut } from "firebase/auth";
import { LinearProgress, TextField } from "@mui/material";
import ProjectForm from "./ProjectForm/ProjectForm";
import {
  auth,
  uploadImage,
  getAllProjectsForUser,
  deleteProject,
} from "../../helpers/db";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  logout,
  updateUserDetails,
  selectAuthenticate,
  selectUserDetails,
  selectLoading,
} from "../redux/feature/userSlice";
import Nodata from "../../assets/nodata.svg";
import "react-confirm-alert/src/react-confirm-alert.css";
import styles from "./Account.module.css";

interface Project {
  thumbnail?: string;
  title?: string;
  overview?: string;
  github?: string;
  link?: string;
  points?: string[];
  pid?: string;
}

type AccountProps = {
  timeoutId: NodeJS.Timeout | null;
};

function Account({ timeoutId }: AccountProps) {
  const userDetails = useAppSelector(selectUserDetails);
  const authenticate = useAppSelector(selectAuthenticate);
  const loading = useAppSelector(selectLoading);

  const imagePicker = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

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
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    await signOut(auth);
    dispatch(logout());
  };

  const handleCameraClick = () => {
    if (imagePicker.current) {
      (imagePicker.current as HTMLInputElement).click();
    }
  };

  const updateProfileImageToDatabase = (url: string) => {
    const updatedUserProfile = {
      ...userProfileValues,
      email: userDetails.email,
      uid: userDetails.uid,
      profileImage: url,
    };

    dispatch(
      updateUserDetails({ user: updatedUserProfile, uid: userDetails.uid! })
    );
    setUserProfileValues((prev) => ({
      ...prev,
      profileImage: url,
    }));
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

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, property: string) => {
      setShowSaveDetailsButton(true);

      setUserProfileValues((prev) => ({
        ...prev,
        [property]: event.target.value,
      }));
    },
    []
  );

  const saveDetailsToDatabase = () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    const updatedUserProfile = {
      ...userProfileValues,
      email: userDetails.email,
      profileImage:
        userDetails.profileImage ||
        "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg",
      uid: userDetails.uid,
    };

    dispatch(
      updateUserDetails({
        user: updatedUserProfile,
        uid: userDetails.uid!,
      })
    );
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
    setErrorMessage("");
  };

  const handleAddProject = () => {
    setEditProject({}); // Reset the editProject state variable
    setShowProjectForm(true);
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid!);
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
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to delete this project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await deleteProject(pid);
            fetchAllProjects();
            toast.success('Deleted!", "Your Project has been deleted.');
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  useEffect(() => {
    if (userDetails.uid) {
      setUserProfileValues((prev) => ({
        ...prev,
        name: userDetails.name || "",
        designation: userDetails.designation || "",
        github: userDetails.github || "",
        linkedin: userDetails.linkedin || "",
      }));
      setProfileImageUrl(
        userDetails.profileImage! ||
          "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg"
      );
      fetchAllProjects();
    }
  }, [userDetails.uid]);

  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color="#63b2ff" />
      </div>
    );
  }

  return authenticate && userDetails.uid ? (
    <div className={styles.container}>
      {showProjectForm && (
        <ProjectForm
          onSubmission={fetchAllProjects}
          onClose={() => setShowProjectForm(false)}
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
          <button className={styles.savebutton} onClick={handleAddProject}>
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
              <PuffLoader color="#63b2ff" />
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
