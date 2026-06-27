import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/listings/",
  withCredentials: true,
});

// 1. Create Review
export const createReviews = async (id, formData) => {
  try {
    const res = await apiClient.post(`${id}/reviews`, formData);
    console.log("Create Review Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Create Review API Error:", error.response?.data || error);
    throw error;
  }
};

// 2. Delete Review
export const deleteReviews = async (id, reviewId) => {
  try {
    const response = await apiClient.delete(`${id}/reviews/${reviewId}`);
    console.log("Delete Review Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Delete Review API Error:", error.response?.data || error);
    throw error;
  }
};

// 3. Update Review
export const updateReviews = async (id, reviewId, formData) => {
  try {
    const res = await apiClient.put(`${id}/reviews/${reviewId}`, formData);
    console.log("Update Review Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Update Review API Error:", error.response?.data || error);
    throw error;
  }
};
