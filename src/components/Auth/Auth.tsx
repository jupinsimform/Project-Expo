import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { loginUser, signUpUser, resetUser } from "../redux/feature/userSlice";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks";
import { Eye, EyeOff } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

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
  const dispatch = useAppDispatch();
  const initialFormValues: FormValues = {
    name: "",
    email: "",
    password: "",
  };
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(initialFormValues);

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
    if (!values.name || !values.email || !values.password) {
      toast.error("All fields are required!");
      return;
    }
    setSubmitButtonDisable(true);
    dispatch(signUpUser(values))
      .then((data) => {
        if (data.meta.requestStatus == "rejected") {
          throw new Error(data.payload as string);
        }
        setSubmitButtonDisable(false);
        toast.success("Your registration was successful!", {
          position: "top-right",
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisable(false);
        toast.error(err);
      });
  };

  const handleFormReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setValues(initialFormValues);
    }
    dispatch(resetUser());
  };

  const handleLogin = () => {
    if (!values.email || !values.password) {
      toast.error("All fields are required!");
      return;
    }
    setSubmitButtonDisable(true);
    dispatch(loginUser(values))
      .then((data) => {
        if (data.meta.requestStatus == "rejected") {
          throw new Error(data.payload as string);
        }
        setSubmitButtonDisable(false);
        toast.success("Logged in successfully", {
          position: "top-right",
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisable(false);
        toast.error(err);
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
      <form ref={formRef} className={styles.form} onSubmit={handlesubmit}>
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "name")
            }
          />
        )}
        <TextField
          hiddenLabel
          id="outlined-basic-email"
          variant="outlined"
          placeholder="Enter email"
          type="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "password")
          }
        />

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
