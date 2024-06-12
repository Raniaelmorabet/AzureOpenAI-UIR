import React, {useState} from "react"
import "./LoginSignUp.css"
import {assets} from "../../assets/assets.js";
const LoginSignUp=()=> {

    const [action, setAction] =useState("Sign Up");

    return(
        <>
            <img src={assets.Uirback} className='back-img'/>
            <div className='Main-container'>
                <div className='Login-container'>
                    <div className='header'>
                        <div className='text'>{action}</div>
                        <div className='underline'></div>
                    </div>
                    <div className='inputs'>
                        {action === "Login" ? <div></div> :
                            <div className='input'>
                                <img src={assets.person} alt='person'/>
                                <input type='text' placeholder='Name'/>
                            </div>
                        }
                        <div className='input'>
                            <img src={assets.email} alt='email'/>
                            <input type='email' placeholder='Email'/>
                        </div>
                        <div className='input'>
                            <img src={assets.password} alt='password'/>
                            <input type='password' placeholder='Password'/>
                        </div>
                    </div>
                    <div className='submit-container'>
                        <div className={action === "Login" ? "Submit gray" : "submit"} onClick={() => {
                            setAction("Sign Up")
                        }}>Sign Up
                        </div>
                        <div className={action === "Sign Up" ? "Submit gray" : "submit"} onClick={() => {
                            setAction("Login")
                        }}>Login
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
export default LoginSignUp