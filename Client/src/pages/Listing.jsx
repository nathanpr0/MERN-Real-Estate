import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";

// IMPORT COMPONENTS
import Recommendation from "../components/Recommendation.jsx";
import Contact from "../components/Contact.jsx";

// IMPORT REACT-ICONS
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";
import { FaBed, FaBath, FaMapMarkerAlt, FaParking, FaEnvelope, FaTimes } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";

// IMPORT SWIPER FOR IMAGE SLIDER
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";

// SWIPER STYLING
import "swiper/css/bundle";
import "swiper/css/navigation";

export default function Listing() {
  SwiperCore.use({ Navigation, Pagination });

  // CONTACT LANDLORD BUTTON
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const toggleContactForm = () => {
    setIsContactFormVisible(!isContactFormVisible);
  };

  // USER PERSIST ACCOUNT
  const { currentUser } = useSelector((state) => state.user);

  // LISTING ID FROM ROUTER
  const params = useParams();
  const listingid = params.listingid;

  // USER LISTINGS DATA
  const [userListing, setUserListing] = useState("");
  const [landLord, setLandLord] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageError, setError] = useState(false);

  // EMAIL FUNCTIONALITY TO CONTACK LANDLORD
  const [loadingMessage, setLoadingMessage] = useState(false);
  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      setLoadingMessage(true);

      // EMAILJS CONFIG
      const EMAIL_SERVICE = import.meta.env.VITE_EMAIL_SERVICE_ID;
      const EMAIL_TEMPLATE = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
      const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

      if (!EMAIL_SERVICE || !EMAIL_TEMPLATE || !EMAIL_PUBLIC_KEY) {
        throw new Error("EmailJS configuration is missing");
      }

      await emailjs.send(
        EMAIL_SERVICE,
        EMAIL_TEMPLATE,
        {
          listing_name: userListing.name,
          to_name: landLord.username,
          from_name: currentUser.username,
          message,
          to_email: landLord.email,
          from_email: currentUser.email,
        },
        {
          publicKey: EMAIL_PUBLIC_KEY,
        }
      );

      setLoadingMessage(false);
      toast.success("Email Message is Successfully", { position: "bottom-left" });

      return;
    } catch (error) {
      setLoadingMessage(false);
      toast.error("Error during Sending email", { position: "bottom-left" });
      console.error("Error sending email:", error);

      return;
    }
  };

  useEffect(() => {
    async function fetchUserListing() {
      try {
        setLoading(true);

        const response = await axios.get(
          import.meta.env.VITE_MAIN_PAGE_LISTING_DETAILS + listingid,
          {
            withCredentials: true,
          }
        );
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
  }, [listingid]);

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
          <main className="flex flex-col gap-14 max-sm:m-0 px-14 max-lg:px-5 max-sm:px-3 py-10">
            <section className="flex max-lg:flex-col justify-between bg-white rounded-lg shadow-lg shadow-gray-400">
              {/* IMAGES SLIDER */}
              <figure className="w-1/2 bg-black max-lg:w-full">
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
                        style={{
                          background: `url(${image}) center no-repeat`,
                          backgroundSize: "cover",
                          opacity: 0.9,
                        }}
                      ></div>
                    </SwiperSlide>
                  ))}

                  <div className="prev-slide absolute z-10 p-1 bg-sky-600 text-white lg:group-hover:left-0 lg:-left-full left-0 transition-all duration-300 top-2/4 cursor-pointer">
                    <IoMdArrowRoundBack className="w-6 h-6" />
                  </div>
                  <div className="next-slide absolute z-10 p-1 bg-sky-600 text-white lg:group-hover:right-0 lg:-right-full right-0 transition-all duration-300 top-2/4 cursor-pointer">
                    <IoMdArrowRoundForward className="w-6 h-6" />
                  </div>
                  <div className="pagination absolute z-10 lg:group-hover:bottom-1 lg:-bottom-full bottom-1 transition-all duration-300 text-center"></div>
                </Swiper>
              </figure>

              {/* DESCRIPTION */}
              <article className="flex flex-col justify-between w-1/2 max-lg:w-full p-6 overflow-y-auto">
                <div className="flex flex-col gap-2 justify-start mb-2">
                  <div className="inline-flex flex-row items-center gap-2">
                    <img
                      src={userListing.created_by_user.avatar}
                      alt="user_avatar"
                      height={10}
                      width={30}
                      className="rounded-full object-cover text-center"
                    />
                    <p className="text-gray-700 font-semibold">
                      {userListing.created_by_user.username}
                    </p>
                  </div>

                  <h2 className="text-2xl font-semibold">{userListing.name}</h2>

                  <p className="text-sm font-semibold flex flex-wrap items-center gap-y-2">
                    <span className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 mr-1">
                      {userListing.types}
                    </span>

                    <span className="bg-green-100 text-green-800 rounded-md px-2 py-1 mr-1">
                      {userListing.lot}
                    </span>

                    {userListing.offer && (
                      <span className="flex flex-row items-center ml-1 gap-x-1 bg-red-100 text-red-800 rounded-md px-2 py-1">
                        Offer <GoChecklist className="w-4 h-4" />
                      </span>
                    )}

                    {userListing.furnished && (
                      <span className="flex flex-row items-center ml-1 gap-x-1 bg-yellow-100 text-yellow-800 rounded-md px-2 py-1">
                        Furnished <GiSofa className="w-4 h-4" />
                      </span>
                    )}

                    {userListing.parking && (
                      <span className="flex flex-row items-center ml-1 gap-x-1 bg-purple-100 text-purple-800 rounded-md px-2 py-1">
                        Parking Spot <FaParking className="w-4 h-4" />
                      </span>
                    )}
                  </p>
                </div>

                <p className="text-lg mb-5">{userListing.description}</p>

                <div className="flex flex-col gap-x-3">
                  <section className="flex flex-row items-center gap-x-2 mb-3">
                    <FaMapMarkerAlt className="text-gray-600 w-5 h-5" />
                    <p className="text-gray-600">{userListing.address}</p>
                  </section>

                  <section className="flex flex-row flex-wrap justify-between gap-2 px-4">
                    <div className="flex flex-row gap-x-3">
                      <div className="flex flex-row gap-x-2">
                        <p className="text-sm">{userListing.bedrooms}</p>
                        <FaBed className="text-gray-600 w-5 h-5" />
                      </div>

                      <div className="flex flex-row gap-x-3">
                        <p className="text-sm">{userListing.bathrooms}</p>
                        <FaBath className="text-gray-600 w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex flex-row gap-x-3">
                      <p className="text-sm">
                        Price:{" "}
                        <span className="font-bold text-gray-800">
                          Rp. {new Intl.NumberFormat("id-ID").format(userListing.regularPrice)}
                        </span>
                      </p>
                      {userListing.offer && (
                        <p className="text-sm">
                          Discount:{" "}
                          <span className="font-bold text-gray-800">
                            Rp. {new Intl.NumberFormat("id-ID").format(userListing.discountPrice)}
                          </span>
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </article>
            </section>

            {/* CONTACT LANDLORD */}
            {currentUser && userListing.created_by_user !== currentUser._id && (
              <>
                <button
                  type="button"
                  onClick={toggleContactForm}
                  className="fixed bottom-5 right-12 bg-sky-600 text-white p-3 rounded-full shadow-lg z-50"
                >
                  {isContactFormVisible ? <FaTimes size={20} /> : <FaEnvelope size={20} />}
                </button>
                {isContactFormVisible && (
                  <section className="fixed bottom-20 right-20 bg-white rounded-lg shadow-lg shadow-gray-400 p-6 z-50 w-80">
                    <h3 className="text-xl font-semibold text-center mb-4">Contact Landlord</h3>

                    <form method="post" className="flex flex-col gap-4" onSubmit={sendEmail}>
                      <Contact
                        landLord_listing={userListing}
                        stateLandLord={landLord}
                        actionLandLord={setLandLord}
                      />

                      <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 mb-2">Message</span>
                        <textarea
                          id="message"
                          name="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="shadow-md border-solid border-sky-600 border-2 rounded p-2 focus:outline-sky-800"
                          rows={5}
                          placeholder="Enter your message here..."
                          required
                        ></textarea>
                      </label>

                      <button
                        type="submit"
                        className="bg-sky-600 text-white text-center rounded-md p-2 font-semibold hover:bg-sky-700 transition-all"
                      >
                        {loadingMessage ? "Loading..." : "Send Message"}
                      </button>
                    </form>
                  </section>
                )}
              </>
            )}
          </main>
        )
      )}

      <Recommendation fetchListing={import.meta.env.VITE_MAIN_RECOMMEND_LISTING + listingid} />
    </>
  );
}
