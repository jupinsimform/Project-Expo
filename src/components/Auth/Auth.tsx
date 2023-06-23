import { useState, FormEvent, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff, Mail, User, Key } from "react-feather";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { loginUser, signUpUser, resetUser } from "../redux/feature/userSlice";
import { useAppDispatch } from "../redux/hooks";
import { auth } from "../../helpers/db";
import SignUp from "../../assets/signup-image.jpg";
import SignIn from "../../assets/signin-image.jpg";
import styles from "./Auth.module.css";

interface AuthProps {
  signup?: boolean;
}

interface EndAdornmentProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function Auth(props: AuthProps) {
  const isSignup = !!props.signup;
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitButtonDisabled, setSubmitButtonDisable] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const EndAdornment = ({ visible, setVisible }: EndAdornmentProps) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? (
            <Eye className={styles.eyeIcon} />
          ) : (
            <EyeOff className={styles.eyeOffIcon} />
          )}
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
    const confirmPassword = formRef.current.confirmPassword.value;
    const values = {
      name: name,
      email: email,
      password: password,
    };

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    setSubmitButtonDisable(true);
    dispatch(signUpUser(values))
      .then(() => {
        setSubmitButtonDisable(false);
      })
      .catch(() => {
        setSubmitButtonDisable(false);
      });
  };

  const handleFormReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    dispatch(resetUser());
  };

  const handleForgotPassword = () => {
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
        setSubmitButtonDisable(false);
      })
      .catch(() => {
        setSubmitButtonDisable(false);
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
    <div className={styles.main}>
      <div className={styles.container}>
        {!isSignup && (
          <div className={styles.commanImage}>
            <img src={SignIn} alt="" className={styles.formImage} />
          </div>
        )}
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.smallLink}>
            <Link to="/">{"< Back to Home"}</Link>
          </p>
          <div className={styles.heading}>
            {isSignup ? (
              <>
                <div> Create an account</div>
                <p className={styles.subHeading}>
                  Sign Up now and manage your Project.
                </p>
              </>
            ) : (
              <>
                <div> Welcome Back </div>
                <p className={styles.subHeading}>Please enter your details. </p>
              </>
            )}
          </div>

          {isSignup && (
            <TextField
              hiddenLabel
              id="outlined-basic-name"
              variant="outlined"
              placeholder="Enter Name"
              type="text"
              name="name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User fill="#000" className={styles.user} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <TextField
            hiddenLabel
            id="outlined-basic-email"
            variant="outlined"
            placeholder="Enter email"
            type="email"
            name="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail fill="#000" color="#fff" className={styles.mail} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            hiddenLabel
            id="outlined-basic-password"
            placeholder="Enter Password"
            variant="outlined"
            type={passwordVisible ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <EndAdornment
                  visible={passwordVisible}
                  setVisible={setPasswordVisible}
                />
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <Key fill="#000" color="#000" className={styles.key} />
                </InputAdornment>
              ),
            }}
            name="password"
          />
          {isSignup && (
            <TextField
              hiddenLabel
              id="outlined-basic-confirmPassword"
              placeholder="Confirm Password"
              variant="outlined"
              type={confirmPasswordVisible ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <EndAdornment
                    visible={confirmPasswordVisible}
                    setVisible={setConfirmPasswordVisible}
                  />
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Key color="#000" className={styles.key} />
                  </InputAdornment>
                ),
              }}
              name="confirmPassword"
            />
          )}

          <button
            type="submit"
            disabled={submitButtonDisabled}
            className={styles.submitbutton}
          >
            {isSignup ? "Register" : "LogIn"}
          </button>
          {!isSignup && (
            <p onClick={handleForgotPassword} className={styles.resetPassword}>
              Forgot Password?
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
        {isSignup && (
          <div className={styles.commanImage}>
            <img src={SignUp} alt="" className={styles.formImage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
