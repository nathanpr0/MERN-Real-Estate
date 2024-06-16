import Footer from "../components/Footer.jsx";

export default function About() {
  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-5 py-10 lg:py-20 px-4 md:px-6 lg:px-10">
        <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
          <h1 className="text-2xl text-gray-700 font-bold mb-2">Tentang HouseDreamer</h1>

          <p className="text-lg max-sm:text-md text-gray-700 font-semibold">
            Selamat datang di HouseDreamer, sumber utama Anda untuk menemukan rumah impian Anda. Di
            HouseDreamer, kami berkomitmen untuk memberikan yang terbaik dalam daftar properti,
            dengan fokus pada kehandalan, layanan pelanggan, dan keunikan.
          </p>
        </div>

        <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
          <h1 className="text-2xl text-gray-700 font-bold mb-2">Misi Kami</h1>

          <p className="text-lg max-sm:text-md text-gray-700 font-semibold">
            Misi kami adalah menyederhanakan proses pembelian rumah dan membuatnya lebih
            menyenangkan bagi semua pihak yang terlibat. Kami berusaha menyediakan platform yang
            mudah digunakan di mana pengguna dapat menjelajahi berbagai properti, mulai dari
            apartemen nyaman hingga vila mewah, semua dalam satu tempat.
          </p>
        </div>

        <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
          <h1 className="text-2xl text-gray-700 font-bold mb-2">Layanan Kami</h1>

          <p className="text-lg max-sm:text-md text-gray-700 font-semibold mb-4">
            HouseDreamer menawarkan berbagai layanan untuk memenuhi semua kebutuhan properti Anda:
          </p>

          <ul className="list-disc mx-6">
            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Daftar Properti Luas:</span> Jelajahi
              berbagai properti yang tersedia untuk disewa atau dibeli. Daftar kami secara berkala
              diperbarui untuk memastikan Anda memiliki akses ke properti terbaru di pasaran.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Filter Pencarian Lanjutan:</span> Gunakan
              filter pencarian lanjutan kami untuk menemukan properti yang sesuai dengan kriteria
              tertentu Anda, baik itu lokasi, rentang harga, ukuran, atau fasilitas.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Manajemen Properti:</span> Bagi pemilik
              properti, kami menawarkan layanan manajemen properti yang komprehensif untuk membantu
              Anda memelihara dan mengelola properti Anda dengan efisien.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Saran dari Ahli:</span> Dapatkan saran dari
              tim profesional real estat berpengalaman kami. Baik Anda membeli, menjual, atau
              menyewa, kami di sini untuk membimbing Anda setiap langkahnya.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Dukungan Pelanggan:</span> Tim dukungan
              pelanggan kami yang berdedikasi selalu siap membantu Anda dengan pertanyaan atau
              kekhawatiran yang Anda miliki.
            </li>
          </ul>
        </div>

        <div className="bg-white p-10 max-sm:px-5 rounded-lg shadow-lg shadow-gray-400">
          <h1 className="text-2xl text-gray-700 font-bold mb-2">Mengapa Memilih HouseDreamer?</h1>

          <p className="text-lg max-sm:text-md text-gray-700 font-semibold mb-4">
            Di HouseDreamer, kami memahami bahwa menemukan rumah sempurna lebih dari sekadar
            transaksi; itu adalah pengalaman yang mengubah hidup. Itulah mengapa kami berkomitmen
            untuk memberikan Anda layanan terbaik yang memungkinkan Anda mencapai impian Anda.
            Berikut adalah hal-hal yang membedakan kami:
          </p>

          <ul className="list-disc mx-6">
            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Platform yang Mudah Digunakan:</span>{" "}
              Website kami dirancang dengan mempertimbangkan Anda, memastikan pengalaman
              penjelajahan yang mulus dan bebas masalah.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Daftar Properti Terverifikasi:</span> Kami
              memastikan bahwa semua daftar properti kami terverifikasi dan terkini, sehingga Anda
              dapat mempercayai informasi yang Anda temukan di situs kami.
            </li>

            <li className="mb-3 leading-7">
              <span className="text-gray-700 font-bold">Keahlian Lokal:</span> Dengan pemahaman yang
              mendalam tentang pasar lokal, tim kami dapat memberikan wawasan dan rekomendasi
              berharga yang disesuaikan dengan kebutuhan Anda.
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  );
}
