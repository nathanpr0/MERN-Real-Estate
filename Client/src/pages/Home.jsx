// IMPORT PAGES
import Recommendation from "../components/Recommendation.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const FETCH_LISTING_MAIN = String(import.meta.env.VITE_MAIN_PAGE_LISTING);

  return (
    <>
      <div
        className="h-screen selection:bg-white selection:bg-opacity-80 selection:text-gray-700"
        style={{
          background: `linear-gradient(90deg, rgb(3, 106, 161), rgba(3, 105, 161, 0.7), rgba(3, 105, 161, 0.8), rgb(3, 106, 161)),
                      url("Banner.webp")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* LEFT CONTAINER */}
        <section className="w-2/4 max-lg:w-full max-lg:text-center h-full flex flex-col justify-center float-left p-10">
          <h1 className="text-6xl max-lg:text-5xl max-md:text-6xl max-sm:text-5xl font-bold mb-4 text-white">
            Temukan Rumah Impian Anda
          </h1>
          <p className="text-md md:text-lg text-white mt-4">
            Kami membantu Anda menemukan rumah yang sempurna sesuai dengan kebutuhan dan anggaran
            Anda. Jelajahi koleksi properti kami yang beragam dan temukan tempat yang bisa Anda
            sebut rumah.
          </p>
        </section>

        {/* RIGHT CONTAINER */}
        <section className="overflow-hidden w-2/4 h-full flex max-lg:hidden flex-row justify-center items-center gap-x-6 max-lg:gap-x-3">
          <figure className="flex flex-col gap-y-4">
            <img
              src="banner_potrait_1.webp"
              alt="banner_potrait_1"
              className="object-cover rounded-lg"
              width="500"
              height="600"
              loading="eager"
            />

            <img
              src="banner_potrait_2.webp"
              alt="banner_potrait_2"
              className="object-cover rounded-lg"
              width="500"
              height="600"
              loading="eager"
            />
          </figure>

          <figure className="flex flex-col gap-y-4">
            <img
              src="banner_potrait_3.webp"
              alt="banner_potrait_3"
              className="object-cover rounded-lg"
              width="500"
              height="600"
              loading="eager"
            />

            <img
              src="banner_potrait_4.webp"
              alt="banner_potrait_4"
              className="object-cover rounded-lg filter brightness-125"
              width="500"
              height="600"
              loading="eager"
            />
          </figure>
        </section>
      </div>
      <div className="bg-white pt-5 pb-14 px-4">
        <h1 className="text-4xl max-sm:text-2xl text-gray-700 text-center font-semibold mb-16">
          Sponsored By Companies
        </h1>

        <section className="flex flex-row flex-wrap gap-4 justify-evenly items-center">
          <img
            src="Intiland.webp"
            alt="Intiland.logo"
            className="h-16 max-sm:h-12"
            loading="eager"
          />
          <img
            src="Seven Stones.webp"
            alt="Seven Stones.logo"
            className="h-16 max-sm:h-12"
            loading="eager"
          />
          <img
            src="LeksnCo-15th.webp"
            alt="LeksnCo-15th.logo"
            className="h-16 max-sm:h-12"
            loading="eager"
          />
          <img src="elevee.webp" alt="elevee.logo" className="h-16 max-sm:h-12" loading="eager" />
        </section>
      </div>
      <Recommendation fetchListing={FETCH_LISTING_MAIN} />
      <Footer />
    </>
  );
}
