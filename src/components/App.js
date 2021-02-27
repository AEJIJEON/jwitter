import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService} from "fbase";
function App() {
  const isLoggedIn = useState(authService.currentUser)[0];
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Jwitter</footer>
    </>
  );
}

export default App;
