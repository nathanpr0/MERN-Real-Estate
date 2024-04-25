import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/Signin.jsx";
import SignOut from "./pages/Signout.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-out" element={<SignOut />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
