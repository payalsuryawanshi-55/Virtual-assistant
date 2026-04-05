import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      if (!res.data.success) {
        setErr(res.data.message);
        setLoading(false);
        return;
      }

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem('userData', JSON.stringify(res.data.user));
        setUserData(res.data.user);
        
        // ✅ Check if user has any assistants
        const hasAssistants = res.data.user.arrayOfAssistants && 
                              res.data.user.arrayOfAssistants.length > 0;
        
        setLoading(false);
        
        // ✅ Navigate based on whether user has assistants
        if (hasAssistants) {
          navigate("/");  // Go to home if assistant exists
        } else {
          navigate("/customize");  // Go to customize if no assistant
        }
        return;
      }

      setLoading(false);
      navigate("/customize"); // Default fallback

    } catch (error) {
      setLoading(false);
      
      if (!error.response) {
        setErr("Cannot connect to server. Please make sure backend is running!");
      } else {
        setErr(error.response.data.message || "Something went wrong!");
      }
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-[92%] max-w-[450px] h-[auto] bg-[#00000062]
        backdrop-blur shadow-lg shadow-black flex flex-col items-center
        justify-center gap-[20px] px-[20px] py-[30px]"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] text-center">
          Sign In to <span className="text-blue-900">Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent 
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[52px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent 
            placeholder-gray-300 px-[20px] py-[10px]"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && <p className="text-red-500 text-[16px] text-center">* {err}</p>}

        <button
          type="submit"
          className={`min-w-[150px] h-[60px] text-black font-semibold 
          bg-white rounded-full text-[20px] sm:text-[16px] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;