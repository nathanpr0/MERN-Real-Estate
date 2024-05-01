import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// IMPORT REDUX USER SLICE
import { useDispatch } from "react-redux";
import { signStart, signSuccess, signFailure } from "../app/features/userSlice.js";

// IMPORT GOOGLE AUTH COMPONENT
import OAuth from "../components/OAuth.jsx";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  // FORM STATE VALUE
  const [value, setOnChange] = useState({
    username: "",
    email: "",
    password: "",
  });

  // SUBMIT TO CREATE AN ACCOUNT
  async function handleSubmit(e) {
    e.preventDefault();

    switch (true) {
      case value["username"] === "":
        toast.info("Harap masukkan Username!");
        return;

      case value["email"] === "":
        toast.info("Harap masukkan alamat Email!");
        return;

      case value["password"] === "":
        toast.info("Jangan lupa masukkan Password!");
        return;

      default:
        try {
          setLoading(true);
          dispatch(signStart());

          const response = await axios.post(import.meta.env.VITE_SIGN_UP_API, {
            username: value.username,
            email: value.email,
            password: value.password,
          });

          dispatch(signSuccess(response.data));
          toast.success("Account Successfully Created");
          setLoading(false);

          navigate("/");
        } catch (error) {
          setLoading(false);
          if (error.response && error.response.status === 409) {
            dispatch(signFailure(error.response.data));
            const { error: errorMessage } = error.response.data;
            toast.error(errorMessage);
          } else {
            dispatch(signFailure(error.message));
            toast.error(error.message);
          }
        }
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen py-10">
        <form
          className="w-[60vw] max-sm:w-[80vw] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-2xl font-semibold mb-6">Daftar</h2>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              autoComplete="off"
              value={value["username"]}
              onChange={(e) => setOnChange({ ...value, username: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan alamat email"
              autoComplete="off"
              value={value["email"]}
              onChange={(e) => setOnChange({ ...value, email: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password anda"
              autoComplete="off"
              value={value["password"]}
              onChange={(e) => setOnChange({ ...value, password: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? "Loading..." : "Daftar"}
            </button>
          </div>
          <OAuth />

          <div className="flex justify-center items-center mt-6">
            <p>
              Sudah punya akun? klik
              <Link to={"/sign-in"}>
                <span className="text-sky-500 hover:text-sky-700"> Masuk</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
