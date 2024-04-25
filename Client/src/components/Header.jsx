import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <>
      <header className="flex items-center justify-around bg-blue-800 text-white font-bold h-[13vh]">
        <div>
          <Link to="/">
            <h1 className="lg:text-[2.1rem] sm:text-xl cursor-pointer ">
              <span className="text-blue-100">House</span>Dreamer
            </h1>
          </Link>
        </div>

        <form className="bg-white lg:w-80 sm:w-64 flex justify-between px-6 lg:py-2 sm:py-1 items-center rounded-3xl gap-4">
          <input
            className="placeholder:text-black text-black placeholder:font-normal font-normal w-full focus:outline-none"
            type="search"
            name="search"
            id="search"
            autoComplete="off"
            placeholder="Search"
          ></input>
          <FaSearch className="text-gray-500" />
        </form>

        <ul className="lg:flex items-center gap-10 sm:hidden ">
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
              Sign In
            </li>
          </Link>
        </ul>
      </header>
    </>
  );
}
