import { useState, useEffect } from "react";
import Home from "./page/Home";
import { isAuthenticated } from "./utils/auth";

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Check authentication status when component mounts
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <div className="App h-screen overflow-hidden">
      <Home isAuthenticated={isAuth} setIsAuth={setIsAuth} />
    </div>
  );
}

export default App;
