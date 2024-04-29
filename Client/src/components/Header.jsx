import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <header className="flex items-center justify-around sticky top-0 w-full selection:bg-white selection:bg-opacity-80 selection:text-gray-700 bg-sky-700 text-white p-4 font-bold h-[12vh] shadow-xl">
        <div>
          <Link to="/">
            <h1 className="text-[2.1rem] max-sm:text-xl max-lg:text-3xl cursor-pointer ">
              <span className="text-blue-200">House</span>Dreamer
            </h1>
          </Link>
        </div>

        <form className="bg-white w-80 max-sm:w-52 max-lg:w-72 flex justify-between px-6 py-2 max-sm:py-[0.15rem] max-lg:py-1 items-center rounded-3xl gap-4">
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
          <FaSearch className="text-gray-500" />
        </form>

        <ul className="flex items-center gap-10 max-lg:gap-7 max-lg:text-base max-sm:hidden ">
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

          <Link to="/sign-in">
            <li className="cursor-pointer border-b-2 border-transparent hover:border-white transition-all duration-200 ease-in-out">
              Masuk
            </li>
          </Link>
        </ul>
      </header>
    </>
  );
}
