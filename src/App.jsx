import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/Signin.jsx";
import SignOut from "./pages/Signout.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <header className="flex items-center justify-around bg-blue-800 text-white font-bold h-[13vh]">
          <div>
            <Link to="/">
              <h1 className="text-[2.1rem] cursor-pointer">
                <span className="text-blue-100">House</span>Dreamer
              </h1>
            </Link>
          </div>

          <form className="w-80">
            <input
              className="placeholder:text-black text-black placeholder:font-normal font-normal w-full px-6 py-[0.3rem] rounded-2xl focus:outline-none appearance-none"
              type="search"
              name="search"
              id="search"
              autoComplete="off"
              placeholder="Search"
            ></input>
          </form>

          <ul className="flex items-center gap-10">
            <Link to="/">
              <li className="cursor-pointer">Home</li>
            </Link>
            <Link to="/About">
              <li className="cursor-pointer">About</li>
            </Link>
          </ul>
        </header>

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
