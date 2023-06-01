import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  Container,
} from "@mui/material";
import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...userData, [name]: value };
    setUserData(updatedData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData.password === userData.confirmpassword) {
      alert("Registered Successfully");
    } else {
      alert("Password must match");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Typography variant="h6" gutterBottom className="w-100">
        <Link
          to="/"
          className="text-decoration-none text-white text-start ps-4"
        >
          {"<"} Back to home
        </Link>
      </Typography>
      <Box
        sx={{
          background: "white",
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Typography
          variant="h2"
          color="primary"
          gutterBottom
          sx={{
            textAlign: "center",
          }}
        >
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            id="outlined-required-name"
            label="Name"
            defaultValue=""
            fullWidth
            name="name"
            sx={{ my: 1 }}
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-required-email"
            label="Email"
            type="email"
            defaultValue=""
            fullWidth
            name="email"
            sx={{ my: 1 }}
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-required-password"
            label="Password"
            type="password"
            defaultValue=""
            name="password"
            fullWidth
            sx={{ my: 1 }}
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-required-confirmpassword"
            label="Confirm Password"
            type="password"
            defaultValue=""
            fullWidth
            name="confirmpassword"
            sx={{ my: 1 }}
            onChange={handleChange}
          />
          <Box sx={{ textAlign: "left", my: 1 }}>
            <Checkbox {...label} />
            <Typography variant="caption" color="black" gutterBottom>
              Accept Terms and Conditions
            </Typography>
          </Box>

          <Button variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
            Register
          </Button>
        </form>
        <Typography variant="h6" color="black" gutterBottom>
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            SignIn
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignUp;
