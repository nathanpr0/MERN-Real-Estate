import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// IMPORT REDUX USER SLICE
import { useDispatch } from "react-redux";
import { signStart, signSuccess, signFailure } from "../app/features/userSlice.js";

// IMPORT GOOGLE AUTH COMPONENT
import OAuth from "../components/OAuth.jsx";

// IMPORT FIREBASE AUTH
import { app } from "../firebase.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  // FORM STATE VALUE
  const [value, setOnChange] = useState({
    email: "",
    password: "",
  });

  // SUBMIT TO LOG IN
  async function handleSubmit(e) {
    e.preventDefault();

    switch (true) {
      case value.email === "":
        toast.info("Harap masukkan alamat Email!");
        return;

      case value.password === "":
        toast.info("Jangan lupa masukkan Password!");
        return;

      default:
        try {
          setLoading(true);
          dispatch(signStart());

          // AUTH EMAIL PROVIDER
          const auth = getAuth(app);
          await signInWithEmailAndPassword(auth, value.email, value.password);

          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const { email } = user;

              const response = await axios.post(
                import.meta.env.VITE_SIGN_IN_API,
                {
                  email: email,
                  password: value.password,
                },
                { withCredentials: true }
              );

              toast.success("Account Successfully Log In");
              dispatch(signSuccess(response.data));
              setLoading(false);

              navigate("/");
            }
          });

          return;
        } catch (error) {
          setLoading(false);

          if (error.response && error.response.status === 404) {
            dispatch(signFailure(error.response.data));
            const {
              error: errorMessage,
              status: errorStatus,
              email: errorEmail,
            } = error.response.data;

            toast.error(errorMessage);
            toast.error("status: " + errorStatus);
            toast.error(errorEmail);
          } else if (error.response && error.response.status === 401) {
            dispatch(signFailure(error.response.data));

            const { error: errorMessage } = error.response.data;
            toast.error(errorMessage);
            return;
          } else {
            dispatch(signFailure(error.message));
            toast.error(error.message);
            return;
          }
        }
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-[80vh] pt-10">
        <form
          className="w-[60vw] max-sm:w-[80vw] bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-2xl font-semibold mb-6">Masuk</h2>

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
              value={value.email}
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
              value={value.password}
              onChange={(e) => setOnChange({ ...value, password: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? "Loading..." : "Masuk"}
            </button>
          </div>
          <OAuth />

          <div className="flex justify-center items-center mt-6">
            <p>
              Belum punya Akun? klik
              <Link to={"/sign-up"}>
                <span className="text-sky-500 hover:text-sky-700"> Daftar</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
