import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// IMPORT PAGES
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/Signin.jsx";
import SignUp from "./pages/Signup.jsx";
import Search from "./pages/Search.jsx";

// IMPORT COMPONENTS
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import Listing from "./pages/Listing.jsx";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingid" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/updatelisting/:listingid" element={<UpdateListing />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" />
    </>
  );
}
