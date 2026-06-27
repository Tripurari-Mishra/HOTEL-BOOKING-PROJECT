import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { getAllListings } from "../api/listings";
import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCards";
import { useSearchParams } from "react-router-dom";

const LandingPage = () => {
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let data = await getAllListings(searchQuery);

        if (data) {
          // Alag-alag backend response formats ke liye safety wrapper
          const actualListings =
            data.data || data.response || data.listings || data;

          // 🔥 Safety Check: Agar backend se data array nahi aaya toh crash hone se bachayega
          setListings(Array.isArray(actualListings) ? actualListings : []);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchQuery]);

  return (
    <Container
      sx={{ marginTop: "40px", marginBottom: "40px", minHeight: "60vh" }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", marginBottom: "24px", color: "#222222" }}
      >
        {searchQuery
          ? `Search Results for "${searchQuery}" 🔍`
          : "Explore Places to Stay 🌎"}
      </Typography>

      {/* ⏳ 1. Responsive Loading State Spinner */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 8,
          }}
        >
          <CircularProgress sx={{ color: "#FF385C" }} />
        </Box>
      ) : listings.length === 0 ? (
        // ❌ 2. Empty State (No items found view)
        <Typography
          variant="body1"
          sx={{ color: "gray", mt: 4, textAlign: "center" }}
        >
          No properties found matching your search. Try searching for something
          else! 🛠️
        </Typography>
      ) : (
        /* 🎯 3. Pure CSS Grid Wrapper (Fully Responsive Layout) */
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Mobile screen: 1 card poori width par
              sm: "repeat(2, 1fr)", // Tablet screen: 2 cards ek row mein
              md: "repeat(3, 1fr)", // Laptop screen: 3 cards ek row mein
              lg: "repeat(4, 1fr)", // Large Desktop: 4 cards ek row mein
            },
            gap: "24px",
            width: "100%",
          }}
        >
          {listings.map((item) => (
            <ListingCard key={item._id || item.id} listing={item} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default LandingPage;