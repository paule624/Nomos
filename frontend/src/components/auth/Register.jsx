import React, { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email: formData.email,
        password: formData.password,
      });
      if (onRegisterSuccess) onRegisterSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <div className="mb-6 p-3 bg-red-100/50 backdrop-blur-sm text-red-700 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[#22333B] text-lg mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-white/50 backdrop-blur-sm border-2 border-[#22333B]/10 rounded-xl 
            focus:outline-none focus:border-[#D7F75B] focus:shadow-[0_0_7.53px_rgba(215,247,91,0.7)] 
            transition-all"
            required
          />
        </div>

        <div>
          <label
            className="block text-[#22333B] text-lg mb-2"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-white/50 backdrop-blur-sm border-2 border-[#22333B]/10 rounded-xl 
            focus:outline-none focus:border-[#D7F75B] focus:shadow-[0_0_7.53px_rgba(215,247,91,0.7)] 
            transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#D7F75B] text-[#22333B] py-3 px-6 rounded-xl font-semibold text-lg
          hover:shadow-[0_0_7.53px_rgba(215,247,91,1)] transition-all mt-4"
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </div>
    </form>
  );
}

export default Register;
