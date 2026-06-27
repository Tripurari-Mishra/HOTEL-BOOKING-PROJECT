import React, { useEffect, useState } from "react";
import { getUserBookingApi } from "../api/booking"; // Path apne hisab se check kar lena bhai
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
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

  // 1. Loading State (Fix: Yahan sx prop laga kar flex attributes ko HTML par leak hone se roka)
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
        // 2. Main Layout (Fix: Naye MUI Grids mein item aur spacing rules up-to-date kar diye hain)
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid key={booking._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    booking.listing?.image?.[0] ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                  }
                  alt={booking.listing?.title || "Hotel Image"}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Fix: Is Box ke flex attributes ko bhi sx mein shift kar diya */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" component="div">
                      {booking.listing?.title || "Hotel Name"}
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === "Confirmed"
                          ? "success"
                          : booking.status === "Cancelled"
                            ? "error"
                            : "warning"
                      }
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    📍 {booking.listing?.location}, {booking.listing?.country}
                  </Typography>

                  <Box
                    sx={{ mt: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 2 }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      📅 **Check-In:**{" "}
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      📅 **Check-Out:**{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Fix: Is inner layout Box ke attributes bhi sx ke andar clean kar diye hain */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Total Amount paid:
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings;
