import React from "react";
import Main from "./Components/Main/Main.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import LoginSignUp from "./Components/LoginSignUp/loginSignUp.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

const App=()=> {

  return (
    <>
      <Sidebar />
      <Main />
      {/*<LoginSignUp/>*/}
    </>
  )
}

export default App