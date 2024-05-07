import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// IMPORT REDUX USER SLICE
import { useDispatch } from "react-redux";
import { signStart, signSuccess, signFailure } from "../app/features/userSlice.js";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleCLick = async () => {
    try {
      dispatch(signStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      const response = await axios.post(
        import.meta.env.VITE_GOOGLE_AUTH,
        {
          username: displayName,
          email: email,
          avatar: photoURL,
        },
        { withCredentials: true }
      );

      toast.success("Account Successfully Log In");
      dispatch(signSuccess(response.data));
      navigate("/");
    } catch (error) {
      dispatch(signFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center my-3">
        <button
          type="button"
          className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleGoogleCLick}
        >
          Akun Google
        </button>
      </div>
    </>
  );
}
