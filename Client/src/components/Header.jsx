import { Link } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const [focus, setFocus] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  // BURGER MENU BUTTON
  const [tablet, setTablet] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="relative">
          <div
            className={`${
              tablet || mobile ? "shadow-none" : "shadow-xl"
            } flex items-center justify-around gap-4 selection:bg-white 
            selection:bg-opacity-80 selection:text-gray-700 bg-sky-700 text-white 
            px-6 py-5 font-bold transition-all duration-300 ease-in-out w-full`}
          >
            <div>
              <Link to="/">
                <h1 className="text-[2.1rem] max-lg:text-3xl cursor-pointer ">
                  <span className="text-blue-200">House</span>Dreamer
                </h1>
              </Link>
            </div>

            <form
              className="bg-white w-80 max-lg:w-72 max-sm:hidden flex justify-between px-6 py-2 
              max-sm:py-[0.15rem] max-lg:py-1 items-center rounded-3xl gap-4"
            >
              <input
                className="placeholder:text-black text-black placeholder:font-normal font-normal 
                w-full focus:outline-none"
                type="search"
                name="search"
                id="search"
                autoComplete="off"
                placeholder={!focus && "Search..."}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
              ></input>
              <FaSearch className="text-gray-500 cursor-pointer" />
            </form>

            <ul className="flex items-center justify-center gap-10 text-lg max-lg:hidden">
              <Link to="/">
                <li
                  className="cursor-pointer border-b-2 border-transparent 
                hover:border-white transition-all duration-200 ease-in-out"
                >
                  Home
                </li>
              </Link>
              <Link to="/about">
                <li
                  className="cursor-pointer border-b-2 border-transparent 
                hover:border-white transition-all duration-200 ease-in-out"
                >
                  About
                </li>
              </Link>
              {currentUser ? (
                <Link to={"/profile"}>
                  <img
                    src={currentUser["avatar"]}
                    alt="Profile.img"
                    className="rounded-full mx-auto h-[2.5rem] max-lg:h-[30px] object-cover"
                  />
                </Link>
              ) : (
                <Link to="/sign-in">
                  <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                    Sign In
                  </li>
                </Link>
              )}
            </ul>

            <FaBars
              onClick={() => setTablet((click) => !click)}
              className="lg:hidden max-lg:inline-block max-sm:hidden cursor-pointer text-2xl"
            />

            <FaBars
              onClick={() => setMobile((click) => !click)}
              className="sm:hidden max-sm:inline-block cursor-pointer text-2xl"
            />
          </div>

          {/* TABLET SCREEN */}
          <nav
            className={`absolute ${
              tablet ? "top-full shadow-xl" : "-top-full shadow-none"
            } lg:hidden max-sm:hidden p-6 bg-sky-700
            transition-all duration-300 ease-in-out -z-10 w-full`}
          >
            <ul className="flex items-center justify-center gap-10 text-white font-bold text-lg">
              <Link to="/">
                <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                  Home
                </li>
              </Link>
              <Link to="/about">
                <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                  About
                </li>
              </Link>
              {currentUser ? (
                <Link to={"/profile"}>
                  <img
                    src={currentUser["avatar"]}
                    alt="Profile.img"
                    className="rounded-full mx-auto h-[2.5rem] max-lg:h-[30px] object-cover"
                  />
                </Link>
              ) : (
                <Link to="/sign-in">
                  <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                    Sign In
                  </li>
                </Link>
              )}
            </ul>
          </nav>

          {/* MOBILE SCREEN */}
          <nav
            className={`absolute ${
              mobile ? "top-full shadow-xl" : "-top-full shadow-none"
            } sm:hidden max-sm:visible bg-sky-700 shadow-xl 
            transition-all duration-300 ease-in-out -z-10 w-full`}
          >
            <div className="flex flex-col justify-center px-3 py-6 items-center gap-5">
              <form className="bg-white w-72 sm:hidden flex justify-between px-6 py-1 items-center rounded-3xl gap-4">
                <input
                  className="placeholder:text-black text-black placeholder:font-normal font-normal focus:outline-none"
                  type="search"
                  name="search_mobile"
                  id="search_mobile"
                  autoComplete="off"
                  placeholder={!focus && "Search..."}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                ></input>
                <FaSearch className="text-gray-500 cursor-pointer" />
              </form>

              <ul className="flex items-center justify-center gap-10 text-white font-bold">
                <Link to="/">
                  <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                    Home
                  </li>
                </Link>
                <Link to="/about">
                  <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                    About
                  </li>
                </Link>
                {currentUser ? (
                  <Link to={"/profile"}>
                    <img
                      src={currentUser["avatar"]}
                      alt="Profile.img"
                      className="rounded-full mx-auto h-[2.5rem] max-lg:h-[30px] object-cover"
                    />
                  </Link>
                ) : (
                  <Link to="/sign-in">
                    <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
                      Sign In
                    </li>
                  </Link>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
