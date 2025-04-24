import React, { useState } from "react";
import axios from "axios";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (onLoginSuccess) onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <div className="mb-4 md:mb-6 p-2 md:p-3 bg-red-100/50 backdrop-blur-sm text-red-700 rounded-xl text-center text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <div>
          <label
            className="block text-[#22333B] text-base md:text-lg mb-1 md:mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 md:p-3 bg-white/50 backdrop-blur-sm border-2 border-[#22333B]/10 rounded-xl 
            focus:outline-none focus:border-[#D7F75B] focus:shadow-[0_0_7.53px_rgba(215,247,91,0.7)] 
            transition-all text-sm md:text-base"
            required
          />
        </div>

        <div>
          <label
            className="block text-[#22333B] text-base md:text-lg mb-1 md:mb-2"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 md:p-3 bg-white/50 backdrop-blur-sm border-2 border-[#22333B]/10 rounded-xl 
            focus:outline-none focus:border-[#D7F75B] focus:shadow-[0_0_7.53px_rgba(215,247,91,0.7)] 
            transition-all text-sm md:text-base"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#D7F75B] text-[#22333B] py-2.5 md:py-3 px-4 md:px-6 rounded-xl font-semibold text-base md:text-lg
          hover:shadow-[0_0_7.53px_rgba(215,247,91,1)] transition-all mt-2 md:mt-4"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </form>
  );
}

export default Login;
