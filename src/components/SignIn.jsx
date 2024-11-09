import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo (1).png";
import axios from "axios";
import { useAuth } from "../context/authContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5001/api";
  const { setAuth } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log("Signing in with:", { email, password });

    try {
      console.log("Sending sign-in request...");
      const response = await axios.post(`${BASE_URL}/signin`, {
        email,
        password,
      }, {withCredentials:true});
      console.log("User signed in:", response.data);
      setAuth({ isAuthenticated: true });
      alert("You have successfully logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during sign-in:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 409) {
          setError("Invalid email or password. Please try again.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back, User!
          </h2>
          <img
            src={logo}
            alt="Logo"
            className="mt-4 w-32 h-32 object-contain px-2 mx-auto"
          />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your E-mail"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-customBlue px-4 py-2 text-white font-medium rounded-md 
              hover:bg-primary-dark 
              transition-transform duration-525 ease-in-out 
              transform hover:scale-105 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="text-sm text-center mt-4">
          <p className="font-medium text-primary hover:text-primary/90">
            Don't have an account?{" "}
            <Link className="text-customBlue" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
