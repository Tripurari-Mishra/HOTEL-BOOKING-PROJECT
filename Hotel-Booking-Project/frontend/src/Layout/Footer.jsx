import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f7f7f7",
        color: "#222222",
        borderTop: "1px solid #dddddd",
        padding: "48px 0 24px 0", // Upar zyada padding di hai taaki columns khule-khule lagein
        marginTop: "60px",
      }}
    >
      <Container>
        {/* 🧱 BLOCK 1: Multi-Column Section (Direct CSS Grid Use Kiya For Layout) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Mobile par ek column
              sm: "repeat(2, 1fr)", // Tablet par do columns
              md: "repeat(3, 1fr)", // Laptop par teen columns
            },
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Column 1: Support */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#222" }}
            >
              Support
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Help Centre
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              AirCover
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Anti-discrimination
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Disability support
            </Link>
          </Box>

          {/* Column 2: Community */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#222" }}
            >
              Community
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              stayNest.org: disaster relief
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Combating urbanization
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Report neighborhood concern
            </Link>
          </Box>

          {/* Column 3: stayNest */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#222" }}
            >
              stayNest
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Newsroom
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              New features
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Careers
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#717171", fontSize: "14px" }}
            >
              Investors
            </Link>
          </Box>
        </Box>

        {/* ➖ Horizontal Line Divider */}
        <Box sx={{ borderTop: "1px solid #dddddd", paddingTop: "24px" }} />

        {/* 🧱 BLOCK 2: Bottom Copyright & Social Media Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Copyright text */}
          <Typography
            variant="body2"
            sx={{ color: "#222", textAlign: { xs: "center", sm: "left" } }}
          >
            © {new Date().getFullYear()} stayNest, Inc. · Privacy · Terms ·
            Sitemap
          </Typography>

          {/* Social Icons (MUI IconButton ka use kiya hai click effect ke liye) */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              href="#"
              sx={{ color: "#222", "&:hover": { color: "#FF385C" } }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="#"
              sx={{ color: "#222", "&:hover": { color: "#FF385C" } }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="#"
              sx={{ color: "#222", "&:hover": { color: "#FF385C" } }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
