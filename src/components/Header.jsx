import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <>
      <header className="flex items-center justify-around bg-blue-800 text-white font-bold h-[13vh]">
        <div>
          <Link to="/">
            <h1 className="lg:text-[2.1rem] sm:text-sm cursor-pointer ">
              <span className="text-blue-100">House</span>Dreamer
            </h1>
          </Link>
        </div>

        <form className="bg-white w-80 flex justify-between px-6 py-2 items-center rounded-3xl gap-4">
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

        <ul className="flex items-center gap-10">
          <Link to="/">
            <li className="lg:inline sm:hidden cursor-pointer">Home</li>
          </Link>
          <Link to="/About">
            <li className="lg:inline sm:hidden cursor-pointer">About</li>
          </Link>
        </ul>
      </header>
    </>
  );
}
