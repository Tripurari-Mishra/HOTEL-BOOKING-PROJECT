import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ListingCard({ listing }) {
  const navigate = useNavigate();
  const id = listing._id || 123;

  const handleCardClick = () => {
    navigate(`/listings/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: "100%",
        borderRadius: "12px",
        boxShadow: "none",
        cursor: "pointer",
        backgroundColor: "transparent",
        "&:hover .MuiCardMedia-root": { transform: "scale(1.03)" }, // Smooth card image hover effect
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: "12px",
          aspectRatio: "20 / 19",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          image={
            (Array.isArray(listing.image) && listing.image[0]) ||
            (typeof listing.image === "string" && listing.image) ||
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
          }
          alt={listing.title || "Listing Image"}
          sx={{
            height: "240px",
            width: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </Box>

      {/* Details Area */}
      <CardContent sx={{ padding: "12px 4px" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", color: "#222222", noWrap: true }}
        >
          {listing.title || "Untitled Property"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#717171" }}>
          {listing.location || "Location"}, {listing.country || "Country"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#717171", margin: "2px 0" }}>
          {listing.category || "Property"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: "600", color: "#222222", mt: "4px" }}
        >
          ₹{listing.price ? listing.price.toLocaleString("en-IN") : "N/A"}{" "}
          <span style={{ fontWeight: "400", color: "#717171" }}>/ night</span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ListingCard;
