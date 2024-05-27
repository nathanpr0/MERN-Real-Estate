import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// REACT ICONS
import { FaBed, FaBath, FaPencilAlt, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

// IMPORT FIREBASE
import { app } from "../firebase.js";
import { getStorage, ref, deleteObject } from "firebase/storage";

import propTypes from "prop-types";

UserListing.propTypes = {
  userListing: propTypes.array,
  setListing: propTypes.func,
};

export default function UserListing({ userListing, setListing }) {
  const { currentUser: currentAccount } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchListingUser() {
      try {
        setLoading(true);
        const response = await axios.get(import.meta.env.VITE_USER_LISTING + currentAccount._id, {
          withCredentials: true,
        });
        setListing(response.data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }

    fetchListingUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount._id]);

  // HANDLE DELETE LISTINGS
  /**
   *
   * @param {string} listingId
   * @param {String[]} imageurl
   */
  async function handleDeleteListing(listingId, imageurl) {
    try {
      setLoading(true);

      // PARSING URL UNTUK MENDAPATKAN PATH STORAGE DARI URL FIREBASE
      const storage = getStorage(app);
      for (let i = 0; i < imageurl.length; i++) {
        const url = new URL(imageurl[i]);
        const filePathWithName = decodeURIComponent(
          url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        );

        // DELETE FIREBASE FILE STORAGE
        const fileRef = ref(storage, `${filePathWithName}`);
        await deleteObject(fileRef);
      }

      // DELETE LISTING FROM DATABASE
      await axios.delete(import.meta.env.VITE_DELETE_LISTING + listingId, {
        withCredentials: true,
      });

      // DELETE LISTING UI WITH FILTER
      setListing(userListing.filter((listing) => listing._id !== listingId));
      setLoading(false);

      toast.success("Listing Berhasil Di Hapus");

      return;
    } catch (error) {
      setLoading(false);
      toast.error(error.message);

      return;
    }
  }

  return (
    <main className="bg-gray-100 w-full p-14 max-lg:px-5 max-sm:px-3 selection:bg-white selection:bg-opacity-80 selection:text-gray-700">
      <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
        <h1 className="text-4xl text-gray-700 text-center font-semibold mb-10">Daftar Listing</h1>

        {loading ? (
          <p className="text-sky-600 text-lg text-center font-semibold mb-5">Page is Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-lg text-center font-semibold mb-5">
            Error Response Fetching User Listings!
          </p>
        ) : userListing.length < 1 ? (
          <p className="text-green-600 text-lg text-center font-semibold mb-5">
            Anda belum membuat Listing
          </p>
        ) : (
          userListing.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListing.map((value) => (
                <section
                  key={value._id}
                  className="flex flex-col justify-between bg-sky-700 rounded-3xl text-white shadow-lg shadow-gray-400"
                >
                  <figure className="relative bg-black rounded-3xl">
                    <img
                      src={value.imagesURL[0]}
                      className="relative h-52 w-full object-cover rounded-3xl opacity-60"
                    />

                    <div className="w-full absolute top-5 flex flex-row justify-between px-5">
                      <FaTrash
                        onClick={() => handleDeleteListing(value._id, value.imagesURL)}
                        className="text-white text-xl cursor-pointer"
                      />
                      <Link to={`/updatelisting/${value._id}`}>
                        <FaPencilAlt className="text-white text-xl cursor-pointer" />
                      </Link>
                    </div>
                  </figure>

                  <article className="flex flex-col mb-4 px-5 pt-4 pb-2 h-full">
                    <section className="overflow-hidden">
                      <h2 className="text-xl font-bold text-white truncate">{value.name}</h2>
                      <p className="text-sm font-semibold">
                        {value.types} | {value.lot}
                      </p>
                    </section>

                    <p className="text-sm pt-3 text-white line-clamp-2">{value.description}</p>
                  </article>

                  <article className="flex justify-end items-center px-5 pb-4">
                    <Link to={`/listing/${value._id}`} className="flex gap-x-2">
                      <p className="text-sm text-white font-semibold">Baca Selengkapnya</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        width="20"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="#ffffff"
                          d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
                        />
                      </svg>
                    </Link>
                  </article>

                  <article className="px-5 py-3 border-solid border-white border-t-2">
                    <div className="flex flex-row items-center gap-x-1 mb-3">
                      <FaMapMarkerAlt size={25} />
                      <p className="text-sm text-white truncate">{value.address}</p>
                    </div>

                    <div className="flex flex-row justify-between gap-x-3">
                      <section className="flex gap-2">
                        <p className="text-sm font-bold text-white">{value.bedrooms}</p>
                        <FaBed className="text-xl text-white" />
                        <p className="text-sm font-bold text-white">{value.bathrooms}</p>
                        <FaBath className="text-xl text-white" />
                      </section>

                      <p className="text-sm text-white truncate">
                        Price:{" "}
                        <span className="font-bold">
                          Rp. {new Intl.NumberFormat("id-ID").format(value.regularPrice)}
                        </span>
                      </p>
                    </div>
                  </article>
                </section>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
