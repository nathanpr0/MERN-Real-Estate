import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// REACT ICONS
import { FaBed, FaBath, FaParking, FaMapMarkerAlt } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";

export default function Search() {
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);

  // SEARCH STATUS QUERY
  const [searchStatus, setSearchStatus] = useState({
    searchTerm: "",
    types: false,
    lot: false,
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  // LISTING FETCH
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState([]);

  // SEARCH HANDLE CHANGE
  function handleSearchChange(e) {
    // SEARCH INPUT
    if (e.target.id === "searchTerm") {
      setSearchStatus({ ...searchStatus, searchTerm: e.target.value });
    }

    // TYPES INPUT
    if (e.target.id === "Jual" || e.target.id === "Sewa") {
      setSearchStatus({
        ...searchStatus,
        types: searchStatus.types === e.target.id ? false : e.target.id,
      });
    }

    // LOT INPUT
    if (e.target.id === "Rumah" || e.target.id === "Apartemen") {
      setSearchStatus({
        ...searchStatus,
        lot: searchStatus.lot === e.target.id ? false : e.target.id,
      });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setSearchStatus({
        ...searchStatus,
        [e.target.id]: e.target.id === e.target.checked ? false : e.target.checked,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSearchStatus({ ...searchStatus, sort, order });
    }

    return;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchStatus.searchTerm);
    urlParams.set("types", searchStatus.types);
    urlParams.set("lot", searchStatus.lot);
    urlParams.set("parking", searchStatus.parking);
    urlParams.set("furnished", searchStatus.furnished);
    urlParams.set("offer", searchStatus.offer);
    urlParams.set("sort", searchStatus.sort);
    urlParams.set("order", searchStatus.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

    return;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // RESULT SEARCH QUERY URL
    const searchTermUrl = urlParams.get("searchTerm");
    const typesUrl = urlParams.get("types");
    const lotUrl = urlParams.get("lot");
    const parkingUrl = urlParams.get("parking");
    const furnishedUrl = urlParams.get("furnished");
    const offerUrl = urlParams.get("offer");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");

    if (
      searchTermUrl ||
      typesUrl ||
      lotUrl ||
      parkingUrl ||
      furnishedUrl ||
      offerUrl ||
      sortUrl ||
      orderUrl
    ) {
      setSearchStatus({
        searchTerm: searchTermUrl || "",
        types: typesUrl || false,
        lot: lotUrl || false,
        parking: parkingUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        offer: offerUrl === "true" ? true : false,
        sort: sortUrl || "createdAt",
        order: orderUrl || "desc",
      });
    }

    async function fetchListings() {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const response = await axios.get(`${import.meta.env.VITE_SEARCH_API}?${searchQuery}`);

        setListing(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);

        return;
      }
    }

    fetchListings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <div className="h-full flex lg:flex-row flex-col items-start lg:gap-5 gap-8 p-10 max-lg:px-5 max-sm:px-3">
        {/* LEFT CONTAINER SEARCH CONFIG */}
        <section className="lg:sticky lg:top-[5.5rem] lg:w-[30vw] w-full bg-white rounded-lg shadow-lg shadow-gray-400 p-10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="searchTerm" className="text-gray-700 font-medium text-md">
                Search Term
              </label>
              <input
                id="searchTerm"
                name="searchTerm"
                type="search"
                autoComplete="off"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-1 focus:outline-none"
                placeholder={focus ? "" : "Search..."}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={searchStatus.searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="sort_order" className="text-gray-700 font-medium text-md">
                Sort
              </label>
              <select
                id="sort_order"
                name="sort_order"
                className="w-full cursor-pointer shadow-md border-solid border-sky-600 border-2 rounded px-4 py-1 focus:outline-none"
                defaultValue={"created_at_desc"}
                onChange={handleSearchChange}
              >
                <option value={"createdAt_desc"}>Latest</option>
                <option value={"createdAt_asc"}>Oldest</option>
                <option value={"regularPrice_desc"}>Price High to Low</option>
                <option value={"regularPrice_asc"}>Price Low to High</option>
              </select>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium text-md">Type</p>

              <div className="grid grid-cols-2 gap-3 p-3 mb-2">
                {/* Checkbox 1 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Jual"
                    id="Jual"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.types === "Jual"}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="Jual" className="text-sm font-medium text-gray-700 ">
                    Jual
                  </label>
                </div>

                {/* Checkbox 2 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Sewa"
                    id="Sewa"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.types === "Sewa"}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="Sewa" className="text-sm font-medium text-gray-700 ">
                    Sewa
                  </label>
                </div>

                {/* Checkbox 3 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="offer"
                    id="offer"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.offer}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="offer" className="text-sm font-medium text-gray-700 ">
                    Offer
                  </label>
                </div>
              </div>

              <p className="text-gray-700 font-medium text-md">Lot</p>
              <div className="grid grid-cols-2 gap-3 p-3 mb-2">
                {/* Checkbox 4 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Rumah"
                    id="Rumah"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.lot === "Rumah"}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="Rumah" className="text-sm font-medium text-gray-700 ">
                    Rumah
                  </label>
                </div>

                {/* Checkbox 5 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="Apartemen"
                    id="Apartemen"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.lot === "Apartemen"}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="Apartemen" className="text-sm font-medium text-gray-700 ">
                    Apartemen
                  </label>
                </div>
              </div>

              <p className="text-gray-700 font-medium text-md">Facility</p>
              <div className="grid grid-cols-2 gap-3 p-3 mb-2">
                {/* Checkbox 6 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    id="parking"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.parking}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="parking" className="text-sm font-medium text-gray-700 ">
                    Parking Spot
                  </label>
                </div>

                {/* Checkbox 7 */}
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    name="furnished"
                    id="furnished"
                    className="h-6 w-6 shadow-md cursor-pointer"
                    checked={searchStatus.furnished}
                    onChange={handleSearchChange}
                  />
                  <label htmlFor="furnished" className="text-sm font-medium text-gray-700 ">
                    Furnished
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 rounded text-white text-base max-sm:text-sm font-semibold mt-4 p-2"
            >
              {loading ? "Loading" : "Search"}
            </button>
          </form>
        </section>

        {/* RIGHT CONTAINER SEARCH RESULT */}
        <section className="lg:w-[70vw] w-full bg-white rounded-lg shadow-lg shadow-gray-400 py-10 sm:px-10 px-4">
          {loading ? (
            <h1 className="text-green-600 text-4xl max-sm:text-2xl text-center font-semibold">
              Page Is Loading...
            </h1>
          ) : !loading && error ? (
            <h1 className="text-red-600 text-4xl max-sm:text-2xl text-center font-semibold">
              Error Fetching the Result!
            </h1>
          ) : !loading && !error && listing.length === 0 ? (
            <h1 className="text-4xl max-sm:text-2xl text-center text-green-600 font-semibold">
              Result not Found!
            </h1>
          ) : (
            !loading &&
            !error &&
            listing.length > 0 && (
              <>
                <h1 className="text-4xl max-sm:text-2xl text-center text-gray-700 font-semibold mb-8">
                  Searching Result
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 selection:bg-white selection:bg-opacity-80 selection:text-gray-700">
                  {listing.map((value) => (
                    <section
                      key={value._id}
                      className="flex flex-col justify-between bg-sky-700 rounded-3xl text-white shadow-lg shadow-gray-400"
                    >
                      <figure className="relative bg-black rounded-3xl">
                        <img
                          src={value.imagesURL[0]}
                          className="relative h-52 w-full object-cover rounded-3xl opacity-60"
                        />
                      </figure>

                      <article className="flex flex-col mb-4 px-5 pt-4 pb-2 h-full">
                        <section>
                          <div className="inline-flex flex-row items-center gap-2 bg-white rounded-full px-2">
                            <img
                              src={value.created_by_user.avatar}
                              alt="user_avatar"
                              height={10}
                              width={20}
                              className="rounded-full object-cover text-center"
                            />
                            <p className="text-gray-700 font-semibold">
                              {value.created_by_user.username}
                            </p>
                          </div>

                          <h2 className="text-xl font-bold text-white truncate">{value.name}</h2>

                          <p className="text-sm font-semibold bg-white text-gray-700 rounded-md px-2 inline-block mr-2">
                            {value.types}
                          </p>

                          <p className="text-sm font-semibold bg-emerald-300 text-gray-700 rounded-md px-2 inline-block mr-2">
                            {value.lot}
                          </p>

                          {value.offer && (
                            <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-yellow-300 text-gray-700 rounded-md px-2 mr-2">
                              Offer <GoChecklist className="w-4 h-4" />
                            </p>
                          )}

                          {value.furnished && (
                            <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-fuchsia-300 text-gray-700 rounded-md px-2 mr-2">
                              Furnished <GiSofa className="w-4 h-4" />
                            </p>
                          )}

                          {value.parking && (
                            <p className="inline-flex items-center gap-x-1 text-sm font-semibold bg-indigo-200 text-gray-700 rounded-md px-2 mr-2">
                              Parking Spot <FaParking className="w-4 h-4" />
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
                          <FaMapMarkerAlt className="w-6 h-6" />
                          <p className="text-sm text-white truncate">{value.address}</p>
                        </div>

                        <div className="flex flex-row justify-between gap-x-3">
                          <section className="flex gap-2">
                            <p className="text-sm font-bold text-white">{value.bedrooms}</p>
                            <FaBed className="w-5 h-5 text-white" />
                            <p className="text-sm font-bold text-white">{value.bathrooms}</p>
                            <FaBath className="w-5 h-5 text-white" />
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
              </>
            )
          )}
        </section>
      </div>
    </>
  );
}
