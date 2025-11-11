import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../Assests/google.jpg";
import githubLogo from "../Assests/github.png";
import linkedinLogo from "../Assests/linkedin.webp";
import axios from "axios";
const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  // Inside your component:
  const handelLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const API = process.env.REACT_APP_API_URL;

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login success:", res.data);

      // ✅ Save user ID to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));


      navigate("/main"); // go to Create Page after login
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };


  const handelSignup = async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      const API = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API}/api/auth/register`, {
        username,
        email,
        password,
      });

      // ✅ Save the user ID in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));


      console.log("Signup success:", res.data);
      navigate("/main/create");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-sky-100 to-sky-300 p-4 animate-pageFadeIn relative font-['Inter']">
      {/* Main Card */}
      <div className="main-card w-full max-w-md bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 animate-fadeInDown overflow-hidden">
        <div
          className={`form-slider flex w-[200%] transition-transform duration-700 ease-in-out ${isSignup ? "-translate-x-1/2" : "translate-x-0"
            }`}
        >
          {/* ===== LOGIN PANEL ===== */}
          <div className="form-panel w-1/2 p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Login to your account
            </p>

            <form onSubmit={handelLogin}>
              {/* Email */}
              <div className="floating-label-group mb-6 relative">
                <span className="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  id="login-email"
                  placeholder=" "
                  required
                  className="peer pl-11 pr-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl text-gray-800 text-base w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <label
                  htmlFor="login-email"
                  className="floating-label absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300
    peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600
    peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-sky-600
    bg-white/80 px-1 rounded"
                >
                  Email Address
                </label>

              </div>

              {/* Password */}
              <div className="floating-label-group mb-4 relative">
                <span className="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  id="login-password"
                  placeholder=" "
                  required
                  className="peer pl-11 pr-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl text-gray-800 text-base w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <label
                  htmlFor="login-password"
                  className="floating-label absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 
peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600
peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-sky-600
bg-white/80 px-1 rounded"

                >
                  Password
                </label>
              </div>

              {/* Options */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 text-sky-500 border-gray-300 rounded focus:ring-sky-400"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Log In
              </button>

              {/* Separator */}
              <div className="my-8 flex items-center">
                <hr className="flex-grow border-t border-gray-300/70" />
                <span className="mx-4 text-sm text-gray-500">
                  or continue with
                </span>
                <hr className="flex-grow border-t border-gray-300/70" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "google", img: googleLogo },
                  { name: "github", img: githubLogo },
                  { name: "linkedin", img: linkedinLogo },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className="hover:shadow-md flex items-center justify-center w-full py-2.5 px-4 border border-gray-300/70 rounded-xl text-gray-700 hover:bg-white/50 transition-all duration-300"
                  >
                    <img src={s.img} alt={s.name} className="w-5 h-5 object-contain" />
                  </button>
                ))}
              </div>


            </form>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* ===== SIGNUP PANEL ===== */}
          <div className="form-panel w-1/2 p-6 sm:p-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Get started with us today
            </p>

            <form onSubmit={handelSignup}>
              {/* Username */}
              <div className="floating-label-group mb-6 relative">
                <span className="input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4..."
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="signup-username"
                  placeholder=" "
                  required
                  className="peer pl-11 pr-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl text-gray-800 text-base w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <label
                  htmlFor="signup-username"
                  className="floating-label absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 
peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600
peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-sky-600
bg-white/80 px-1 rounded"

                >
                  Username
                </label>
              </div>

              {/* Email */}
              <div className="floating-label-group mb-6 relative">
                <input
                  type="email"
                  id="signup-email"
                  placeholder=" "
                  required
                  className="peer pl-11 pr-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl text-gray-800 text-base w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <label
                  htmlFor="signup-email"
                  className="floating-label absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 
peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600
peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-sky-600
bg-white/80 px-1 rounded"

                >
                  Email Address
                </label>
              </div>

              {/* Password */}
              <div className="floating-label-group mb-6 relative">
                <input
                  type="password"
                  id="signup-password"
                  placeholder=" "
                  required
                  className="peer pl-11 pr-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl text-gray-800 text-base w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <label
                  htmlFor="signup-password"
                  className="floating-label absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-300 
peer-focus:-top-2 peer-focus:text-sm peer-focus:text-sky-600
peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-sky-600
bg-white/80 px-1 rounded"

                >
                  Create Password
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-gray-600 mt-8">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-sm text-gray-700/50 w-full">
        © 2025 Your Company. All rights reserved.{" "}
        <a href="#" className="hover:underline">
          Terms of Service
        </a>{" "}
        ·{" "}
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
};

export default AuthForm;

