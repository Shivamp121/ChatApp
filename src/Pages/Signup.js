import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/operation/authApi"; // <-- import your signup function
import { useDispatch } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null, // file object
  });

  const { name, email, password, confirmPassword } = formData;
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleOnChange = (e) => {
    if (e.target.name === "pic") {
      setFormData((prev) => ({
        ...prev,
        pic: e.target.files[0], // store File object
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form submit
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Call API function
    
      dispatch(signUp(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.pic,
        navigate
    ));
  };

  return (
    <div className="p-2 mx-auto max-w-md">
      <form onSubmit={handleOnSubmit}>
        {/* Name */}
        <label className="w-full">
          <p className="mb-1 text-[0.875rem]">Name <sup className="text-pink-800">*</sup></p>
          <input
            required
            type="text"
            name="name"
            value={name}
            onChange={handleOnChange}
            placeholder="Enter Your Name"
            className="border-gray-400 border w-full rounded-[0.5rem] p-[12px]"
          />
        </label>

        {/* Email */}
        <label className="w-full mt-3">
          <p className="mb-1 text-[0.875rem]">Email Address <sup className="text-pink-800">*</sup></p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="border-gray-400 border w-full rounded-[0.5rem] p-[12px]"
          />
        </label>

        {/* Password */}
        <label className="relative mt-3 block">
          <p className="mb-1 text-[0.875rem]">Password <sup className="text-pink-800">*</sup></p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            className="border-gray-400 border w-full rounded-[0.5rem] p-[12px]"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-10 cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>

        {/* Confirm Password */}
        <label className="relative mt-3 block">
          <p className="mb-1 text-[0.875rem]">Confirm Password <sup className="text-pink-800">*</sup></p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            className="border-gray-400 border w-full rounded-[0.5rem] p-[12px]"
          />
        </label>

        {/* Upload Picture */}
        <label className="w-full mt-3">
          <p className="mb-1 text-[0.875rem]">Upload Your Picture <sup className="text-pink-800">*</sup></p>
          <input
            
            type="file"
            accept="image/png, image/jpeg"
            name="pic"
            onChange={handleOnChange}
            className="border-gray-400 border w-full rounded-[0.5rem] p-[12px]"
          />
        </label>

        {/* Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white w-full rounded-md py-2 mt-4"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
