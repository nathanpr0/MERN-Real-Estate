import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  // FORM STATE VALUE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SUBMIT TO CREATE AN ACCOUNT
  async function handleSubmit(e) {
    e.preventDefault();

    switch (true) {
      case email === "":
        toast.info("Harap masukkan alamat Email!");
        return;

      case password === "":
        toast.info("Jangan lupa masukkan Password!");
        return;

      default:
        try {
          setLoading(true);

          await axios.post("http://localhost:3000/api/auth/signin", {
            email: email,
            password: password,
          });

          toast.success("Account Successfully Log In");
          setLoading(false);
          navigate("/");
        } catch (error) {
          setLoading(false);
          if (error.response && error.response.status === 404) {
            const {
              error: errorMessage,
              status: errorStatus,
              email: errorEmail,
            } = error.response.data;
            toast.error(errorMessage);
            toast.error("status: " + errorStatus);
            toast.error(errorEmail);
          } else if (error.response && error.response.status === 401) {
            const { error: errorMessage } = error.response.data;
            toast.error(errorMessage);
          } else {
            toast.error(error.message);
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="flex justify-center items-center mt-4">
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
