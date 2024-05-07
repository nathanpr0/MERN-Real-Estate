import { useState, useRef } from "react";
import propTypes from "prop-types";

// IMPORT REACT-ICONS
import { FaPencilAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";

// PROPS VALIDATION
UserProfile.propTypes = {
  usernameData: propTypes.string,
  emailData: propTypes.string,
  usernameOnChange: propTypes.func,
  emailOnChange: propTypes.func,
};

export default function UserProfile({ usernameData, emailData, usernameOnChange, emailOnChange }) {
  // PROFILE INPUT FOCUS STATE
  const inputRefUserName = useRef(null);
  const inputRefEmail = useRef(null);
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

  const handleFocusEmail = () => {
    setFocusInput((prevFocusInput) => ({
      ...prevFocusInput,
      email: false,
    }));
    inputRefEmail.current.focus();
  };

  const handleBlurEmail = () => {
    setFocusInput((prevFocusInput) => ({
      ...prevFocusInput,
      email: true,
    }));
    inputRefEmail.current.blur();
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
            className={`mt-1 text-lg py-3 w-full font-semibold text-gray-900 ${
              focusInput["username"] ? "focus:outline-none" : ""
            }`}
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
            className={`mt-1 text-lg py-3 w-full font-semibold text-gray-900 ${
              focusInput["email"] ? "focus:outline-none" : ""
            }`}
            id="email"
            name="email"
            autoComplete="off"
            defaultValue={emailData}
            onChange={emailOnChange}
            readOnly={focusInput["email"]}
            ref={inputRefEmail}
            onBlur={() => {
              setFocusInput((prevFocusInput) => ({ ...prevFocusInput, email: true }));
            }}
          />
          {focusInput["email"] ? (
            <FaPencilAlt onClick={handleFocusEmail} className="cursor-pointer" />
          ) : (
            <MdClose onClick={handleBlurEmail} className="cursor-pointer" />
          )}
        </div>
      </div>
    </>
  );
}
