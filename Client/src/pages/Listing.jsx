import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";

// IMPORT SWIPER FOR IMAGE SLIDER
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";

// SWIPER STYLING
import "swiper/css/bundle";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Listing() {
  SwiperCore.use({ Navigation, Pagination });

  const params = useParams();

  const [userListing, setUserListing] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageError, setError] = useState(false);

  useEffect(() => {
    async function fetchUserListing() {
      try {
        setLoading(true);
        const listingid = params.listingid;

        const response = await axios.get(import.meta.env.VITE_GET_LISTING + listingid, {
          withCredentials: true,
        });
        setUserListing(response.data);
        setLoading(false);
        setError(false);

        return;
      } catch (error) {
        setLoading(false);
        setError(true);
        toast.error(error.message);

        return;
      }
    }

    fetchUserListing();
  }, [params.listingid]);

  return (
    <>
      {loading ? (
        <p className="text-sky-600 text-lg text-center font-semibold mb-5">Page is Loading...</p>
      ) : pageError ? (
        <p className="text-red-600 text-lg text-center font-semibold mb-5">
          Page is Error something is Wrong!
        </p>
      ) : (
        userListing && (
          <main className="container m-auto max-sm:m-0 px-7 max-sm:px-4 py-10">
            <section className="flex max-lg:flex-col justify-between bg-white rounded-lg shadow-lg shadow-gray-400 overflow-hidden">
              {/* IMAGES SLIDER */}
              <figure className="w-1/2 max-lg:w-full">
                <Swiper
                  className="relative group"
                  navigation={{ nextEl: ".next-slide", prevEl: ".prev-slide" }}
                  pagination={{ el: ".pagination", clickable: true }}
                  grabCursor={true}
                  slidesPerView={1}
                  modules={[Navigation, Pagination]}
                >
                  {userListing.imagesURL.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="h-[26rem]"
                        style={{ background: `url(${image}) center no-repeat` }}
                      ></div>
                    </SwiperSlide>
                  ))}

                  <div className="prev-slide absolute z-10 p-1 bg-sky-600 text-white group-hover:left-0 -left-full transition-all duration-300 top-2/4 cursor-pointer">
                    <IoMdArrowRoundBack size={25} />
                  </div>
                  <div className="next-slide absolute z-10 p-1 bg-sky-600 text-white group-hover:right-0 -right-full transition-all duration-300 top-2/4 cursor-pointer">
                    <IoMdArrowRoundForward size={25} />
                  </div>
                  <div className="pagination text-sky-700 absolute z-10 group-hover:bottom-1 -bottom-full transition-all duration-300 text-center"></div>
                </Swiper>
              </figure>

              {/* DESCRIPTION */}
              <article className="flex flex-col justify-between w-1/2 max-lg:w-full p-6 overflow-y-auto">
                <div className="flex flex-col justify-start mb-2">
                  <h2 className="text-2xl font-semibold">{userListing.name}</h2>
                  <p className="text-sm font-semibold flex items-center">
                    {userListing.types} | {userListing.lot} |{" "}
                    {userListing.furnished && (
                      <>
                        Furnished <GoChecklist className="inline mx-1" />
                      </>
                    )}
                    {userListing.parking && (
                      <>
                        | Parking Spot <GoChecklist className="inline ml-1" />
                      </>
                    )}
                    {userListing.offer && (
                      <>
                        | Offer <GoChecklist className="inline ml-1" />
                      </>
                    )}
                  </p>
                </div>

                <p className="text-lg mb-5">{userListing.description}</p>

                <div className="flex flex-col gap-x-3">
                  <section className="flex flex-row items-center gap-x-2 mb-3">
                    <FaMapMarkerAlt className="text-gray-600" />
                    <p className="text-gray-600">{userListing.address}</p>
                  </section>

                  <section className="flex flex-row justify-between gap-2 px-4">
                    <div className="flex flex-row gap-x-3">
                      <div className="flex flex-row gap-x-2">
                        <p className="text-sm">{userListing.bedrooms}</p>
                        <FaBed className="text-xl text-gray-600" />
                      </div>

                      <div className="flex flex-row gap-x-3">
                        <p className="text-sm">{userListing.bathrooms}</p>
                        <FaBath className="text-xl text-gray-600" />
                      </div>
                    </div>

                    <p className="text-sm truncate">
                      Price:{" "}
                      <span className="font-bold text-gray-800">
                        Rp. {new Intl.NumberFormat("id-ID").format(userListing.regularPrice)}
                      </span>
                    </p>

                    {userListing.offer && (
                      <p className="text-sm truncate">
                        Discount Price:{" "}
                        <span className="font-bold text-gray-800">
                          Rp. {new Intl.NumberFormat("id-ID").format(userListing.discountPrice)}
                        </span>
                      </p>
                    )}
                  </section>
                </div>
              </article>
            </section>
          </main>
        )
      )}
    </>
  );
}
