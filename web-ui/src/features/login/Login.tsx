import {
  Grid,
  Paper,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useAxios } from "../../app-providers/AxiosProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const paperStyle = {
    padding: 20,
    width: "30vw",
  };
  const btnstyle = { margin: "8px 0" };
  const axios = useAxios();
  const [loginError, setLoginError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    control,
    formState: { isValid },
    getValues,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = () => {
    const formValue = getValues();
    setLoading(true);
    axios
      .post("/login", formValue)
      .then(({ data }) => {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      })
      .catch(() => {
        setLoginError(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Grid
      display="flex"
      height="100vh"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper elevation={10} style={paperStyle}>
        <Typography textAlign="center" variant="h5" mb={4} color="primary">
          Provider Management Platform
        </Typography>
        <Grid component="div" textAlign="center">
          <h2>Sign In</h2>
        </Grid>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({
            field: { onChange, value },
            fieldState: { error },
          }) => (
            <TextField
              helperText={error ? error.message : null}
              error={!!error}
              sx={{ mb: 4 }}
              required
              onChange={onChange}
              value={value}
              fullWidth
              label="Username"
              variant="outlined"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({
            field: { onChange, value },
            fieldState: { error }
          }) => (
            <TextField
              helperText={error ? error.message : null}
              error={!!error}
              sx={{ mb: 4 }}
              required
              type="password"
              onChange={onChange}
              value={value}
              fullWidth
              label="Password"
              variant="outlined"
            />
          )}
        />
        <LoadingButton
          sx={{ mb: 4 }}
          disabled={!isValid}
          color="primary"
          loading={loading}
          variant="contained"
          style={btnstyle}
          onClick={handleLogin}
          fullWidth
        >
          Sign in
        </LoadingButton>
        <Typography mb={2}>
          {" "}
          Do you have an account ?{" "}
          <Link href="https://codexauthv2.onrender.com/register/" target="_blank">Sign Up</Link>
        </Typography>

        {loginError && (
          <Alert severity="error">Invalid Username or Password</Alert>
        )}
      </Paper>
    </Grid>
  );
};

export default Login;
