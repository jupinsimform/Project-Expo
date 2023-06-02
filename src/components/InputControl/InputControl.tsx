import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

import styles from "./InputControl.module.css";

interface InputControlProps {
  label?: string;
  isPassword?: boolean;
  [key: string]: any;
}

function InputControl({ label, isPassword, ...props }: InputControlProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          type={isPassword ? (isVisible ? "text" : "password") : "text"}
          {...props}
        />
        {isPassword && (
          <div className={styles.icon}>
            {isVisible ? (
              <Eye onClick={() => setIsVisible((prev) => !prev)} />
            ) : (
              <EyeOff onClick={() => setIsVisible((prev) => !prev)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputControl;
