import React, { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
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
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Notify parent component about successful registration
      if (onRegisterSuccess) onRegisterSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-[Bold_Dispo] mb-6 text-center text-[#22333B]">
        Inscription
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[#22333B] mb-2" htmlFor="username">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#D7F75B]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#22333B] mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#D7F75B]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#22333B] mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#D7F75B]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#22333B] text-white py-2 rounded hover:bg-[#22333B]/90 transition-colors"
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-[#22333B]">
          Déjà un compte?{" "}
          <span className="text-[#D7F75B] cursor-pointer">Se connecter</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
