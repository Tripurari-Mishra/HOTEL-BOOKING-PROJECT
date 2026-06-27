import { AppLayout } from "./Layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { CreateListingPage } from "./pages/CreateListingsPage";
import { ListingEditPage } from "./pages/ListingEditPage";
import { SignUpAndLogin } from "./pages/SignupAndLoginPage";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "./api/Auth";
import MyBookings from "./pages/MyBooking";

const App = () => {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserSession = async () => {
    try {
      const res = await getLoggedInUser();
      console.log("UseEffect call", res);
      if (res.success) {
        setCurrUser(res.user);
      }
    } catch (error) {
      console.log("No previous session or session expired.");
      setCurrUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout currUser={currUser} setCurrUser={setCurrUser} />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: "listings/new",
          element: <CreateListingPage />,
        },
        {
          path: "signup",
          element: <SignUpAndLogin setCurrUser={setCurrUser} />,
        },
        {
          path: "login",
          element: <SignUpAndLogin setCurrUser={setCurrUser} />,
        },

        { path: "/my-bookings", element: <MyBookings /> },

        {
          path: "listings/:id",
          element: <ListingDetailPage />,
        },
        {
          path: "listings/:id/edit/",
          element: <ListingEditPage />,
        },
      ],
    },
  ]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Loading Session... ⏳</h3>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
