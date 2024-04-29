import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  // FORM STATE VALUE
  const [userName, userNameValue] = useState("");
  const [email, emailValue] = useState("");
  const [pw, pwValue] = useState("");

  // SUBMIT TO CREATE AN ACCOUNT
  async function handleSubmit(e) {
    e.preventDefault();

    switch (true) {
      case userName === "":
        toast.info("Harap masukkan Username!");
        return;

      case email === "":
        toast.info("Harap masukkan alamat Email!");
        return;

      case pw === "":
        toast.info("Jangan lupa masukkan Password!");
        return;

      default:
        try {
          setLoading(true);

          await axios.post("http://localhost:3000/api/auth/signup", {
            username: userName,
            email: email,
            password: pw,
          });

          toast.success("Account Successfully Created");
          setLoading(false);
          navigate("/");
        } catch (error) {
          setLoading(false);
          if (error.response && error.response.status === 409) {
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
              value={userName}
              onChange={(e) => userNameValue(e.target.value)}
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
              value={email}
              onChange={(e) => emailValue(e.target.value)}
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
              value={pw}
              onChange={(e) => pwValue(e.target.value)}
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
          <div className="flex justify-center items-center mt-4">
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
