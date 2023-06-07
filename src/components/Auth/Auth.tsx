import { useState, FormEvent, ChangeEvent } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { auth, updateUserDatabase } from "../../helpers/db";
// import InputControl from "../InputControl/InputControl";
import styles from "./Auth.module.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

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

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisable] = useState(false);
  const [visible, setVisible] = useState(false);

  const EndAdornment = ({ visible, setVisible }: EndAdornmentProps) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </InputAdornment>
    );
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    property: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };

  const handleSignup = () => {
    if (!values?.name || !values.email || !values.password) {
      setErrorMsg("All fields required");
      return;
    }
    setSubmitButtonDisable(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (response) => {
        const userId = response.user.uid;
        await updateUserDatabase(
          { name: values.name, email: values.email },
          userId
        );
        setSubmitButtonDisable(false);
        Toast.fire({
          icon: "success",
          title: "Your registration was successful!",
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisable(false);
        setErrorMsg(err.message);
      });
  };

  const handleLogin = () => {
    if (!values.email || !values.password) {
      setErrorMsg("All fields required");
      return;
    }
    setSubmitButtonDisable(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        setSubmitButtonDisable(false);
        Toast.fire({
          icon: "success",
          title: "Logged in successfully",
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisable(false);
        setErrorMsg(err.message);
      });
  };

  const handlesubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handlesubmit}>
        <p className={styles.smallLink}>
          <Link to="/">{"< Back to Home"}</Link>
        </p>
        <p className={styles.heading}>{isSignup ? "Signup" : "Login"}</p>

        {isSignup && (
          <TextField
            id="outlined-basic-name"
            variant="outlined"
            label="Name"
            type="text"
            required
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "name")
            }
          />
        )}
        <TextField
          id="outlined-basic-email"
          variant="outlined"
          label="Email"
          type="email"
          required
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
        />
        <TextField
          id="outlined-basic-password"
          label="Password"
          type={visible ? "text" : "password"}
          required
          placeholder="Enter your password"
          InputProps={{
            endAdornment: (
              <EndAdornment visible={visible} setVisible={setVisible} />
            ),
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "password")
          }
        />

        <p className={styles.error}>{errorMsg}</p>

        <button
          type="submit"
          disabled={submitButtonDisabled}
          className={styles.submitbutton}
        >
          {isSignup ? "Signup" : "Login"}
        </button>

        <div className={styles.bottom}>
          {isSignup ? (
            <p>
              Already have an account ? <Link to="/login">Login</Link>
            </p>
          ) : (
            <p>
              Don't have an account ? <Link to="/signup">SignUp</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Auth;
