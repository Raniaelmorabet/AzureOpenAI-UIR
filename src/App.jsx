import React from "react";
import Main from "./Components/Main/Main.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import LoginSignUp from "./Components/LoginSignUp/loginSignUp.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function AppContent(){
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/LoginSignup' && <Sidebar/>}
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/LoginSignup' element={<LoginSignUp/>}  />
            </Routes>

        </>
    )
}
const App=()=> {

  return (
    <>
        <Router>
        <AppContent/>
        </Router>
    </>
  )
}

export default App