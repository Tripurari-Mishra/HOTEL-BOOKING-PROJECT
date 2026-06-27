import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}api/`,
  withCredentials: true,
});

export const createBookingApi = async (bookingData) => {
  try {
    const res = await apiClient.post("bookings", bookingData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBookingApi = async () => {
  try {
    const res = await apiClient.get("bookings/my-bookings");
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// 1. Backend se Razorpay Order ID mangwane ke liye
export const checkoutApi = async (amount) => {
  try {
    const res = await apiClient.post("bookings/checkout", { amount });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// 2. Razorpay se payment milne ke baad verification ke liye
export const verifyPaymentApi = async (paymentData) => {
  try {
    const res = await apiClient.post("bookings/verify", paymentData);
    return res.data;
  } catch (error) {
    throw error;
  }
};
