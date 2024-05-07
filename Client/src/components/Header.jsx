import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const [focus, setFocus] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <header className="flex items-center justify-around gap-4 sticky top-0 w-full selection:bg-white selection:bg-opacity-80 selection:text-gray-700 bg-sky-700 text-white p-6 font-bold h-[12vh] shadow-xl">
        <div>
          <Link to="/">
            <h1 className="text-[2.1rem] max-lg:text-3xl max-sm:text-xl  cursor-pointer ">
              <span className="text-blue-200">House</span>Dreamer
            </h1>
          </Link>
        </div>

        <form className="bg-white w-80 max-lg:w-72 max-sm:w-40 flex justify-between px-6 py-2 max-sm:py-[0.15rem] max-lg:py-1 items-center rounded-3xl gap-4">
          <input
            className="placeholder:text-black text-black placeholder:font-normal font-normal w-full focus:outline-none"
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

        <ul className="flex items-center justify-center gap-10 max-lg:gap-7 max-lg:text-base">
          <Link to="/" className="max-md:hidden">
            <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
              Home
            </li>
          </Link>
          <Link to="/about" className="max-md:hidden">
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
      </header>
    </>
  );
}
