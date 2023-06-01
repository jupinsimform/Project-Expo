import { useState, ChangeEvent } from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

interface UserData {
  email: string;
  password: string;
}

function Login() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...userData, [name]: value };
    setUserData(updatedData);
  };

  const handleSubmit = () => {};

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
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            id="outlined-required-lemail"
            label="Email"
            type="email"
            defaultValue=""
            fullWidth
            sx={{ my: 1 }}
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-required-lpassword"
            label="Password"
            type="password"
            defaultValue=""
            fullWidth
            sx={{ my: 1 }}
            onChange={handleChange}
          />

          <Button variant="contained" type="submit" fullWidth sx={{ my: 1 }}>
            Login
          </Button>
        </form>
        <Typography variant="h6" color="black" gutterBottom>
          Don't have an account?{" "}
          <Link to="/signup" className="text-decoration-none">
            SignUp
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
