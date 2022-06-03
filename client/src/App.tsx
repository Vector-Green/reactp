import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./views/HomePage";
import "@/AppStyle.scss";
import { useState } from "react";

function App() {
  let navHeightNormal = "50px";
  let navHeightDeployed = "75px";

  function calcNavHeight() {
    return isNavDeployed ? navHeightDeployed : navHeightNormal;
  }
  const [isNavDeployed, setIsNavDeployed] = useState(false);
  const [navHeight, setNavHeight] = useState(calcNavHeight());

  return (
    <>
      <nav
        className={`nav ${isNavDeployed ? "nav__deployed" : ""}`}
        style={{ height: navHeight }}
      ></nav>
      <main style={{ "--nav-height": navHeight } as React.CSSProperties}>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
