import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ImageIcon from "@mui/icons-material/Image";
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validateForm()) return;
    try {
      console.log("Submitting Clean Data:", formData);
      const res = await updateListing(id, formData);

      if (res.success || res.status === "200" || res.status === "201") {
        toast.success("Listing is Updated Successfully");
        setTimeout(() => {
          console.log("Success Updated");
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
          image: res.data.image || "",
          category: res.data.category || "Hotel",
          price: res.data.price || "",
          location: res.data.location || "",
          country: res.data.country || "",
        });
      } catch (error) {
        console.log("Frontend Error", error);
      }
    };
    getExistingData();
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ marginTop: "40px", marginBottom: "60px" }}>
      {/* 🔙 Back Button Design Fixed */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} // 🔥 FIX: Functional banaya ise
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
          padding: { xs: "24px", sm: "40px" },
          borderRadius: "16px",
          border: "1px solid #eaeaea",
        }}
      >
        {/* Header Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "600", marginBottom: "8px", color: "#222" }}
        >
          Edit Your Listing ✏️
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#717171", marginBottom: "32px" }}
        >
          Modify the details of your property below to update your listing.
        </Typography>

        {/* Form Container */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 1. Title */}
            <Grid xs={12}>
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
            <Grid xs={12}>
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
            <Grid xs={12} sm={6}>
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
            <Grid xs={12} sm={6}>
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

            {/* 5. Image URL */}
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="https://images.unsplash.com/..."
                variant="outlined"
                helperText="Paste a secure link of your property image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon
                          sx={{ color: "#717171", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* 6. Location */}
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location / City"
                placeholder="e.g., Calangute, Goa"
                variant="outlined"
                name="location"
                onChange={handleChange}
                value={formData.location}
                error={!!errors.location} // 🔥 FIX: !! dynamic boolean banaya
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
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                placeholder="e.g., India"
                variant="outlined"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country} // 🔥 FIX: !! dynamic boolean banaya
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
            <Grid xs={12} sx={{ marginTop: "24px" }}>
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "flex-end",
                  flexDirection: { xs: "column-reverse", sm: "row" },
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
