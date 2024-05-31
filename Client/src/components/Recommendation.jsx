import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import propTypes from "prop-types";

// REACT ICONS
import { FaBed, FaBath, FaParking, FaMapMarkerAlt } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";

Recommendation.propTypes = {
  fetchListing: propTypes.string,
};

export default function Recommendation({ fetchListing }) {
  const [listing, setListing] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(false);

  async function fetchListings() {
    try {
      setLoading(true);
      const response = await axios.get(fetchListing);

      setListing(response.data);
      setLoading(false);

      return;
    } catch (error) {
      setError(true);
      if (error.response && error.response.status === 404) {
        console.error(error.response.data);
      } else {
        console.error(error.message);
      }

      return;
    }
  }

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchListing]);

  return (
    <main className="w-full p-14 max-lg:px-5 max-sm:px-3">
      <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
        <h1 className="text-4xl text-gray-700 text-center font-semibold mb-10">Recommendation</h1>

        {loading ? (
          <p className="text-sky-600 text-lg text-center font-semibold mb-5">Page is Loading...</p>
        ) : err ? (
          <p className="text-red-600 text-lg text-center font-semibold mb-5">
            Error Response Fetching Listings!
          </p>
        ) : listing.length < 1 ? (
          <p className="text-green-600 text-lg text-center font-semibold mb-5">
            Mohon maaf Tidak ada penawaran lagi
          </p>
        ) : (
          listing.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 selection:bg-white selection:bg-opacity-80 selection:text-gray-700">
              {listing.map((value) => (
                <section
                  key={value._id}
                  className="flex flex-col justify-between bg-sky-700 rounded-3xl text-white shadow-lg shadow-gray-400"
                >
                  <figure className="relative bg-black rounded-3xl">
                    <img
                      src={value.imagesURL[0]}
                      className="relative h-52 w-full object-cover rounded-3xl opacity-70"
                    />
                  </figure>

                  <article className="flex flex-col mb-4 px-5 pt-4 pb-2 h-full">
                    <section className="overflow-hidden">
                      <h2 className="text-xl font-bold text-white truncate">{value.name}</h2>

                      <p className="text-sm font-semibold bg-white text-gray-700 rounded-md px-2 inline-block mr-2">
                        {value.types}
                      </p>

                      <p className="text-sm font-semibold bg-emerald-300 text-gray-700 rounded-md px-2 inline-block mr-2">
                        {value.lot}
                      </p>

                      {value.furnished && (
                        <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-fuchsia-300 text-gray-700 rounded-md px-2 mr-2">
                          Furnished <GiSofa />
                        </p>
                      )}

                      {value.parking && (
                        <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-indigo-200 text-gray-700 rounded-md px-2 mr-2">
                          Parking Spot <FaParking />
                        </p>
                      )}

                      {value.offer && (
                        <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-yellow-300 text-gray-700 rounded-md px-2">
                          Offer <GoChecklist />
                        </p>
                      )}
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
