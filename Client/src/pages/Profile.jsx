import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// IMPORT FIREBASE
import { app } from "../firebase.js";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// IMPORT REDUX SLICE
import { useDispatch, useSelector } from "react-redux";
import {
  logOutLoading,
  logOutFinish,
  logOutFailure,
  updateStart,
  updateUserSuccess,
  updateUserFailure,
  deleteStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../app/features/userSlice.js";

// COMPONENTS
import UserProfile from "../components/UserProfile.jsx";
import Listing from "../components/Listing.jsx";
import UserListing from "../components/UserListing.jsx";

export default function Profile() {
  // PROFILE INFORMATION
  const { currentUser: currentAccount, loading } = useSelector((state) => state.user);

  // USER LISTINGS
  const [userListing, setListing] = useState([]);

  // PROFILE IMAGE UPLOAD HANDLING
  const fileRef = useRef(null);
  const [fileImg, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileImgError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});

  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // STATUS PROGRESS UPLOADING A NEW PROFILE IMAGE FILE
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
        console.error({ uploadFailed: error.message });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
          return setFormData({ ...formData, avatar: getDownloadURL });
        });
      }
    );
  }

  useEffect(() => {
    if (fileImg) {
      return handleFileUpload(fileImg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileImg]);

  // UPDATE PROFILE REQUEST
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    username: currentAccount.username,
    email: currentAccount.email,
  });

  const submitUpdateHandle = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      const response = await axios.put(
        String(import.meta.env.VITE_UPDATE_PROFILE + currentAccount._id),
        {
          avatar: formData.avatar,
          username: value.username,
          email: value.email,
        },
        { withCredentials: true }
      );

      dispatch(updateUserSuccess(response.data));
      toast.success(`status=${response.status}:Update Successfully`);

      return;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(updateUserFailure(error.response.data));

        const { error: errorResponse } = error.response.data;
        toast.error(errorResponse);

        return;
      } else if (error.response && error.response.status === 403) {
        dispatch(updateUserFailure(error.response.data));

        const { error: errorResponse } = error.response.data;
        toast.error(errorResponse);
        return;
      } else {
        dispatch(updateUserFailure(error.message));
        toast.error(error.message);

        return;
      }
    }
  };

  // HANDLE DELETE USER
  async function handleDelete(e) {
    e.preventDefault();

    const warningSblmDelete = await Swal.fire({
      title: `Apakah Anda yakin ingin menghapus akun ini?`,
      text: "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus akun Anda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, saya ingin menghapusnya",
    });

    if (warningSblmDelete.isConfirmed) {
      try {
        // DELETE ACCOUNT IN PROGRESS
        dispatch(deleteStart());
        const auth = getAuth(app);
        const storage = getStorage(app);
        const user = auth.currentUser;

        // CHECK THE USER ACCOUNT IF REGISTER TO THE FIREBASE AUTH
        // THEN DELETE THE ACCOUNT FROM DATABASE & FIREBASE
        if (user) {
          // HAPUS STORAGE USER
          const imageFileUrls = [];
          for (let i = 0; i < userListing.length; i++) {
            const urls = userListing[i].imagesURL;
            imageFileUrls.push(...urls);
          }
          for (const imageUrl of imageFileUrls) {
            const url = new URL(imageUrl);
            const filePathWithName = decodeURIComponent(
              url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
            );
            console.log(filePathWithName);
            const userRefStorage = ref(storage, filePathWithName);
            await deleteObject(userRefStorage);
          }

          // SESI AUTENTIKASI FIREBASE AUTH DI HENTIKAN DAHULU
          await signOut(auth);
          // LANJUT MENGHAPUS DATA USER DARI AUTH FIREBASE
          await deleteUser(user);

          await axios.delete(import.meta.env.VITE_DELETE_PROFILE + currentAccount._id, {
            withCredentials: true,
          });

          // DELETE ACCOUNT IS SUCCEED
          dispatch(deleteUserSuccess());
          toast.success("Account Is Deleted");
        } else {
          throw new Error("Mohon melakukan login Ulang, Server Error!");
        }

        return;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(deleteUserFailure(error.response.data));

          const { error: errorResponse } = error.response.data;
          toast.error(errorResponse);

          return;
        } else if (error.response && error.response.status === 403) {
          dispatch(deleteUserFailure(error.response.data));

          const { error: errorResponse } = error.response.data;
          toast.error(errorResponse);
          return;
        } else {
          dispatch(deleteUserFailure(error.message));
          toast.error(error.message);

          return;
        }
      }
    }
  }

  // SIGN OUT HANDLE FUNCTION
  async function handleSignOut(e) {
    e.preventDefault();

    try {
      dispatch(logOutLoading());

      // SIGN OUT USER FIREBASE AUTH
      const auth = getAuth(app);
      if (auth.currentUser) {
        await signOut(auth);
      }

      // SIGN OUT USER FROM DATABASE
      await axios.get(import.meta.env.VITE_SIGN_OUT_API, { withCredentials: true });

      dispatch(logOutFinish());
      toast.success("User has been Logged Out!");

      return;
    } catch (error) {
      dispatch(logOutFailure(error.message));
      toast.error(error.message);

      return;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 p-14 lg:flex-row max-sm:px-3 justify-center items-start min-h-screen bg-gray-100">
        {/* LEFT CONTAINER */}
        <form
          onSubmit={submitUpdateHandle}
          className="w-[30vw] max-lg:w-full bg-white p-10 rounded-lg shadow-lg shadow-gray-400 flex-shrink-0"
        >
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <img
            src={formData.avatar || currentAccount.avatar}
            alt="Profile"
            className="rounded-full mx-auto mb-8 cursor-pointer h-[6rem] object-cover text-center"
            onClick={() => fileRef.current.click()}
          />
          {fileImgError ? (
            <p className="text-red-600 text-sm text-center mb-5">Error during Image Upload</p>
          ) : filePerc > 0 && filePerc < 100 ? (
            <p className="text-green-600 text-sm text-center mb-5">
              Uploading Progress: {filePerc}%
            </p>
          ) : (
            filePerc === 100 && (
              <p className="text-sky-600 text-sm text-center mb-5">Image Upload Successful</p>
            )
          )}

          {/* UserProfile COMPONENT */}
          <UserProfile
            usernameData={currentAccount.username}
            emailData={currentAccount.email}
            usernameOnChange={(e) => setValue({ ...value, username: e.target.value })}
            emailOnChange={(e) => {
              setValue({ ...value, email: e.target.value });
            }}
          />

          <div className="mt-6">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 rounded text-white text-base max-sm:text-sm font-semibold p-2"
            >
              {loading ? "Loading..." : "Update Account"}
            </button>
          </div>

          <div className="flex justify-between items-center mt-3">
            <button
              onClick={handleSignOut}
              className="text-sky-600 hover:text-sky-700 text-sm max-sm:text-xs font-bold p-2"
            >
              Sign Out
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm max-sm:text-xs font-bold p-2"
            >
              Delete Account
            </button>
          </div>
        </form>

        <Listing />
      </div>

      <UserListing userListing={userListing} setListing={setListing} />
    </>
  );
}
