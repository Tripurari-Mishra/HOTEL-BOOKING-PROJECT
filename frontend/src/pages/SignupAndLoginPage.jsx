import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
// 🔥 FIX: Naye responsive standard ke liye Grid standard module use kiya hai
import Grid from "@mui/material/Grid";

import { PersonOutlined } from "@mui/icons-material";
import { EmailOutlined } from "@mui/icons-material";
import { LockOutlined } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import { VisibilityOff } from "@mui/icons-material";
import { AppRegistrationOutlined } from "@mui/icons-material";
import { LoginOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { login, signup } from "../api/Auth";

export const SignUpAndLogin = ({ setCurrUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  // State Management
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form Submit Logic Handler
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (loading) return;

    // Validation
    if (isLoginPage) {
      if (!formData.username || !formData.password) {
        toast.error("Required username or password");
        return;
      }
    } else {
      if (!formData.username || !formData.password || !formData.email) {
        toast.error("Required email, username, and password");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLoginPage) {
        let { username, password } = formData;
        const res = await login(username, password);
        if (!res) {
          setLoading(false);
          toast.error("Server issue");
          return;
        }

        toast.success("User is Logged in successfully");
        setCurrUser(res.user);
        setLoading(false);
        setTimeout(() => navigate(-1), 2000);
        return;
      } else {
        // Signup Page
        const res = await signup(formData);
        if (!res) {
          setLoading(false);
          toast.error("Server issue");
          return;
        }

        toast.success("Welcome! Account created and logged in automatically.");
        setCurrUser(res?.user || { username: formData.username });
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      const errMsg =
        error.response?.data?.message ||
        "Something went wrong! Please try again.";
      toast.error(errMsg);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #fff5f5, #ffffff)",
        py: { xs: 2, sm: 4 }, // Mobile par behtar spacing ke liye dynamic padding
        px: 2,
      }}
    >
      <Container maxWidth="xs" sx={{ p: 0 }}>
        {" "}
        {/* Form layout tight and secure rakhne ke liye maxWidth="xs" */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4, md: 5 }, // Alag-alag screen sizes par automatic adaptive card padding
            borderRadius: 4,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f0f0f0",
            width: "100%",
          }}
        >
          {/* Top Icon & Heading */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                bgcolor: "#FF385C",
                color: "white",
                mb: 2,
                display: "inline-flex",
                boxShadow: "0px 4px 12px rgba(255, 56, 92, 0.3)",
              }}
            >
              {isLoginPage ? (
                <LoginOutlined fontSize="medium" />
              ) : (
                <AppRegistrationOutlined fontSize="medium" />
              )}
            </Box>

            <Typography
              component="h1"
              variant="h5" // Mobile screens par h4 bohot badi lagti hai, variant="h5" + font scale perfect dikhega
              sx={{
                fontWeight: 700,
                color: "#222222",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              {isLoginPage ? "Welcome Back" : "Create Account"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#717171",
                mt: 1,
                textAlign: "center",
                px: { xs: 1, sm: 0 },
              }}
            >
              {isLoginPage
                ? "Enter your credentials to access your account"
                : "Join our community to explore top premium stays"}
            </Typography>
          </Box>

          {/* Form Section */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* 🔥 Responsive Grid System with Size Props */}
            <Grid container spacing={2}>
              {/* Username Field */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="name"
                  placeholder="e.g. ritik_dev"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: "#717171" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>

              {/* Email Field (Only for Signup) */}
              {!isLoginPage && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    placeholder="ritik@example.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: "#717171" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              )}

              {/* Password Field */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#717171" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            {/* Main Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                bgcolor: "#FF385C",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(255, 56, 92, 0.2)",
                "&.Mui-disabled": {
                  bgcolor: "#f5f5f5",
                  color: "#a1a1a1",
                },
                "&:hover": {
                  bgcolor: "#DE1243",
                  boxShadow: "0px 6px 16px rgba(255, 56, 92, 0.3)",
                },
              }}
            >
              {loading ? "Processing..." : isLoginPage ? "Sign In" : "Sign Up"}
            </Button>

            {/* Toggle Link Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#717171",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {isLoginPage
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  onClick={() => {
                    setFormData({ username: "", email: "", password: "" });
                    navigate(isLoginPage ? "/signup" : "/login");
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#FF385C",
                    ml: 0.5,
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      textDecoration: "underline",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {isLoginPage ? "Sign up" : "Log in"}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};