import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const NavbarPractices = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 1px 12px rgba(0,0,0,0.08)",
        color: "#222",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <TravelExploreIcon
            sx={{
              color: "#FF385C",
              fontSize: "32px",
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#FF385C",
              fontWeight: "bold",
              display: { xs: "none", sm: "block" },
            }}
          >
            stayNest
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            sx={{
              color: "#222",
              fontWeight: "600",
              textTransform: "none",
            }}
          >
            Home
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF385C",
              color: "#fff",
              textTransform: "none",
              fontWeight: "600",
              "&:hover": { backgroundColor: "#DC143C" },
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarPractices;
