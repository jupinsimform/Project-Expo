import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, updateUserDatabase } from "../../helpers/db";
import InputControl from "../InputControl/InputControl";
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
          <InputControl
            label="Name"
            placeholder="Enter your name"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        )}
        <InputControl
          label="Email"
          placeholder="Enter your email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <InputControl
          label="Password"
          placeholder="Enter your password"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, password: e.target.value }))
          }
          isPassword
        />

        <p className={styles.error}>{errorMsg}</p>

        <button type="submit" disabled={submitButtonDisabled}>
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
