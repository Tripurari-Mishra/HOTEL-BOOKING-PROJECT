import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
// 🔥 FIX: Naye responsive standard ke liye modern Grid2 component use kiya hai
import Grid from "@mui/material/Grid2";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import { getListingDetails, updateListing } from "../api/listings";
import { toast } from "react-toastify";

export const ListingEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    category: "Hotel",
    price: "",
    location: "",
    country: "",
  });

  // Check Form Validation
  const validateForm = () => {
    let tempErrors = {};

    if (!formData.title.trim()) {
      tempErrors.title = "Property title is required!";
    }

    if (!formData.description.trim()) {
      tempErrors.description = "Description is required!";
    }

    if (!formData.country.trim()) {
      tempErrors.country = "Country name is required!";
    }

    if (!formData.price || formData.price <= 0) {
      tempErrors.price = "Price must be a positive number!";
    }

    if (!formData.location.trim()) {
      tempErrors.location = "Location is required!";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  // Handle File Upload (Image Selection)
  const handleFileChange = (evt) => {
    const file = evt.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      dataToSend.append("price", formData.price);
      dataToSend.append("location", formData.location);
      dataToSend.append("country", formData.country);
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      console.log("Submitting Updated Data...");
      const res = await updateListing(id, dataToSend);

      if (res.success || res.status === 200 || res.status === 201) {
        toast.success("Listing is Updated Successfully");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error) {
      console.log("Frontend Error", error);
      toast.error("Something went wrong Listing is Not Updated");
    }
  };

  useEffect(() => {
    const getExistingData = async () => {
      try {
        const res = await getListingDetails(id);
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          image: res.data.image || null,
          category: res.data.category || "Hotel",
          price: res.data.price || "",
          location: res.data.location || "",
          country: res.data.country || "",
        });

        if (res.data.image) {
          setImagePreview(res.data.image);
        }
      } catch (error) {
        console.log("Frontend Error", error);
      }
    };
    getExistingData();
  }, [id]);

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: { xs: "20px", sm: "40px" },
        marginBottom: "60px",
        px: 2,
      }}
    >
      {/* 🔙 Back Button Design */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          color: "#717171",
          textTransform: "none",
          marginBottom: "16px",
          "&:hover": { backgroundColor: "transparent", color: "#222222" },
        }}
      >
        Back to Details
      </Button>

      <Paper
        elevation={3}
        sx={{
          padding: { xs: "20px", sm: "40px" }, // Choti screens par clean fit dene ke liye space optimization
          borderRadius: "16px",
          border: "1px solid #eaeaea",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Header Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            marginBottom: "8px",
            color: "#222",
            fontSize: { xs: "1.75rem", sm: "2.125rem" }, // Typography scale responsive kari hai
          }}
        >
          Edit Your Listing ✏️
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#717171",
            marginBottom: "32px",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Modify the details of your property below to update your listing.
        </Typography>

        {/* Form Container */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* 🔥 Grid layout properties updated to modern Grid2 sizing */}
          <Grid container spacing={3}>
            {/* 1. Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Property Title"
                placeholder="e.g., Cozy Beachside Paradise"
                variant="outlined"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon
                          sx={{ color: "#717171", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* 2. Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Describe your space..."
                variant="outlined"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: "4px" }}
                      >
                        <DescriptionIcon
                          sx={{ color: "#717171", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* 3. Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="category-label" shrink>
                  Category
                </InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  notched
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <CategoryIcon
                        sx={{ color: "#717171", fontSize: "20px" }}
                      />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                  <MenuItem value="Resort">Resort</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 4. Price per Night */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Price per Night"
                placeholder="e.g., 2500"
                variant="outlined"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                slotProps={{
                  htmlInput: { min: 0 },
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon
                          sx={{ color: "#717171", fontSize: "18px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* 5. Modern File Upload Section */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#222222",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Property Image
              </Typography>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease-in-out",
                  "&:hover": { borderColor: "#E61E4D" },
                }}
                component="label"
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <CloudUploadIcon
                  sx={{ fontSize: 40, color: "#717171", mb: 1 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "500", color: "#222" }}
                >
                  Click to Upload an Image
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "#717171" }}
                >
                  PNG, JPG, JPEG up to 5MB supported
                </Typography>
              </Box>

              {/* Real-time Responsive Image Preview box */}
              {imagePreview && (
                <Box
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 1, color: "#717171" }}
                  >
                    Selected Image Preview:
                  </Typography>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Property Preview"
                    sx={{
                      width: "100%", // 🔥 Image layout ko rigid pixels se flexible percentage par transform kiya hai
                      maxWidth: "350px",
                      height: "auto",
                      maxHeight: "220px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* 6. Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location / City"
                placeholder="e.g., Calangute, Goa"
                variant="outlined"
                name="location"
                onChange={handleChange}
                value={formData.location}
                error={!!errors.location}
                helperText={errors.location}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon
                          sx={{ color: "#717171", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* 7. Country */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Country"
                placeholder="e.g., India"
                variant="outlined"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon
                          sx={{ color: "#717171", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* ACTION BUTTONS PANEL */}
            <Grid size={{ xs: 12 }} sx={{ marginTop: "24px" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "flex-end",
                  flexDirection: { xs: "column-reverse", sm: "row" }, // Mobile par vertical stack aur desktop par clean inline row layout
                }}
              >
                {/* ❌ Sleek Cancel Button */}
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={() => navigate(-1)}
                  sx={{
                    color: "#222222",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "15px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f7f7f7" },
                  }}
                >
                  Cancel
                </Button>

                {/* 🚀 Luxury Save Changes Button */}
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{
                    background:
                      "linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)",
                    color: "#ffffff",
                    padding: "12px 32px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    textTransform: "none",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "box-shadow 0.2s ease, transform 0.1s ease",
                    "&:hover": { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" },
                    "&:active": { transform: "scale(0.98)" },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};