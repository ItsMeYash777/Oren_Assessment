import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo (1).png";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "https://oren-assessment-6.onrender.com/api";

  const handleSignUp = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid Gmail address."); 
      return; 
    }

    setError("");
    console.log("Signing up with:", { name, email, password });

    try {
      console.log("Sending registration request...");
      const response = await axios.post(`${BASE_URL}/signup`, {
        name,
        email,
        password,
      });
      console.log("User registered:", response.data);
      alert("Signup successful! You can now sign in.");
      navigate('/');
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      setError(
        "Error during registration: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <img
            src={logo}
            alt="Logo"
            className="mt-4 w-32 h-32 object-contain px-2 mx-auto"
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
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
                placeholder="Password"
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
            Sign Up
          </button>
        </form>
        <div className="text-sm text-center">
          <p className="font-medium text-primary hover:text-primary/90">
            Already have an account?{" "}
            <Link className="text-customBlue" to="/">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
