import Modal from "../../Modal/Modal";
import styles from "./ProjectForm.module.css";
import { uploadImage } from "../../../helpers/db";
import { addOrUpdateProject } from "../../redux/feature/projectSlice";
import { useAppDispatch } from "../../redux/hooks";
import { toast } from "react-toastify";
import ImagePlaceholder from "../../../assets/image-placeholder.png";
import { useRef, useState, ChangeEvent } from "react";
import { X } from "react-feather";
import { LinearProgress, TextField } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { selectUserDetails } from "../../redux/feature/userSlice";

interface ProjectFormProps {
  isEdit: boolean;
  default: {
    thumbnail?: string;
    title?: string;
    overview?: string;
    github?: string;
    link?: string;
    points?: string[];
    pid?: string;
  };
  onSubmission?: () => void;
  onClose?: () => void;
}

function ProjectForm(props: ProjectFormProps) {
  const { uid } = useAppSelector(selectUserDetails);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = props.isEdit ? true : false;
  const defaults = props.default;

  const [values, setValues] = useState({
    thumbnail: defaults?.thumbnail || "",
    title: defaults?.title || "",
    overview: defaults?.overview || "",
    github: defaults?.github || "",
    link: defaults?.link || "",
    points: defaults?.points || ["", ""],
    likes: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUploadStarted, setImageUploadStarted] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [submitButtonDisabled, setSetSubmitButtonDisabled] = useState(false);

  const handlePointUpdate = (value: string, index: number) => {
    const tempPoints = [...values.points];
    tempPoints[index] = value;
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleAddPoint = () => {
    if (values.points.length > 4) return;
    setValues((prev) => ({ ...prev, points: [...values.points, ""] }));
  };

  const handlePointDelete = (index: number) => {
    const tempPoints = [...values.points];
    tempPoints.splice(index, 1);
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploadStarted(true);
    setErrorMessage("");
    uploadImage(
      file,
      (progress: number) => {
        setImageUploadProgress(progress);
      },
      (url: string) => {
        setImageUploadStarted(false);
        setImageUploadProgress(0);
        setValues((prev) => ({ ...prev, thumbnail: url }));
      },
      (error: string) => {
        setImageUploadStarted(false);
        setErrorMessage(error);
      }
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
    setErrorMessage("");
  };

  const validateForm = (): boolean => {
    const actualPoints = values.points.filter((item) => item.trim());

    let isValid = true;

    if (!values.thumbnail) {
      isValid = false;
      setErrorMessage("photo for project is required");
    } else if (!values.github) {
      isValid = false;
      setErrorMessage("Project's repository link required");
    } else if (!values.title) {
      isValid = false;
      setErrorMessage("Project's Title required");
    } else if (!values.overview) {
      isValid = false;
      setErrorMessage("Project's Overview required");
    } else if (!actualPoints.length) {
      isValid = false;
      setErrorMessage("Description of Project is required");
    } else if (actualPoints.length < 2) {
      isValid = false;
      setErrorMessage("Minimum 2 description points required");
    } else {
      setErrorMessage("");
    }

    return isValid;
  };

  // const handleSubmission = async () => {
  //   if (!validateForm()) return;

  //   setSetSubmitButtonDisabled(true);
  //   if (isEdit)
  //     await updateProjectInDatabase({ ...values, refUser: uid }, defaults.pid!);
  //   else await addProjectInDatabase({ ...values, refUser: uid });
  //   setSetSubmitButtonDisabled(false);
  //   if (props.onSubmission) {
  //     props.onSubmission();
  //     Toast.fire({
  //       icon: "success",
  //       title: "Success! Your project has been added. Keep up the great work👍",
  //     });
  //   }
  //   if (props.onClose) props.onClose();

  //   // Reset form values
  //   setValues({
  //     thumbnail: "",
  //     title: "",
  //     overview: "",
  //     github: "",
  //     link: "",
  //     points: ["", ""],
  //     likes: [],
  //   });
  // };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    setSetSubmitButtonDisabled(true);

    try {
      if (isEdit) {
        await dispatch(
          addOrUpdateProject({ ...values, refUser: uid, pid: defaults.pid })
        );
      } else {
        await dispatch(addOrUpdateProject({ ...values, refUser: uid }));
      }

      setSetSubmitButtonDisabled(false);

      if (props.onSubmission) {
        props.onSubmission();
        if (isEdit) {
          toast.success("Success! Your project has been updated.", {
            autoClose: 2000,
          });
        } else {
          toast.success(
            "Success! Your project has been added. Keep up the great work👍",
            {
              autoClose: 2000,
            }
          );
        }
      }

      if (props.onClose) props.onClose();

      setValues({
        thumbnail: "",
        title: "",
        overview: "",
        github: "",
        link: "",
        points: ["", ""],
        likes: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // Reset form values
    setValues({
      thumbnail: "",
      title: "",
      overview: "",
      github: "",
      link: "",
      points: ["", ""],
      likes: [],
    });

    if (props.onClose) props.onClose();
  };

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className={styles.container}>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img
                src={values.thumbnail ? values.thumbnail : ImagePlaceholder}
                alt="Thumbnail"
                onClick={() => fileInputRef.current?.click()}
              />
              {imageUploadStarted && (
                <p>
                  <LinearProgress
                    variant="determinate"
                    value={imageUploadProgress}
                  />
                </p>
              )}
            </div>

            <TextField
              label="Github"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Project repository link"
              value={values.github}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(event, "github")
              }
            />
            <TextField
              label="Deployed link"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Project Deployed link"
              value={values.link}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(event, "link")
              }
            />
          </div>
          <div className={styles.right}>
            <TextField
              label="Project Title"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Enter project title"
              value={values.title}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(event, "title")
              }
            />
            <TextField
              label="Project Overview"
              variant="outlined"
              type="text"
              size="small"
              placeholder="Project's brief overview"
              value={values.overview}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(event, "overview")
              }
            />

            <div className={styles.description}>
              <div className={styles.top}>
                <p className={styles.title}>Project Description</p>
                <p className={styles.link} onClick={handleAddPoint}>
                  + Add point
                </p>
              </div>
              <div className={styles.inputs}>
                {values.points.map((item, index) => (
                  <div className={styles.input} key={index}>
                    <TextField
                      variant="outlined"
                      type="text"
                      key={index}
                      size="small"
                      placeholder={`keyword ${index + 1}`}
                      value={item}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handlePointUpdate(event.target.value, index)
                      }
                    />
                    {index > 1 && (
                      <X onClick={() => handlePointDelete(index)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className={styles.error}>{errorMessage}</p>
        <div className={styles.footer}>
          <p className={styles.cancel} onClick={handleCancel}>
            Cancel
          </p>
          <button
            className={styles.savebutton}
            onClick={handleSubmission}
            disabled={submitButtonDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectForm;

// import Modal from "../../Modal/Modal";
// import styles from "./ProjectForm.module.css";
// import { uploadImage } from "../../../helpers/db";
// import { addOrUpdateProject } from "../../redux/feature/projectSlice";
// import { useAppDispatch } from "../../redux/hooks";
// import { toast } from "react-toastify";
// import ImagePlaceholder from "../../../assets/image-placeholder.png";
// import { useRef, useState, ChangeEvent } from "react";
// import { X } from "react-feather";
// import { LinearProgress, TextField } from "@mui/material";
// import { useAppSelector } from "../../redux/hooks";
// import { selectUserDetails } from "../../redux/feature/userSlice";

// interface ProjectFormProps {
//   isEdit: boolean;
//   default: {
//     thumbnail?: string;
//     title?: string;
//     overview?: string;
//     github?: string;
//     link?: string;
//     points?: string[];
//     pid?: string;
//   };
//   onSubmission?: () => void;
//   onClose?: () => void;
// }

// function ProjectForm(props: ProjectFormProps) {
//   const { uid } = useAppSelector(selectUserDetails);
//   const dispatch = useAppDispatch();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const isEdit = props.isEdit ? true : false;
//   const defaults = props.default;

//   const valuesRef = useRef({
//     thumbnail: defaults?.thumbnail || "",
//     title: defaults?.title || "",
//     overview: defaults?.overview || "",
//     github: defaults?.github || "",
//     link: defaults?.link || "",
//     points: defaults?.points || ["", ""],
//     likes: [],
//   });

//   const [errorMessage, setErrorMessage] = useState("");
//   const [imageUploadStarted, setImageUploadStarted] = useState(false);
//   const [imageUploadProgress, setImageUploadProgress] = useState(0);
//   const [submitButtonDisabled, setSetSubmitButtonDisabled] = useState(false);

//   const handlePointUpdate = (value: string, index: number) => {
//     const tempPoints = [...valuesRef.current.points];
//     tempPoints[index] = value;
//     valuesRef.current.points = tempPoints;
//   };

//   const handleAddPoint = () => {
//     if (valuesRef.current.points.length > 4) return;
//     valuesRef.current.points = [...valuesRef.current.points, ""];
//   };

//   const handlePointDelete = (index: number) => {
//     const tempPoints = [...valuesRef.current.points];
//     tempPoints.splice(index, 1);
//     valuesRef.current.points = tempPoints;
//   };

//   const handleInputChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     fieldName: string
//   ) => {
//     const value = event.target.value;
//     valuesRef.current = {
//       ...valuesRef.current,
//       [fieldName]: value,
//     };
//   };

//   const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setImageUploadStarted(true);
//     setErrorMessage("");
//     uploadImage(
//       file,
//       (progress: number) => {
//         setImageUploadProgress(progress);
//       },
//       (url: string) => {
//         setImageUploadStarted(false);
//         setImageUploadProgress(0);
//         valuesRef.current.thumbnail = url;
//       },
//       (error: string) => {
//         setImageUploadStarted(false);
//         setErrorMessage(error);
//       }
//     );
//   };

//   const validateForm = (): boolean => {
//     const actualPoints = valuesRef.current.points.filter((item) => item.trim());

//     let isValid = true;

//     if (!valuesRef.current.thumbnail) {
//       isValid = false;
//       setErrorMessage("photo for project is required");
//     } else if (!valuesRef.current.github) {
//       isValid = false;
//       setErrorMessage("Project's repository link required");
//     } else if (!valuesRef.current.title) {
//       isValid = false;
//       setErrorMessage("Project's Title required");
//     } else if (!valuesRef.current.overview) {
//       isValid = false;
//       setErrorMessage("Project's Overview required");
//     } else if (!actualPoints.length) {
//       isValid = false;
//       setErrorMessage("Description of Project is required");
//     } else if (actualPoints.length < 2) {
//       isValid = false;
//       setErrorMessage("Minimum 2 description points required");
//     } else {
//       setErrorMessage("");
//     }

//     return isValid;
//   };

//   const handleSubmission = async () => {
//     if (!validateForm()) return;

//     setSetSubmitButtonDisabled(true);

//     try {
//       if (isEdit) {
//         await dispatch(
//           addOrUpdateProject({
//             ...valuesRef.current,
//             refUser: uid,
//             pid: defaults.pid,
//           })
//         );
//       } else {
//         await dispatch(
//           addOrUpdateProject({ ...valuesRef.current, refUser: uid })
//         );
//       }

//       setSetSubmitButtonDisabled(false);

//       if (props.onSubmission) {
//         props.onSubmission();
//         if (isEdit) {
//           toast.success("Success! Your project has been updated.", {
//             autoClose: 2000,
//           });
//         } else {
//           toast.success(
//             "Success! Your project has been added. Keep up the great work👍",
//             {
//               autoClose: 2000,
//             }
//           );
//         }
//       }

//       if (props.onClose) props.onClose();

//       valuesRef.current = {
//         thumbnail: "",
//         title: "",
//         overview: "",
//         github: "",
//         link: "",
//         points: ["", ""],
//         likes: [],
//       };
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleCancel = () => {
//     // Reset form values
//     valuesRef.current = {
//       thumbnail: "",
//       title: "",
//       overview: "",
//       github: "",
//       link: "",
//       points: ["", ""],
//       likes: [],
//     };

//     if (props.onClose) props.onClose();
//   };

//   return (
//     <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
//       <div className={styles.container}>
//         <input
//           ref={fileInputRef}
//           type="file"
//           style={{ display: "none" }}
//           onChange={handleFileInputChange}
//         />
//         <div className={styles.inner}>
//           <div className={styles.left}>
//             <div className={styles.image}>
//               <img
//                 src={
//                   valuesRef.current.thumbnail
//                     ? valuesRef.current.thumbnail
//                     : ImagePlaceholder
//                 }
//                 alt="Thumbnail"
//                 onClick={() => fileInputRef.current?.click()}
//               />
//               {imageUploadStarted && (
//                 <p>
//                   <LinearProgress
//                     variant="determinate"
//                     value={imageUploadProgress}
//                   />
//                 </p>
//               )}
//             </div>

//             <TextField
//               label="Github"
//               variant="outlined"
//               type="text"
//               size="small"
//               placeholder="Project repository link"
//               value={valuesRef.current.github}
//               onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange(event, "github")
//               }
//             />
//             <TextField
//               label="Deployed link"
//               variant="outlined"
//               type="text"
//               size="small"
//               placeholder="Project Deployed link"
//               value={valuesRef.current.link}
//               onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange(event, "link")
//               }
//             />
//           </div>
//           <div className={styles.right}>
//             <TextField
//               label="Project Title"
//               variant="outlined"
//               type="text"
//               size="small"
//               placeholder="Enter project title"
//               value={valuesRef.current.title}
//               onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange(event, "title")
//               }
//             />
//             <TextField
//               label="Project Overview"
//               variant="outlined"
//               type="text"
//               size="small"
//               placeholder="Project's brief overview"
//               value={valuesRef.current.overview}
//               onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                 handleInputChange(event, "overview")
//               }
//             />

//             <div className={styles.description}>
//               <div className={styles.top}>
//                 <p className={styles.title}>Project Description</p>
//                 <p className={styles.link} onClick={handleAddPoint}>
//                   + Add point
//                 </p>
//               </div>
//               <div className={styles.inputs}>
//                 {valuesRef.current.points.map((item, index) => (
//                   <div className={styles.input} key={index}>
//                     <TextField
//                       variant="outlined"
//                       type="text"
//                       key={index}
//                       size="small"
//                       placeholder={`keyword ${index + 1}`}
//                       value={item}
//                       onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                         handlePointUpdate(event.target.value, index)
//                       }
//                     />
//                     {index > 1 && (
//                       <X onClick={() => handlePointDelete(index)} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         <p className={styles.error}>{errorMessage}</p>
//         <div className={styles.footer}>
//           <p className={styles.cancel} onClick={handleCancel}>
//             Cancel
//           </p>
//           <button
//             className={styles.savebutton}
//             onClick={handleSubmission}
//             disabled={submitButtonDisabled}
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// export default ProjectForm;
