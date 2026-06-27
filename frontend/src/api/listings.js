import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
export const getAllListings = async (searchQuery = "") => {
  try {
    const url = searchQuery ? `listings?search=${searchQuery}` : "listings";
    const res = await apiClient.get(url);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getListingDetails = async (id) => {
  try {
    const res = await apiClient.get(`listings/${id}`);
    console.log("details", res.data);
    return res.data;
  } catch (error) {
    console.log("Internal Issue");
    throw error;
  }
};

export const createListing = async (formData) => {
  try {
    const res = await apiClient.post("listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    const res = await apiClient.delete(`listings/${id}`);
    return res.data;
  } catch (error) {
    console.log("Api delete Error", error, error.response);
    throw error;
  }
};

export const updateListing = async (id, updateData) => {
  try {
    const res = await apiClient.put(`listings/${id}`, updateData);
    console.log("updateListingDataAxios", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
