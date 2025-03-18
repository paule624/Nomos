import { useState, useEffect } from "react";
import Home from "./page/Home";
import AuthPage from "./page/AuthPage";
import { isAuthenticated } from "./utils/auth";

function App() {
  const [currentPage, setCurrentPage] = useState("auth");

  useEffect(() => {
    // Check authentication status when component mounts
    if (isAuthenticated()) {
      setCurrentPage("home");
    } else {
      setCurrentPage("auth");
    }
  }, []);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setCurrentPage("home");
  };

  return (
    <div className="App">
      {currentPage === "home" ? (
        <Home />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
