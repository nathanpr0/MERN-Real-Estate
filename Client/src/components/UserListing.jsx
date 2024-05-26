import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaBed, FaBath, FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <main className="bg-gray-100 w-full p-14 max-sm:px-3 selection:bg-white selection:bg-opacity-80 selection:text-gray-700">
      <div className="bg-white p-10 rounded-lg shadow-lg shadow-gray-400">
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
                  <figure className="relative bg-black rounded-3xl ">
                    <img
                      src={value.imagesURL[0]}
                      className="relative h-52 w-full object-cover rounded-3xl opacity-60"
                    />

                    <div className="w-full absolute top-5 flex flex-row justify-between px-5">
                      <FaTrash
                        onClick={() => handleDeleteListing(value._id, value.imagesURL)}
                        className="text-xl cursor-pointer"
                      />
                      <Link to={`/updatelisting/${value._id}`}>
                        <FaPencilAlt className="text-xl cursor-pointer" />
                      </Link>
                    </div>
                  </figure>

                  <article className="flex flex-col px-5 pt-4 pb-6 h-full">
                    <section className="mb-3 overflow-hidden">
                      <h2 className="text-xl font-bold">{value.name}</h2>
                      <p className="text-sm pt-3">{value.description}</p>
                    </section>
                  </article>

                  <article className="px-5 py-3 border-solid border-white border-t-2">
                    <div className="flex flex-row justify-between gap-x-3">
                      <section className="flex gap-2">
                        <p className="text-sm font-bold">{value.bedrooms}</p>
                        <FaBed className="text-xl" />
                        <p className="text-sm font-bold">{value.bathrooms}</p>
                        <FaBath className="text-xl" />
                      </section>

                      <p className="text-sm">
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
