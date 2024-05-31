import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// IMPORT FIREBASE
import { app } from "../firebase.js";
import { getAuth, signOut, deleteUser, updateProfile } from "firebase/auth";
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
import CreateListing from "../components/CreateListing.jsx";
import UserListing from "../components/UserListing.jsx";

export default function Profile() {
  // PROFILE INFORMATION
  const { currentUser: currentAccount, loading } = useSelector((state) => state.user);

  // USER LISTINGS
  const [userListing, setListing] = useState([]);

  // UPDATE PROFILE REQUEST
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    username: currentAccount.username,
    email: currentAccount.email,
  });

  // PROFILE IMAGE UPLOAD HANDLING
  const fileRef = useRef(null);
  const [fileImg, setFile] = useState("");
  const [filePerc, setFilePerc] = useState(0);
  const [fileImgError, setFileError] = useState(false);

  // PAGES STATE DATA
  const [submitFormProfile, setSubmitFormProfile] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFileUpload = (file) => {
    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `images/${uid}/profile/${fileName}`);
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  useEffect(() => {
    if (fileImg) {
      handleFileUpload(fileImg);
    }
  }, [fileImg]);

  // SUBMIT UPDATE FORM PROFILE
  const submitUpdateHandle = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      setSubmitFormProfile(true);
      let backendUpdate;

      // INITIAL FIRBASE AUTH
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        backendUpdate = await axios.put(
          String(import.meta.env.VITE_UPDATE_PROFILE + currentAccount._id),
          {
            avatar: formData.avatar,
            username: value.username,
          },
          { withCredentials: true }
        );
      } catch (error) {
        if (error.response && error.response.status === 401) {
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

      // UPDATE FIREBASE USERNAME
      await updateProfile(user, {
        displayName: value.username,
      });

      dispatch(updateUserSuccess(backendUpdate.data));
      toast.success(`status=${backendUpdate.status}:Update Successfully`);

      return;
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message);

      return;
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

          // LISTINGS IMAGES
          for (const imageUrl of imageFileUrls) {
            const url = new URL(imageUrl);
            const filePathWithName = decodeURIComponent(
              url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
            );
            const userRefStorage = ref(storage, filePathWithName);
            await deleteObject(userRefStorage);
          }

          // PROFILE PICS IMAGES
          if (formData.avatar) {
            const urlAvatar = new URL(formData.avatar);
            const avatarPathWithName = decodeURIComponent(
              urlAvatar.pathname.substring(urlAvatar.pathname.lastIndexOf("/") + 1)
            );
            const avatarRef = ref(storage, avatarPathWithName);
            await deleteObject(avatarRef);
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

  // IF USER NOT SUBMITED UPDATE PROFILE FORM THEN DELETE THE FIREBASE PROFILE PICS
  useEffect(() => {
    const handleBeforeUnloadImageProfile = async (e) => {
      if (!submitFormProfile && formData.avatar) {
        e.preventDefault();
        const storage = getStorage(app);
        const url = new URL(formData.avatar);
        const filePathWithName = decodeURIComponent(
          url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        );
        const fileRef = ref(storage, filePathWithName);
        try {
          await deleteObject(fileRef);
        } catch (error) {
          console.error({ deleteFailed: error.message });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnloadImageProfile);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadImageProfile);
    };
  }, [submitFormProfile, formData.avatar]);

  return (
    <>
      <div className="flex flex-col gap-5 p-14 lg:flex-row max-lg:px-5 max-sm:px-3 justify-center items-start min-h-screen">
        {/* LEFT CONTAINER */}
        <div className="w-[30vw] max-lg:w-full bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400 flex-shrink-0">
          <form onSubmit={submitUpdateHandle} method="post">
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
          </form>

          <div className="flex justify-between items-center mt-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sky-600 hover:text-sky-700 text-sm max-sm:text-xs font-bold p-2"
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm max-sm:text-xs font-bold p-2"
            >
              Delete Account
            </button>
          </div>
        </div>

        <CreateListing />
      </div>

      <UserListing userListing={userListing} setListing={setListing} />
    </>
  );
}
