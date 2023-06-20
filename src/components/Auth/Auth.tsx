// import { useState, FormEvent, ChangeEvent, useRef } from "react";
// import { IconButton, InputAdornment, TextField } from "@mui/material";
// import { loginUser, signUpUser, resetUser } from "../redux/feature/userSlice";
// import { toast } from "react-toastify";
// import { useAppDispatch } from "../redux/hooks";
// import { Eye, EyeOff } from "react-feather";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "./Auth.module.css";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../helpers/db";

// interface FormValues {
//   name: string;
//   email: string;
//   password: string;
// }

// interface AuthProps {
//   signup?: boolean;
// }

// interface EndAdornmentProps {
//   visible: boolean;
//   setVisible: React.Dispatch<React.SetStateAction<boolean>>;
// }

// function Auth(props: AuthProps) {
//   const isSignup = !!props.signup;
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const initialFormValues: FormValues = {
//     name: "",
//     email: "",
//     password: "",
//   };
//   const formRef = useRef<HTMLFormElement>(null);
//   const [values, setValues] = useState<FormValues>(initialFormValues);

//   const [submitButtonDisabled, setSubmitButtonDisable] = useState(false);
//   const [visible, setVisible] = useState(false);

//   const EndAdornment = ({ visible, setVisible }: EndAdornmentProps) => {
//     return (
//       <InputAdornment position="end">
//         <IconButton onClick={() => setVisible(!visible)}>
//           {visible ? <Eye /> : <EyeOff />}
//         </IconButton>
//       </InputAdornment>
//     );
//   };

//   const handleInputChange = (
//     event: ChangeEvent<HTMLInputElement>,
//     property: string
//   ) => {
//     setValues((prev) => ({
//       ...prev,
//       [property]: event.target.value,
//     }));
//   };

//   const handleSignup = () => {
//     if (!values.name || !values.email || !values.password) {
//       toast.error("All fields are required!");
//       return;
//     }
//     setSubmitButtonDisable(true);
//     dispatch(signUpUser(values))
//       .then((data) => {
//         if (data.meta.requestStatus == "rejected") {
//           throw new Error(data.payload as string);
//         }
//         setSubmitButtonDisable(false);
//         toast.success("Your registration was successful!", {
//           position: "top-right",
//         });
//         navigate("/");
//       })
//       .catch((err) => {
//         setSubmitButtonDisable(false);
//         toast.error(err.message);
//       });
//   };

//   const handleFormReset = () => {
//     if (formRef.current) {
//       formRef.current.reset();
//       setValues(initialFormValues);
//     }
//     dispatch(resetUser());
//   };

//   const handleForgetPassword = () => {
//     if (!formRef.current) {
//       return;
//     }
//     const email = formRef.current.email.value;
//     if (email) {
//       sendPasswordResetEmail(auth, email).then(() => {
//         alert("Password reset email sent");
//       });
//     } else {
//       alert("first write email");
//     }
//   };

//   const handleLogin = () => {
//     if (!values.email || !values.password) {
//       toast.error("All fields are required!");
//       return;
//     }
//     setSubmitButtonDisable(true);
//     dispatch(loginUser(values))
//       .then((data) => {
//         if (data.meta.requestStatus == "rejected") {
//           throw new Error(data.payload as string);
//         }
//         setSubmitButtonDisable(false);
//         toast.success("Logged in successfully", {
//           position: "top-right",
//         });
//         navigate("/");
//       })
//       .catch((err) => {
//         setSubmitButtonDisable(false);
//         toast.error(err.message);
//       });
//   };

//   const handlesubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (isSignup) {
//       handleSignup();
//     } else {
//       handleLogin();
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form ref={formRef} className={styles.form} onSubmit={handlesubmit}>
//         <p className={styles.smallLink}>
//           <Link to="/">{"< Back to Home"}</Link>
//         </p>
//         <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>

//         {isSignup && (
//           <TextField
//             hiddenLabel
//             id="outlined-basic-name"
//             variant="outlined"
//             placeholder="Enter Name"
//             type="text"
//             name="name"
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               handleInputChange(e, "name")
//             }
//           />
//         )}
//         <TextField
//           hiddenLabel
//           id="outlined-basic-email"
//           variant="outlined"
//           placeholder="Enter email"
//           type="email"
//           name="email"
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             handleInputChange(e, "email")
//           }
//         />
//         <TextField
//           hiddenLabel
//           id="outlined-basic-password"
//           placeholder="Enter Password"
//           variant="outlined"
//           type={visible ? "text" : "password"}
//           name="password"
//           InputProps={{
//             endAdornment: (
//               <EndAdornment visible={visible} setVisible={setVisible} />
//             ),
//           }}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             handleInputChange(e, "password")
//           }
//         />

//         <button
//           type="submit"
//           disabled={submitButtonDisabled}
//           className={styles.submitbutton}
//         >
//           {isSignup ? "Signup" : "Login"}
//         </button>
//         {!isSignup && (
//           <p onClick={handleForgetPassword} className={styles.resetPassword}>
//             Forget Password?
//           </p>
//         )}

//         <div className={styles.bottom}>
//           {isSignup ? (
//             <p>
//               Already have an account ?{" "}
//               <Link to="/login" onClick={handleFormReset}>
//                 Login
//               </Link>
//             </p>
//           ) : (
//             <p>
//               Don't have an account ?{" "}
//               <Link to="/signup" onClick={handleFormReset}>
//                 SignUp
//               </Link>
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Auth;

import { useState, FormEvent, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { loginUser, signUpUser, resetUser } from "../redux/feature/userSlice";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks";
import { Eye, EyeOff } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../helpers/db";

interface AuthProps {
  signup?: boolean;
}

interface EndAdornmentProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function Auth(props: AuthProps) {
  const isSignup = !!props.signup;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitButtonDisabled, setSubmitButtonDisable] = useState(false);
  const [visible, setVisible] = useState(false);

  const EndAdornment = ({ visible, setVisible }: EndAdornmentProps) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <Eye /> : <EyeOff />}
        </IconButton>
      </InputAdornment>
    );
  };

  const handleSignup = () => {
    if (!formRef.current) {
      return;
    }
    const name = (formRef.current.name as unknown as HTMLInputElement).value;
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    const values = {
      name: name,
      email: email,
      password: password,
    };

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setSubmitButtonDisable(true);
    dispatch(signUpUser(values))
      .then((data) => {
        if (data.meta.requestStatus === "rejected") {
          throw new Error(data.payload as string);
        }
        setSubmitButtonDisable(false);
        toast.success("Your registration was successful!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisable(false);
        toast.error(err.message);
      });
  };

  const handleFormReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    dispatch(resetUser());
  };

  const handleForgetPassword = () => {
    if (!formRef.current) {
      return;
    }
    const email = formRef.current.email.value;
    if (email) {
      sendPasswordResetEmail(auth, email).then(() => {
        toast.info("Password reset link sent to your email");
      });
    } else {
      toast.info("Please enter an email");
    }
  };

  const handleLogin = () => {
    if (!formRef.current) {
      return;
    }
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    const values = {
      email,
      password,
    };
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }
    setSubmitButtonDisable(true);
    dispatch(loginUser(values))
      .then(() => {
        // if (data.meta.requestStatus === "rejected") {
        //   throw new Error(data.payload as string);
        // }
        setSubmitButtonDisable(false);
        // toast.success("Logged in successfully", {
        //   position: "top-right",
        //   autoClose: 2000,
        // });

        navigate("/");
      })
      .catch(() => {
        // console.log("abhlo");
        setSubmitButtonDisable(false);
        // toast.error(err.message);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles.container}>
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.smallLink}>
          <Link to="/">{"< Back to Home"}</Link>
        </p>
        <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>

        {isSignup && (
          <TextField
            hiddenLabel
            id="outlined-basic-name"
            variant="outlined"
            placeholder="Enter Name"
            type="text"
            name="name"
          />
        )}
        <TextField
          hiddenLabel
          id="outlined-basic-email"
          variant="outlined"
          placeholder="Enter email"
          type="email"
          name="email"
        />
        <TextField
          hiddenLabel
          id="outlined-basic-password"
          placeholder="Enter Password"
          variant="outlined"
          type={visible ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <EndAdornment visible={visible} setVisible={setVisible} />
            ),
          }}
          name="password"
        />

        <button
          type="submit"
          disabled={submitButtonDisabled}
          className={styles.submitbutton}
        >
          {isSignup ? "Signup" : "Login"}
        </button>
        {!isSignup && (
          <p onClick={handleForgetPassword} className={styles.resetPassword}>
            Forget Password?
          </p>
        )}

        <div className={styles.bottom}>
          {isSignup ? (
            <p>
              Already have an account ?{" "}
              <Link to="/login" onClick={handleFormReset}>
                Login
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account ?{" "}
              <Link to="/signup" onClick={handleFormReset}>
                SignUp
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Auth;
