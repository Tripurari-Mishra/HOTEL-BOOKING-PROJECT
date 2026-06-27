import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore"; // Logo Icon
import SearchIcon from "@mui/icons-material/Search"; // Search Icon
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger Menu Icon
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isLogout } from "../api/Auth";

function Navbar({ currUser, setCurrUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile Drawer State
  const navigate = useNavigate();

  // Mobile Menu open/close toggle handler
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await isLogout();
      console.log("res of logout", res);
      if (res.success) {
        toast.success(res.message);
        setCurrUser(null);
        setMobileOpen(false); // Close drawer on logout
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout. Please try again!");
    }
  };

  // 📱 Mobile Drawer Layout Component
  const drawerContent = (
    <Box sx={{ width: 250, padding: "20px 10px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, pl: 1 }}>
        <TravelExploreIcon sx={{ color: "#FF385C", fontSize: "28px" }} />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FF385C" }}>
          stayNest
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/");
              setMobileOpen(false);
            }}
          >
            <ListItemText
              primary="Home"
              primaryTypographyProps={{ fontWeight: "500" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/listings/new");
              setMobileOpen(false);
            }}
          >
            <ListItemText
              primary="Airbnb your home"
              primaryTypographyProps={{ fontWeight: "500" }}
            />
          </ListItemButton>
        </ListItem>

        <Box sx={{ mt: 2, padding: "0 16px" }}>
          {!currUser ? (
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#FF385C",
                color: "white",
                textTransform: "none",
                fontWeight: "600",
                borderRadius: "24px",
                "&:hover": { backgroundColor: "#DC143C" },
              }}
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#B91C1C",
                color: "white",
                textTransform: "none",
                fontWeight: "600",
                borderRadius: "24px",
                "&:hover": { backgroundColor: "#DC143C" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#ffffff",
          color: "#222222",
          boxShadow: "0 1px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            padding: { xs: "0 12px", sm: "0 24px" },
          }}
        >
          {/* 1. LEFT SIDE: Logo aur Brand Name */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <TravelExploreIcon
              sx={{ color: "#FF385C", fontSize: { xs: "28px", sm: "32px" } }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#FF385C",
                display: { xs: "none", sm: "block" }, // Mobile par text hide ho jayega, sirf icon dikhega
              }}
            >
              stayNest
            </Typography>
          </Box>

          {/* 2. CENTER: Premium Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "60%", sm: "280px", md: "360px" }, // Mobile par fluid and broad layout
              padding: "4px 8px 4px 12px",
              borderRadius: "24px",
              border: "1px solid #eaeaea",
              boxShadow:
                "0px 1px 2px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow:
                  "0px 1px 2px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: "500",
              }}
              placeholder="Search destinations..."
              inputProps={{ "aria-label": "search destinations" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Box
              type="submit"
              component="button"
              sx={{
                backgroundColor: "#FF385C",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: { xs: "26px", sm: "32px" },
                height: { xs: "26px", sm: "32px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: "#DC143C" },
              }}
            >
              <SearchIcon sx={{ fontSize: { xs: "14px", sm: "18px" } }} />
            </Box>
          </Paper>

          {/* 3. RIGHT SIDE: Desktop Navigation vs Mobile Hamburger */}
          {/* Desktop Version Links (Large screens par dikhenge, mobile par hide) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              onClick={() => navigate("/listings/new")}
              sx={{
                color: "#222222",
                fontWeight: "600",
                textTransform: "none",
                borderRadius: "24px",
                padding: "8px 16px",
                fontSize: "14px",
                "&:hover": { backgroundColor: "#f7f7f7" },
              }}
            >
              Airbnb your home
            </Button>

            <Button
              sx={{
                color: "#222222",
                fontWeight: "600",
                textTransform: "none",
                borderRadius: "24px",
                padding: "8px 16px",
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            {!currUser ? (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FF385C",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "600",
                  borderRadius: "24px",
                  padding: "8px 20px",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#DC143C", boxShadow: "none" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#B91C1C",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "600",
                  borderRadius: "24px",
                  padding: "8px 20px",
                  boxShadow: "none",
                  "&:hover": { backgroundColor: "#DC143C", boxShadow: "none" },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Box>

          {/* Mobile Hamburger Menu Icon (Sirf small screen sizes xs aur sm par dikhega) */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open side drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "#222222" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 📱 MUI Drawer Side Sidebar Implementation */}
      <Drawer
        anchor="right" // Right side se slide hokar aayega menu
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mobile performance optimization ke liye helpful hai
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Navbar;