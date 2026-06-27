import React, { useState } from "react";
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
} from "@mui/material";
import { createListing } from "../api/listings";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreateListingPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 🚀 1. Errors State setup kiya frontend feedback ke liye
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

  // 🚀 2. Solid Validation Guard Function
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

    // 🚨 FIXED: Purana text validation hata kar ab imageFile state check kar rahe hain
    if (!imageFile) {
      tempErrors.image =
        "Bhai saheb, ek sunder si property image select karna zaroori hai! 📸";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormData = (evt) => {
    let { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleFormSubmit = async (evt) => {
  //   evt.preventDefault();
  //   setSuccess("");
  //   setError("");

  //   if (!validateForm()) return;

  //   const dataToSend = {
  //     ...formData,
  //     image: [formData.image],
  //   };

  //   try {
  //     console.log("come error 1");
  //     const res = await createListing(dataToSend);
  //     console.log("come error2", res);
  //     console.log("Form res", res);
  //     console.log("res Success", res.success);
  //     if (res.success || res.status === 200 || res.status === 201) {
  //       toast.success("New Listing is Add Successfully");
  //       setSuccess("Success");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 2000);
  //       return;
  //     }
  //   } catch (error) {
  //     if (error.status === 401) {
  //       toast.error(
  //         "Oops! You are not logged in. Please Login first to add a listing! 🔒",
  //       );

  //       setTimeout(() => navigate("/login"), 1500);
  //       return;
  //     }
  //     toast.error("Something went err Listing is Not Add");
  //     setError(error.message || "Something went wrong");
  //   }
  // };

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();
    setSuccess("");
    setError("");

    if (!validateForm()) return;

    // 🚨 ASLI KHEL: FormData ka object banao kyuki ab hum file bhej rahe hain
    const dataToSend = new FormData();

    // 1. Saara purana text data isme append (jodh) do
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("category", formData.category);
    dataToSend.append("price", formData.price);
    dataToSend.append("location", formData.location);
    dataToSend.append("country", formData.country);

    // 2. Apni image file ko jodo jo tumne upar alag state (imageFile) mein save ki thi
    if (imageFile) {
      dataToSend.append("image", imageFile); // 🔥 Key ka naam "image" hi hona chahiye kyunki backend par upload.single("image") hai
    } else {
      toast.error(
        "Bhai saheb, ek sunder si image upload karna zaroori hai! 📸",
      );
      return;
    }

    try {
      console.log("come error 1 - Sending FormData...");

      // 3. API Call: Pura FormData object bhej rahe hain
      const res = await createListing(dataToSend);

      console.log("come error2", res);

      if (res.success || res.status === 200 || res.status === 201) {
        toast.success("New Listing is Added Successfully! 🎉");
        setSuccess("Success");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }
    } catch (error) {
      console.error("Form submit error:", error);

      // Axios error response safe handling
      const statusCode = error.response?.status || error.status;

      if (statusCode === 401) {
        toast.error(
          "Oops! You are not logged in. Please Login first to add a listing! 🔒",
        );
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const errMsg =
        error.response?.data?.message ||
        "Something went err Listing is Not Add";
      toast.error(errMsg);
      setError(error.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "40px", marginBottom: "60px" }}>
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
          List a New Place 🏡
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#717171", marginBottom: "32px" }}
        >
          Share your beautiful space with travelers from all around the world.
        </Typography>

        {/* Form Container */}
        <Box component="form" onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {/* 1. Title */}
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                placeholder="e.g., Cozy Beachside Paradise"
                variant="outlined"
                name="title"
                value={formData.title} // 🔥 Controlled input structure
                onChange={handleFormData}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            {/* 2. Description */}
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Description"
                placeholder="Describe your space, amenities, and nearby attractions..."
                variant="outlined"
                name="description"
                value={formData.description} // 🔥 Controlled input structure
                onChange={handleFormData}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            {/* 3. Category */}
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  label="Category"
                  name="category"
                  value={formData.category} // 🔥 Controlled dropdown structure
                  onChange={handleFormData}
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
                label="Price per Night (₹)"
                placeholder="e.g., 2500"
                variant="outlined"
                name="price"
                value={formData.price} // 🔥 Controlled input structure
                onChange={handleFormData}
                error={!!errors.price}
                helperText={errors.price}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>

            {/* 5. Image URL */}
            <Grid xs={12}>
              <TextField
                fullWidth
                type="file" // 🔥 CHANGE 1: Ab yeh file selector ban gaya
                variant="outlined"
                name="image"
                error={!!errors.image}
                helperText={
                  errors.image
                    ? errors.image
                    : "Upload a beautiful image of your property (PNG, JPG, JPEG)"
                }
                // 🔥 CHANGE 2: accept property lagane se user sirf images hi select kar payega
                slotProps={{
                  htmlInput: {
                    accept: "image/*",
                  },
                }}
                // 🔥 CHANGE 3: value hatakar direct file ko state mein capture karenge
                onChange={(e) => {
                  const file = e.target.files[0]; // Pehli file uthao
                  if (file) {
                    setImageFile(file); // Yeh state hum abhi upar banayenge
                  }
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
                value={formData.location} // 🔥 Controlled input structure
                onChange={handleFormData}
                error={!!errors.location}
                helperText={errors.location}
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
                value={formData.country} // 🔥 Controlled input structure
                onChange={handleFormData}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>

            {/* 🚀 Submit Button */}
            <Grid xs={12} sx={{ marginTop: "16px" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#FF385C",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#DC143C",
                    boxShadow: "none",
                  },
                }}
              >
                Publish Listing
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};