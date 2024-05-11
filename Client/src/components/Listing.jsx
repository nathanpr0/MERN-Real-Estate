import { useState } from "react";
import { useSelector } from "react-redux";

// IMPORT FIREBASE STORAGE
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export default function Listing() {
  const { loading } = useSelector((state) => state.user);

  // IMAGES UPLOAD
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageUploadError] = useState(false);
  const [formImage, setFormImage] = useState({
    ImagesURL: [],
  });

  // STORE IMAGE TO FIREBASE URL THEN GET THE URL
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  // AFTER GET THE URL PUT THE IMAGE FIREBASE URL ON THE FORM OF IMAGE STATE
  const handleImagesUpload = (e) => {
    e.preventDefault();

    // CHECK JUMLAH IMAGES
    if (images.length > 0 && images.length + formImage["ImagesURL"].length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormImage({ ...formImage, ImagesURL: formImage["ImagesURL"].concat(urls) });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch(() => {
          setImageUploadError("Batas ukuran File Maksimal 2mb/gambar!");
          setUploading(false);
        });
    } else {
      setImageUploadError("Batas maksimal upload Gambar hanya 6 files!");
      setUploading(false);
    }
  };

  // HANDLE DELETE IMAGE AFTER UPLOADED BEFORE CREATING LISTING
  const handleDeleteImage = (index) => {
    setFormImage({
      ...formImage,
      ImagesURL: formImage.ImagesURL.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      {/* LISTING CREATED RIGHT CONTAINER */}
      <form className="w-full bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Listing Page</h1>
        {/* INPUT NAMA */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="nama" className="block text-md font-medium text-gray-700 ">
            Nama
          </label>
          <input
            required
            minLength="10"
            maxLength="62"
            id="nama"
            name="nama"
            autoComplete="off"
            placeholder="Nama"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
          />
        </section>

        {/* INPUT DESKRIPSI */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="deskripsi" className="block text-md font-medium text-gray-700 ">
            Deskripsi
          </label>
          <textarea
            required
            name="deskripsi"
            id="deskripsi"
            placeholder="Deskripsi"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
          />
        </section>

        {/* INPUT ALAMAT */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="alamat" className="block text-md font-medium text-gray-700 ">
            Alamat
          </label>
          <input
            required
            type="text"
            name="alamat"
            id="alamat"
            placeholder="Alamat"
            autoComplete="off"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
          />
        </section>

        {/* INPUT DETAIL */}
        <section className="flex justify-evenly flex-wrap gap-3 mt-8">
          {/* Checkbox 1 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="jual"
              id="jual"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="jual" className="text-sm font-medium text-gray-700 ">
              Jual
            </label>
          </div>

          {/* Checkbox 2 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="sewa"
              id="sewa"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="sewa" className="text-sm font-medium text-gray-700 ">
              Sewa
            </label>
          </div>

          {/* Checkbox 3 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="parking-spot"
              id="parking-spot"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="parking-spot" className="text-sm font-medium text-gray-700 ">
              Parking Spot
            </label>
          </div>

          {/* Checkbox 4 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="furnished"
              id="furnished"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="furnished" className="text-sm font-medium text-gray-700 ">
              Furnished
            </label>
          </div>

          {/* Checkbox 5 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="offer"
              id="offer"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="offer" className="text-sm font-medium text-gray-700 ">
              Offer
            </label>
          </div>

          {/* Checkbox 6 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="rumah"
              id="rumah"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="rumah" className="text-sm font-medium text-gray-700 ">
              Rumah
            </label>
          </div>

          {/* Checkbox 7 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="apartemen"
              id="apartemen"
              className="h-6 w-6 shadow-md cursor-pointer"
            />
            <label htmlFor="apartemen" className="text-sm font-medium text-gray-700 ">
              Apartemen
            </label>
          </div>
        </section>

        {/* ROOM & PRICING INPUT */}
        <section className="flex flex-col gap-3 mt-8">
          <span className="text-md font-medium text-gray-700">Informasi Tambahan</span>

          <div className="flex flex-wrap justify-around gap-5">
            {/* BEDROOMS COUNT INPUT */}
            <div className="flex flex-col gap-3">
              <label htmlFor="bedrooms" className="text-sm">
                Beds
              </label>
              <input
                required
                min="1"
                max="9"
                type="number"
                id="bedrooms"
                name="bedrooms"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
              />
            </div>

            {/* BATHROOMS COUNT INPUT */}
            <div className="flex flex-col gap-3">
              <label htmlFor="bathrooms" className="text-sm">
                Baths
              </label>
              <input
                required
                min="1"
                max="9"
                type="number"
                id="bathrooms"
                name="bathrooms"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="regularPrice" className="text-sm">
                Regular Price (Rp/bln)
              </label>
              <input
                required
                type="number"
                id="regularPrice"
                name="regularPrice"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="discountPrice" className="text-sm">
                Discount Price (Rp/bln)
              </label>
              <input
                required
                type="number"
                id="discountPrice"
                name="discountPrice"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
              />
            </div>
          </div>
        </section>

        {/* IMAGE INPUT */}
        <section className="mt-10">
          <p className="text-md font-medium text-gray-700">
            Image:
            <span className="text-black font-normal">
              {" First image will be the cover (max: 6 pics)"}
            </span>
          </p>

          {/* IMAGE FILE INSERT */}
          <div className="flex items-center gap-3 px-1 pt-5 pb-2">
            <input
              type="file"
              id="gambar"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
            <button
              disabled={uploading}
              className="uppercase rounded shadow-md border-solid border-sky-600 border-2 py-2 px-4 text-sky-600 hover:border-sky-800 hover:text-sky-800 disabled:opacity-80"
              onClick={handleImagesUpload}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </section>

        {imageError && <p className="text-red-600 text-sm mt-2 px-1">{imageError}</p>}
        {formImage.ImagesURL.length > 0 &&
          formImage.ImagesURL.map((value, i) => {
            return (
              <figure
                key={i}
                className="flex items-center justify-between mt-4 p-3 gap-3 rounded shadow-md shadow-gray-500"
              >
                <img
                  src={value}
                  alt="listing image"
                  className="h-36  shadow-lg object-contain rounded-lg"
                />

                <button
                  type="button"
                  className="text-red-600 hover:opacity-75 text-sm mt-2 px-1 font-semibold uppercase"
                  onClick={() => handleDeleteImage(i)}
                >
                  Delete
                </button>
              </figure>
            );
          })}

        {/* CREATE LISTING BUTTON */}
        <section className="mt-8">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 rounded text-white text-base max-sm:text-sm font-semibold p-2"
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
        </section>
      </form>
    </>
  );
}
