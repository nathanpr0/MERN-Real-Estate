import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "@firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signStart, signSuccess, signFailure } from "../app/features/userSlice.js";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      dispatch(signStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      const response = await axios.post(
        import.meta.env.VITE_GOOGLE_AUTH,
        {
          username: displayName,
          email,
          avatar: photoURL,
        },
        { withCredentials: true }
      );

      toast.success("Account Successfully Logged In");
      dispatch(signSuccess(response.data));
      navigate("/");
    } catch (error) {
      dispatch(signFailure(error.message));
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { displayName, email, photoURL } = user;

        // Save user data in Redux store
        const userData = {
          username: displayName,
          email,
          avatar: photoURL,
        };

        dispatch(signSuccess(userData));
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="flex items-center justify-center my-3">
      <button
        type="button"
        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleGoogleClick}
      >
        Akun Google
      </button>
    </div>
  );
}
