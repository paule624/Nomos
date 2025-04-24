import React, { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logo from "/Logo_Nom_Dark.png";
import BgLogo from "/Logo-bg-Nomos.png";
import "./AuthPage.css";

function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = () => {
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-container">
      <div
        className="auth-bg-logo"
        style={{ backgroundImage: `url(${BgLogo})` }}
      ></div>
      <div className="auth-content">
        <img
          src={Logo}
          alt="Nomos"
          className="w-[60%] max-w-[220px] mb-4 md:mb-6"
        />
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg">
          <div className="mb-4 md:mb-8 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-[#22333B]">
              {isLogin ? "Connexion" : "Inscription"}
            </h2>
          </div>

          {isLogin ? (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <div className="mt-4 md:mt-6 text-center">
                <p className="text-[#22333B] text-sm md:text-base">
                  Pas encore de compte ?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="font-semibold text-[#22333B] hover:text-[#D7F75B] transition-colors"
                  >
                    S'inscrire
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <Register onRegisterSuccess={handleRegisterSuccess} />
              <div className="mt-4 md:mt-6 text-center">
                <p className="text-[#22333B] text-sm md:text-base">
                  Déjà un compte ?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="font-semibold text-[#22333B] hover:text-[#D7F75B] transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
