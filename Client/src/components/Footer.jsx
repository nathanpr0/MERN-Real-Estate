// REACT ICONS
import { IoLogoWhatsapp } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="bg-sky-900 text-white text-center">
        <div className="py-24 px-20 max-sm:px-10">
          <article className="flex flex-col gap-2 mb-7">
            <h1 className="text-3xl font-bold">Follow Us</h1>
            <p className="text-sky-200">
              Kami menawarkan berbagai properti mulai dari apartemen modern hingga vila mewah, semua
              dalam satu tempat. Dengan daftar properti yang luas dan layanan pelanggan yang unggul,
              HouseDreamer membantu menyederhanakan proses pembelian rumah Anda. Temukan rumah
              impian Anda sekarang di HouseDreamer!
            </p>
          </article>
          <article className="flex flex-row gap-7 justify-center mb-7">
            <FaFacebookSquare
              size={35}
              className="hover:text-sky-300 transition-all duration-300 cursor-pointer"
            />
            <FaInstagram
              size={35}
              className="hover:text-sky-300 transition-all duration-300 cursor-pointer"
            />
            <FaLinkedin
              size={35}
              className="hover:text-sky-300 transition-all duration-300 cursor-pointer"
            />
            <FaSquareXTwitter
              size={35}
              className="hover:text-sky-300 transition-all duration-300 cursor-pointer"
            />
            <FaTiktok
              size={35}
              className="hover:text-sky-300 transition-all duration-300 cursor-pointer"
            />
          </article>
          <article className="flex flex-row justify-center flex-wrap gap-x-8 gap-y-2">
            <div className="flex flex-row items-center gap-1">
              <IoLogoWhatsapp size={25} className="text-sky-200" />
              <p className="text-sm">+62 817-1111-2222</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <MdOutlineEmail size={25} className="text-sky-200" />
              <p className="text-sm">hello@HouseDreamer.com</p>
            </div>
          </article>
        </div>
      </footer>
    </>
  );
}
