import { useState, useRef } from "react";
import propTypes from "prop-types";

// IMPORT REACT-ICONS
import { FaPencilAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";

// PROPS VALIDATION
UserProfile.propTypes = {
  usernameData: propTypes.any,
  emailData: propTypes.any,
  usernameOnChange: propTypes.func,
  emailOnChange: propTypes.func,
};

export default function UserProfile({ usernameData, emailData, usernameOnChange }) {
  // PROFILE INPUT FOCUS STATE
  const inputRefUserName = useRef(null);
  const [focusInput, setFocusInput] = useState({ username: true, email: true });

  // HANDLER FUNCTION FOR ICON FOCUS & BLUR ONCLICK
  const handleFocusUsername = () => {
    setFocusInput((prevFocusInput) => ({
      ...prevFocusInput,
      username: false,
    }));
    inputRefUserName.current.focus();
  };

  const handleBlurUsername = () => {
    setFocusInput((prevFocusInput) => ({
      ...prevFocusInput,
      username: true,
    }));
    inputRefUserName.current.blur();
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            className="mt-1 text-lg py-3 w-full font-semibold text-gray-900 
            read-only:focus:outline-none read-only:focus:shadow-none read-only:focus:px-0 
            focus:outline-sky-800 focus:shadow-md focus:px-3"
            id="username"
            name="username"
            autoComplete="off"
            defaultValue={usernameData}
            onChange={usernameOnChange}
            readOnly={focusInput["username"]}
            ref={inputRefUserName}
            onBlur={() => {
              setFocusInput((prevFocusInput) => ({
                ...prevFocusInput,
                username: true,
              }));
            }}
          />
          {focusInput["username"] ? (
            <FaPencilAlt onClick={handleFocusUsername} className="cursor-pointer" />
          ) : (
            <MdClose onClick={handleBlurUsername} className="cursor-pointer" />
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
          Email
        </label>
        <div className="flex justify-between items-center gap-2">
          <input
            type="email"
            className="mt-1 text-lg py-3 w-full font-semibold text-gray-900 
            read-only:focus:outline-none read-only:focus:shadow-none read-only:focus:px-0  
            focus:outline-sky-800"
            id="email"
            name="email"
            autoComplete="off"
            defaultValue={emailData}
            readOnly={true}
          />
        </div>
      </div>
    </>
  );
}
