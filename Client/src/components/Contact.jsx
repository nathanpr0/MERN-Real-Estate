import { useEffect } from "react";
import axios from "axios";
import propTypes from "prop-types";

Contact.propTypes = {
  landLord_listing: propTypes.object,
  stateLandLord: propTypes.any,
  actionLandLord: propTypes.func,
};

export default function Contact({ landLord_listing, stateLandLord, actionLandLord }) {
  useEffect(() => {
    async function getContact() {
      try {
        const response = await axios.get(
          import.meta.env.VITE_GET_CONTACT + landLord_listing.created_by_user,
          {
            withCredentials: true,
          }
        );
        actionLandLord(response.data);

        return;
      } catch (error) {
        if (error.response && error.response.data === 401) {
          console.error(error.response.data);
        } else if (error.response && error.response.status === 404) {
          console.error(error.response.data);
        } else {
          console.error(error.message);
        }

        return;
      }
    }

    getContact();
  }, [landLord_listing.created_by_user, actionLandLord]);

  return (
    <>
      {stateLandLord && (
        <>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">{"Landlord's"} Name</span>
            <input
              type="text"
              className="shadow-md border-solid border-sky-600 border-2 rounded px-2 py-1 focus:outline-none"
              value={stateLandLord.username}
              readOnly
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">To Email</span>
            <input
              type="email"
              className="shadow-md border-solid border-sky-600 border-2 rounded px-2 py-1 focus:outline-none"
              value={stateLandLord.email}
              readOnly
              required
            />
          </label>
        </>
      )}
    </>
  );
}
