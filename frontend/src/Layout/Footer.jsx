import React from "react";
import { Box, Container, Typography, Link, IconButton } from "@mui/material";
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
        padding: { xs: "32px 0 24px 0", sm: "48px 0 24px 0" }, // Mobile par padding thodi kam kar di
        marginTop: "60px",
      }}
    >
      <Container>
        {/* 🧱 BLOCK 1: Multi-Column Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Mobile par ek single column
              sm: "repeat(2, 1fr)", // Tablet par do columns
              md: "repeat(3, 1fr)", // Desktop par teen columns
            },
            gap: "40px",
            marginBottom: "40px",
            textAlign: { xs: "center", sm: "left" }, // 📱 Mobile par columns ka text center alignment de diya
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
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              Help Centre
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              AirCover
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              Anti-discrimination
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
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
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              stayNest.org: disaster relief
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              Combating urbanization
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
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
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              Newsroom
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              New features
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
            >
              Careers
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: "#717171",
                fontSize: "14px",
                "&:hover": { color: "#222" },
              }}
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
            flexDirection: { xs: "column-reverse", sm: "row" }, // 📱 Mobile par icons upar aur copyright text automatically neeche ho jayega
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Copyright text */}
          <Typography
            variant="body2"
            sx={{
              color: "#717171",
              textAlign: { xs: "center", sm: "left" },
              fontSize: "14px",
            }}
          >
            © {new Date().getFullYear()} stayNest, Inc. · Privacy · Terms ·
            Sitemap
          </Typography>

          {/* Social Icons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              href="#"
              sx={{
                color: "#222",
                "&:hover": { color: "#FF385C" },
                padding: "4px",
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="#"
              sx={{
                color: "#222",
                "&:hover": { color: "#FF385C" },
                padding: "4px",
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              href="#"
              sx={{
                color: "#222",
                "&:hover": { color: "#FF385C" },
                padding: "4px",
              }}
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