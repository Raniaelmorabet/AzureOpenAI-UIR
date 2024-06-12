import React, { useState } from "react";
import "./LoginSignUp.css";
import { assets } from "../../assets/assets.js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = () => {
    const [action, setAction] = useState("Sign Up");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleNameChange = ({ target: { value } }) => {
        setName(value);
    };

    const handleEmailChange = ({ target: { value } }) => {
        setEmail(value);
    };

    const handlePasswordChange = ({ target: { value } }) => {
        setPassword(value);
    };

    const handleLogin = async () => {
        const params = {
            UserName: name,
            Password: password,
        };

        const url = 'https://localhost:7043/User/login';

        try {
            const result = await axios.post(url, null, { params });
            console.log(params);
            alert(`Success: ${result.data}`);
            const userId = result.data.id;

            navigate('/sidebar', { state: { userId } });
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.status} - ${error.response.data}`);
            } else if (error.request) {
                alert('Error: No response from server.');
            } else {
                alert('Error: Request setup failed.');
            }
        }
    };

    return (
        <>
            <img src={assets.Uirback} className='back-img' alt="Background" />
            <div className='Main-container'>
                <div className='Login-container'>
                    <div className='header'>
                        <div className='text'>{action}</div>
                        <div className='underline'></div>
                    </div>
                    <div className='inputs'>
                        {action === "Login" ? null : (
                            <div className='input'>
                                <img src={assets.person} alt='person' />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className='focus:outline-none focus:ring-transparent'
                                    onChange={handleNameChange}
                                />
                            </div>
                        )}
                        <div className='input'>
                            <img src={assets.email} alt='email' />
                            <input
                                type="email"
                                placeholder="Email"
                                className='focus:outline-none focus:ring-transparent'
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className='input'>
                            <img src={assets.password} alt='password' />
                            <input
                                type="password"
                                placeholder="Password"
                                className='focus:outline-none focus:ring-transparent'
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                    <div className='submit-container'>
                        <div className={action === "Login" ? "Submit gray" : "submit"} onClick={() => {
                            setAction("Sign Up");
                        }}>Sign Up
                        </div>
                        <div className={action === "Sign Up" ? "Submit gray" : "submit"} onClick={async () => {
                            if (action === "Login") {
                                await handleLogin();
                            } else {
                                setAction("Login");
                            }
                        }}>Login
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginSignUp;