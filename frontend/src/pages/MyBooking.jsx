import React, { useEffect, useState } from "react";
import { getUserBookingApi } from "../api/booking";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookingApi();
        if (response.success) {
          setBookings(response.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Bookings fetch karne mein dikkat aa rahi hai bhai!",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Mere Booked Hotels 🏨
      </Typography>

      {bookings.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "#f9f9f9",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Bhai, abhi tak tumne koi hotel book nahi kiya hai!
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Hotels Dekho
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            const listingImage =
              Array.isArray(booking.listing?.image) &&
              booking.listing.image.length > 0
                ? booking.listing.image[0]
                : typeof booking.listing?.image === "string"
                  ? booking.listing.image
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945";

            return (
              <Grid key={booking._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={listingImage}
                    alt={booking.listing?.title || "Hotel Image"}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: "8px",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        component="div"
                        sx={{
                          fontSize: "1.1rem",
                          lineHeight: "1.3",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {booking.listing?.title || "Hotel Name"}
                      </Typography>
                      <Chip
                        label={booking.status || "Pending"}
                        color={
                          booking.status === "Confirmed"
                            ? "success"
                            : booking.status === "Cancelled"
                              ? "error"
                              : "warning"
                        }
                        size="small"
                        sx={{ fontWeight: "600", borderRadius: "6px" }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📍 {booking.listing?.location || "N/A"},{" "}
                      {booking.listing?.country || ""}
                    </Typography>

                    <Box
                      sx={{
                        mt: "auto",
                        p: 1.5,
                        bgcolor: "#f7f7f7",
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: 0.5, color: "#444" }}
                      >
                        📅 <strong>Check-In:</strong>{" "}
                        {booking.checkIn
                          ? new Date(booking.checkIn).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#444" }}>
                        📅 <strong>Check-Out:</strong>{" "}
                        {booking.checkOut
                          ? new Date(booking.checkOut).toLocaleDateString(
                              "en-IN",
                            )
                          : "N/A"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="500"
                      >
                        Total Amount Paid:
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="700"
                        sx={{ color: "#E61E4D" }}
                      >
                        ₹
                        {booking.totalPrice
                          ? booking.totalPrice.toLocaleString("en-IN")
                          : "0"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings;