import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { login } from "../services/operation/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    dispatch(login(email, password, navigate));
  };

  // const handleGuestLogin = () => {
  //   setFormData({ email: "guest@example.com", password: "123456" });
  // };

  return (
    <div className="mx-auto p-2 w-full sm:max-w-md">
      <form onSubmit={handleOnSubmit}>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
            Email Address <sup className="text-pink-800">*</sup>
          </p>
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

        <label className="relative mt-3 block">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem]">
            Password <sup className="text-pink-800">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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

        <button
          type="submit"
          className="bg-blue-500 text-white w-full rounded-md py-2 mt-4"
        >
          Login
        </button>
        {/* <button
          type="button"
          onClick={handleGuestLogin}
          className="bg-red-500 text-white w-full rounded-md py-2 mt-3"
        >
          Get Guest User Credentials
        </button> */}
      </form>
    </div>
  );
};

export default Login;
