import React from "react";
import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Main from "./components/Main.jsx";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div className={"h-full" + (theme == "dark" ? " bg-gray-800" : "")}>
      <Main theme={theme} setTheme={setTheme}></Main>
    </div>
  );
}

export default App;
