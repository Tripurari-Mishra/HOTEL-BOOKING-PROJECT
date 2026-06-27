import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Rating,
  Divider,
  Avatar,
  Button,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import TvIcon from "@mui/icons-material/Tv";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { deleteListing, getListingDetails } from "../api/listings";
import { createReviews, deleteReviews, updateReviews } from "../api/review";
import { toast } from "react-toastify";
import { checkoutApi, verifyPaymentApi } from "../api/booking";

export const ListingDetailPage = () => {
  const [listing, setListing] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Booking States
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // Review States
  const [reviewData, setReviewData] = useState({
    comment: "",
    rating: 5,
  });

  const context = useOutletContext() || {};
  const currUser = context.currUser || null;

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Fetch listing details from backend
  const fetchListing = async () => {
    try {
      const res = await getListingDetails(id);
      setListing(res.data || {});
    } catch (error) {
      console.error("Error fetching listing details:", error);
    }
  };

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  // Auto Total price calculation based on date range
  useEffect(() => {
    const basePrice = listing.price || 8499;
    if (checkIn && checkOut) {
      let d1 = new Date(checkIn);
      let d2 = new Date(checkOut);
      let diff = d2.getTime() - d1.getTime();
      let days = Math.ceil(diff / (1000 * 60 * 3600 * 24));

      if (days > 0) {
        setTotalPrice(basePrice * days);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(basePrice);
    }
  }, [checkIn, checkOut, listing.price]);

  // 💳 RESERVE NOW / RAZORPAY INTEGRATED BUTTON
  const handleSubmitButton = async () => {
    if (!currUser) {
      toast.error("Please login first to book this listing!");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select both Check-In and Check-Out dates");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Invalid Date Range Selected!");
      return;
    }

    try {
      setLoadingBooking(true);

      const orderData = await checkoutApi(totalPrice);
      if (!orderData.success) {
        toast.error("Order create karne mein dikkat aayi bhai!");
        return;
      }

      const order = orderData.order || orderData.data || orderData;

      if (!order || !order.id) {
        toast.error("Backend se Order ID sahi se nahi mili bhai!");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Smart Campus Stay",
        description: "Hotel Booking Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const bookingInfo = {
              listing: id,
              checkIn: checkIn,
              checkOut: checkOut,
              totalPrice: totalPrice,
            };

            const verifyData = await verifyPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: bookingInfo,
            });

            if (verifyData.success) {
              toast.success(" Booking Confirmed Successfully 🎉");
              setCheckIn("");
              setCheckOut("");
              navigate("/my-bookings");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error(
              error.response?.data?.message || "Verification fail ho gayi!",
            );
          }
        },
        prefill: {
          name: currUser?.username || "Guest User",
          email: currUser?.email || "guest@example.com",
        },
        theme: {
          color: "#FF385C",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Booking Payment Error:", error);
      toast.error("Checkout process shuru nahi ho paya!");
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleDeleteButton = async () => {
    try {
      const deleteData = await deleteListing(id);
      if (deleteData.success) {
        toast.success("Listing is Deleted Successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.log("Frontend Error", error);
      toast.error("Something went wrong, listing is Not Deleted");
    }
  };

  const handleEditReview = (rev) => {
    setIsEditingReview(true);
    setEditingReviewId(rev._id);
    setReviewData({
      comment: rev.comment || "",
      rating: rev.rating || 5,
    });
  };

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingReview) {
        const res = await updateReviews(id, editingReviewId, reviewData);
        if (res.success) {
          toast.success("Review is Updated Successfully");
        }
        setIsEditingReview(false);
        setEditingReviewId(null);
      } else {
        const res = await createReviews(id, reviewData);
        if (res.success) {
          toast.success("Review is Created Successfully");
        }
      }

      setReviewData({ comment: "", rating: 5 });
      fetchListing();
    } catch (error) {
      const statusCode = error.status;
      if (statusCode === 401) {
        toast.error("Please Login And Review Add");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      if (statusCode === 400) {
        toast.error("minimum use five character create reviews");
        return;
      }
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await deleteReviews(id, reviewId);
      if (res) {
        toast.success("Review is Deleted Successfully");
        fetchListing();
      }
    } catch (error) {
      console.log("Error Frontend", error);
    }
  };

  const dummyListing = {
    title: "Luxury Beachside Villa with Private Pool",
    description:
      "Welcome to our premium beachside villa. Located just 2 minutes away from the beach, this villa offers a serene environment, a private crystal-clear pool, and state-of-the-art modern amenities. Perfect for family getaways and friends' reunions.",
    image: [
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=1200&auto=format&fit=crop&q=80",
    ],
    category: "Villa",
    price: 8499,
    location: "Goa",
    country: "India",
    rating: 4.85,
    reviewsCount: 124,
    hostName: "Ritik Sharma",
  };

  return (
    <Container
      sx={{ marginTop: { xs: "16px", sm: "32px" }, marginBottom: "60px" }}
    >
      {/* 🏷️ SECTION 1: Title & Quick Info */}
      <Box sx={{ marginBottom: "24px" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            color: "#222222",
            marginBottom: "12px",
            fontSize: { xs: "1.75rem", sm: "2.125rem" }, // Mobile par text size chota hoga taaki wrap badiya ho
          }}
        >
          {listing.title || dummyListing.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" }, // Mobile par details vertical stacked hongi
            gap: { xs: 1, sm: 0.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Rating
              value={Number(listing.rating || dummyListing.rating)}
              precision={0.05}
              readOnly
              size="small"
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: "600", color: "#222222" }}
            >
              {listing.rating || dummyListing.rating} ·
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#717171",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {listing.review?.length || 0} reviews
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "#717171",
              fontWeight: "600",
              marginLeft: { xs: "0px", sm: "8px" },
            }}
          >
            {window.innerWidth < 600 ? "" : "·"}{" "}
            {listing.location || dummyListing.location},{" "}
            {listing.country || dummyListing.country}
          </Typography>
        </Box>
      </Box>

      {/* 🖼️ SECTION 2: Image Banner */}
      <Box
        component="img"
        src={(listing.image && listing.image[0]) || dummyListing.image[0]}
        alt={listing.title || dummyListing.title}
        sx={{
          width: "100%",
          height: { xs: "240px", sm: "400px", md: "500px" }, // Fluid image height matching screens
          borderRadius: "16px",
          objectFit: "cover",
          marginBottom: "32px",
        }}
      />

      {/* 🧱 SECTION 3: Split Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, // Responsive Split grid block
          gap: { xs: "32px", md: "64px" },
        }}
      >
        {/* ⬅️ LEFT SIDE */}
        <Box>
          {/* Host Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  color: "#222",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Entire {listing.category || dummyListing.category} hosted by{" "}
                {dummyListing.hostName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#717171" }}>
                14 guests · 4 bedrooms · 4 beds · 4 bathrooms
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "#FF385C",
                flexShrink: 0,
              }}
            >
              {dummyListing.hostName[0]}
            </Avatar>
          </Box>

          <Divider sx={{ margin: "24px 0" }} />

          {/* Description */}
          <Typography
            variant="body1"
            sx={{ color: "#222", lineHeight: "1.6", marginBottom: "24px" }}
          >
            {listing.description || dummyListing.description}
          </Typography>

          <Divider sx={{ margin: "24px 0" }} />

          {/* Amenities */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "600", marginBottom: "16px" }}
          >
            What this place offers
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "#222",
              }}
            >
              <PoolIcon sx={{ color: "#717171" }} />
              <Typography variant="body1">Private Pool</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "#222",
              }}
            >
              <WifiIcon sx={{ color: "#717171" }} />
              <Typography variant="body1">Wifi</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "#222",
              }}
            >
              <AcUnitIcon sx={{ color: "#717171" }} />
              <Typography variant="body1">Air conditioning</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "#222",
              }}
            >
              <TvIcon sx={{ color: "#717171" }} />
              <Typography variant="body1">HDTV with Netflix</Typography>
            </Box>
          </Box>

          <Divider sx={{ margin: "24px 0" }} />

          {/* Admin Buttons */}
          {currUser &&
          listing &&
          (currUser._id === listing.owner?._id ||
            listing.owner === currUser._id) ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/listings/${listing._id}/edit`)}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: "600",
                  padding: "8px 24px",
                  borderRadius: "8px",
                  flex: { xs: 1, sm: "initial" }, // Mobile par side by side buttons complete display stretch
                }}
              >
                Edit Listing
              </Button>

              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteButton}
                sx={{
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  textTransform: "none",
                  fontWeight: "600",
                  padding: "8px 24px",
                  borderRadius: "8px",
                  flex: { xs: 1, sm: "initial" },
                }}
              >
                Delete Listing
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#717171", mt: 2 }}>
              Hosted by another premium user. ✨
            </Typography>
          )}

          <Divider sx={{ margin: "32px 0" }} />

          {/* ✍️ CREATE / EDIT REVIEW FORM */}
          <Box
            component="form"
            onSubmit={handleReviewSubmit}
            sx={{
              p: { xs: 2, sm: 3 }, // Responsive inside padding
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "600", mb: 2 }}>
              {isEditingReview ? "Edit Your Review ✏️" : "Leave a Review"}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "600", mb: 0.5, color: "#444" }}
              >
                Rating
              </Typography>
              <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
                <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
                  <Rating
                    name="rating"
                    value={Number(reviewData.rating)}
                    onChange={(event, newValue) => {
                      setReviewData({ ...reviewData, rating: newValue });
                    }}
                    size="large"
                  />
                </Paper>
              </Paper>
            </Box>

            <TextField
              label="Share your thoughts about this place..."
              fullWidth
              multiline
              rows={3}
              name="comment"
              value={reviewData.comment}
              onChange={handleOnChange}
              sx={{ mb: 2, backgroundColor: "#fff" }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: isEditingReview ? "#4CAF50" : "#FF385C",
                  color: "#fff",
                  fontWeight: "600",
                  textTransform: "none",
                  flex: { xs: 1, sm: "initial" },
                  "&:hover": {
                    backgroundColor: isEditingReview ? "#45a049" : "#DC143C",
                  },
                }}
              >
                {isEditingReview ? "Update Review" : "Submit Review"}
              </Button>

              {isEditingReview && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setIsEditingReview(false);
                    setEditingReviewId(null);
                    setReviewData({ comment: "", rating: 5 });
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: "600",
                    flex: { xs: 1, sm: "initial" },
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* ➡️ RIGHT SIDE: Floating Booking Widget */}
        <Box sx={{ order: { xs: -1, md: 1 } }}>
          {" "}
          {/* 🔥 Mobile screens par reservation widget pehle top pe aayega */}
          <Paper
            elevation={4}
            sx={{
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #dddddd",
              position: { xs: "static", md: "sticky" }, // Mobile par layout control scroll natural rahega
              top: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#222" }}
              >
                ₹{" "}
                {totalPrice
                  ? totalPrice.toLocaleString("en-IN")
                  : (listing.price || dummyListing.price).toLocaleString(
                      "en-IN",
                    )}
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#717171",
                  }}
                >
                  {checkIn && checkOut ? " total" : " / night"}
                </span>
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Rating value={1} max={1} readOnly size="small" />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {listing.rating || dummyListing.rating}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #b0b0b0",
                borderRadius: "8px",
                marginBottom: "16px",
                overflow: "hidden",
              }}
            >
              <Box sx={{ display: "flex", borderBottom: "1px solid #b0b0b0" }}>
                <Box sx={{ p: 1.5, flex: 1, borderRight: "1px solid #b0b0b0" }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                  >
                    CHECK-IN
                  </Typography>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      color: "#222",
                      fontFamily: "inherit",
                    }}
                  />
                </Box>
                <Box sx={{ p: 1.5, flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                  >
                    CHECKOUT
                  </Typography>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      color: "#222",
                      fontFamily: "inherit",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", display: "block" }}
                >
                  GUESTS
                </Typography>
                <Typography variant="body2" sx={{ color: "#222", mt: 0.5 }}>
                  1 guest (default)
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitButton}
              disabled={loadingBooking}
              sx={{
                backgroundColor: "#FF385C",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                "&:hover": { backgroundColor: "#DC143C" },
              }}
            >
              {loadingBooking ? "Reserving..." : "Reserve Now"}
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* 📜 ALL REVIEWS CARDS GRID */}
      <Box sx={{ marginTop: "48px" }}>
        <Divider sx={{ mb: 4 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: "600", mb: 3, color: "#222" }}
        >
          Reviews ({listing.review?.length || 0})
        </Typography>

        {(!listing.review || listing.review.length === 0) && (
          <Typography
            variant="body1"
            sx={{ color: "#717171", fontStyle: "italic" }}
          >
            No reviews yet for this villa. Be the first to write a review!
          </Typography>
        )}

        <Grid container spacing={3}>
          {listing.review &&
            listing.review.map((rev) => (
              <Grid item xs={12} sm={6} key={rev._id}>
                {" "}
                {/* Standard Grid display systems for all layout platforms */}
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "12px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{ width: 40, height: 40, bgcolor: "#1976d2" }}
                        >
                          {rev.author?.username
                            ? rev.author.username[0].toUpperCase()
                            : "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "600" }}
                          >
                            {rev.author?.username || "Verified Guest"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {rev.createdAt
                              ? new Date(rev.createdAt).toLocaleDateString(
                                  "en-IN",
                                )
                              : "Recently"}
                          </Typography>
                        </Box>
                      </Box>

                      {currUser &&
                        rev.author &&
                        (() => {
                          const reviewAuthorId = rev.author._id
                            ? rev.author._id.toString()
                            : rev.author.toString();
                          const loggedInUserId = currUser._id
                            ? currUser._id.toString()
                            : currUser.toString();
                          return reviewAuthorId === loggedInUserId;
                        })() && (
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditReview(rev)}
                              size="small"
                              sx={{ color: "#007A87" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleReviewDelete(rev._id)}
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{ backgroundColor: "transparent" }}
                    >
                      <Rating
                        value={rev.rating || 5}
                        readOnly
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Paper>

                    <Typography
                      variant="body2"
                      sx={{ color: "#484848", lineHeight: "1.5" }}
                    >
                      {rev.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};