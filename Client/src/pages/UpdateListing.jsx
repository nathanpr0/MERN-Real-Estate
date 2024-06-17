import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";

// IMPORT IMAGE CONVERTER
import imageCompression from "browser-image-compression";

// IMPORT REACT REDUX
import { useSelector } from "react-redux";

// IMPORT FIREBASE STORAGE
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

export default function UpdateListing() {
  const navigate = useNavigate();

  const { currentUser: currentAccount } = useSelector((state) => state.user);
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imagesURL: [],
    name: "",
    description: "",
    address: "",
    types: "Sewa",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 3000000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    lot: "Rumah",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageUploadError] = useState(false);

  //   FETCHING DATA FIRST BEFORE UPDATING
  useEffect(() => {
    async function fetchListing() {
      const listingId = params.listingid;
      try {
        setLoading(true);
        const response = await axios.get(import.meta.env.VITE_GET_LISTING + listingId, {
          withCredentials: true,
        });

        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    }

    fetchListing();
  }, [params.listingid]);

  // CONVERT FUNCTION IMAGE TO WEBP
  async function imageConvertToWEBP(file) {
    const options = {
      maxSizeMB: 1, // Set ukuran maksimum file terkompresi dalam MB
      maxWidthOrHeight: 1920, // Set lebar atau tinggi maksimum gambar terkompresi
      useWebWorker: true, // Gunakan multi-threading untuk kompresi yang lebih cepat
      fileType: "image/webp", // Tentukan jenis file output
    };
    return await imageCompression(file, options);
  }

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        reject(new Error("User not authenticated"));
        return;
      }

      const uid = currentUser.uid;
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${uid}/${new Date().getTime() + file.name}`);

      imageConvertToWEBP(file)
        .then((webPFile) => {
          const uploadTask = uploadBytesResumable(storageRef, webPFile);

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
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleImagesUpload = (e) => {
    e.preventDefault();

    // IMAGES = GAMBAR BARU
    // FORMDATA["imagesURL"] = GAMBAR LAMA
    if (images.length > 0 && images.length + formData["imagesURL"].length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imagesURL: formData["imagesURL"].concat(urls) });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch(() => {
          setImageUploadError("Batas ukuran File Maksimal 2mb/gambar!");
          setUploading(false);
        });
    } else if (images.length === 0 && images.length + formData["imagesURL"].length < 7) {
      setImageUploadError("Anda belum Memilih file gambar!");
      setUploading(false);
    } else {
      setImageUploadError("Batas maksimal upload Gambar hanya 6 files!");
      setUploading(false);
    }
  };

  //   MENGHAPUS UI IMAGE DAN STATE URL GAMBAR DARI FORMDATA
  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imagesURL: formData.imagesURL.filter((_, i) => i !== index),
    });
  };

  const handleChangeInput = (e) => {
    if (e.target.id === "Jual" || e.target.id === "Sewa") {
      setFormData({ ...formData, types: e.target.id });
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (e.target.id === "Rumah" || e.target.id === "Apartemen") {
      setFormData((prev) => {
        return { ...prev, lot: e.target.id };
      });
    }

    if (e.target.type === "text" || e.target.type === "textarea") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    } else if (e.target.type === "number") {
      setFormData({ ...formData, [e.target.id]: parseInt(e.target.value, 10) });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const listingId = params.listingid;

    try {
      if (formData.regularPrice < formData.discountPrice) {
        return toast.error("Discount Price tidak boleh diatas Harga Regular Price!");
      }

      if (formData.imagesURL.length < 1) {
        return toast.error("Anda setidaknya harus upload 1 foto!");
      }

      setLoading(true);

      //   FETCHING DATABASE ARRAY URL STORAGE FIREBASE DARI DATABASE
      const existingImages = (
        await axios.get(import.meta.env.VITE_GET_LISTING + listingId, {
          withCredentials: true,
        })
      ).data.imagesURL;

      //  MELAKUKAN FILTER SUPAYA HANYA MENGHAPUS FILE YANG TIDAK ADA URLNYA DARI STATE FORMDATA DARI FUNCTION handleDeleteImage
      const imagesToDelete = existingImages.filter(
        (imageUrl) => !formData.imagesURL.includes(imageUrl)
      );

      //  UPDATING DATA BACKEND API
      try {
        await axios.put(
          `${import.meta.env.VITE_UPDATE_LISTING}${listingId}`,
          { ...formData, created_by_user: currentAccount._id },
          { withCredentials: true }
        );
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          toast.error(error.response.data);
        } else if (error.response && error.response.status === 404) {
          toast.error(error.response.data);
        } else {
          toast.error(error.message);
        }
      }

      //  DELETE FILE IMAGES STORAGE YANG SUDAH DI FILTER OLEH imagesToDelete
      const storage = getStorage(app);
      for (const imageUrl of imagesToDelete) {
        const url = new URL(imageUrl);
        const filePathWithName = decodeURIComponent(
          url.pathname.substring(url.pathname.lastIndexOf("/") + 1)
        );
        const fileRef = ref(storage, filePathWithName);
        await deleteObject(fileRef);
      }

      setLoading(false);
      toast.success("Listing updated successfully!");
      navigate("/profile");

      return;
    } catch (error) {
      setLoading(false);
      toast.error(error.message);

      return;
    }
  };

  return (
    <main className="w-full m-auto px-12 py-14 max-sm:px-3">
      {/* LISTING CREATED RIGHT CONTAINER */}
      <form
        onSubmit={handleFormSubmit}
        className="w-full bg-white p-10 rounded-lg shadow-lg shadow-gray-400"
        method="post"
      >
        <h1 className="text-2xl text-gray-700 font-semibold mb-4 text-center">Update Listing</h1>
        {/* INPUT NAMA */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="name" className="block text-md font-medium text-gray-700 ">
            Nama
          </label>
          <input
            required
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Nama"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
            value={formData.name}
            onChange={handleChangeInput}
          />
        </section>

        {/* INPUT DESKRIPSI */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="description" className="block text-md font-medium text-gray-700">
            Deskripsi <span className="text-sm">(Max: 300 Words)</span>
          </label>
          <textarea
            required
            name="description"
            id="description"
            maxLength="300"
            placeholder="Deskripsi"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
            rows={6}
            value={formData.description}
            onChange={handleChangeInput}
          />
        </section>

        {/* INPUT ALAMAT */}
        <section className="flex flex-col gap-4 mt-4">
          <label htmlFor="address" className="block text-md font-medium text-gray-700 ">
            Alamat
          </label>
          <input
            required
            type="text"
            name="address"
            id="address"
            placeholder="Alamat"
            autoComplete="off"
            className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-3 focus:outline-sky-800"
            value={formData.address}
            onChange={handleChangeInput}
          />
        </section>

        {/* INPUT DETAIL */}
        <section className="flex flex-wrap gap-5 mt-8">
          {/* Checkbox 1 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="Jual"
              id="Jual"
              className="h-6 w-6 shadow-md cursor-pointer"
              checked={formData.types === "Jual"}
              onChange={handleChangeInput}
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
              checked={formData.types === "Sewa"}
              onChange={handleChangeInput}
            />
            <label htmlFor="Sewa" className="text-sm font-medium text-gray-700 ">
              Sewa
            </label>
          </div>

          {/* Checkbox 3 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="parking"
              id="parking"
              className="h-6 w-6 shadow-md cursor-pointer"
              checked={formData.parking}
              onChange={handleChangeInput}
            />
            <label htmlFor="parking" className="text-sm font-medium text-gray-700 ">
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
              checked={formData.furnished}
              onChange={handleChangeInput}
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
              checked={formData.offer}
              onChange={handleChangeInput}
            />
            <label htmlFor="offer" className="text-sm font-medium text-gray-700 ">
              Offer
            </label>
          </div>

          {/* Checkbox 6 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="Rumah"
              id="Rumah"
              className="h-6 w-6 shadow-md cursor-pointer"
              checked={formData.lot === "Rumah"}
              onChange={handleChangeInput}
            />
            <label htmlFor="Rumah" className="text-sm font-medium text-gray-700 ">
              Rumah
            </label>
          </div>

          {/* Checkbox 7 */}
          <div className="flex gap-3 items-center">
            <input
              type="checkbox"
              name="Apartemen"
              id="Apartemen"
              className="h-6 w-6 shadow-md cursor-pointer"
              checked={formData.lot === "Apartemen"}
              onChange={handleChangeInput}
            />
            <label htmlFor="Apartemen" className="text-sm font-medium text-gray-700 ">
              Apartemen
            </label>
          </div>
        </section>

        {/* ROOM & PRICING INPUT */}
        <section className="flex flex-col gap-3 mt-8">
          <span className="text-md font-medium text-gray-700">Informasi Tambahan</span>

          <div className="flex flex-wrap gap-5">
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
                value={formData.bedrooms}
                onChange={handleChangeInput}
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
                value={formData.bathrooms}
                onChange={handleChangeInput}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="regularPrice" className="text-sm">
                Regular Price (Rp)
              </label>
              <input
                required
                min="3000000"
                type="number"
                id="regularPrice"
                name="regularPrice"
                className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
                value={formData.regularPrice}
                onChange={handleChangeInput}
              />
            </div>

            {formData.offer && (
              <div className="flex flex-col gap-3">
                <label htmlFor="discountPrice" className="text-sm">
                  Discount Price (Rp)
                </label>
                <input
                  required
                  min="0"
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  className="w-full shadow-md border-solid border-sky-600 border-2 rounded px-4 py-2 focus:outline-sky-800"
                  value={formData.discountPrice}
                  onChange={handleChangeInput}
                />
              </div>
            )}
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
        {formData.imagesURL.length > 0 &&
          formData.imagesURL.map((value, i) => {
            return (
              <figure
                key={i}
                className="flex items-center justify-between mt-4 p-3 gap-3 rounded shadow-md shadow-gray-500"
              >
                <img
                  src={value}
                  alt="listing image"
                  className="h-36 max-sm:h-28 shadow-lg object-contain rounded-lg"
                />

                <button
                  type="button"
                  className="text-red-600 hover:opacity-75 text-sm mt-2 px-1 font-semibold uppercase"
                  onClick={() => handleDeleteImage(i, value)}
                >
                  Delete
                </button>
              </figure>
            );
          })}

        {/* UPDATE LISTING BUTTON */}
        <section className="flex flex-col gap-4 mt-8">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 rounded text-white text-base max-sm:text-sm font-semibold p-2"
          >
            {loading ? "Loading..." : "Update Listing"}
          </button>

          <Link to={"/profile"}>
            <button
              type="button"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </Link>
        </section>
      </form>
    </main>
  );
}
