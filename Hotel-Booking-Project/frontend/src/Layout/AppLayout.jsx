import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppLayout = ({ currUser, setCurrUser }) => {
  return (
    <>
      <Navbar currUser={currUser} setCurrUser={setCurrUser} />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Outlet context={{ currUser, setCurrUser }} />
      <Footer />
    </>
  );
};
