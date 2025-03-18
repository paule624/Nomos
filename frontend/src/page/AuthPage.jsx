import React, { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

// Dans AuthPage.jsx, modifiez la fonction pour accepter onLoginSuccess comme prop
function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = () => {
    // Appeler la fonction passée par le parent
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleRegisterSuccess = () => {
    // Switch to login after successful registration
    setIsLogin(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {isLogin ? (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="mt-4 text-center">
              <p className="text-[#22333B]">
                Pas encore de compte?
                <button
                  onClick={() => setIsLogin(false)}
                  className="ml-1 text-[#D7F75B] hover:underline"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <Register onRegisterSuccess={handleRegisterSuccess} />
            <div className="mt-4 text-center">
              <p className="text-[#22333B]">
                Déjà un compte?
                <button
                  onClick={() => setIsLogin(true)}
                  className="ml-1 text-[#D7F75B] hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
