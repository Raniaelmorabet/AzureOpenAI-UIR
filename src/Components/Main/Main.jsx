import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Carousel from "../Carousel/Carousel.jsx";
import { assets } from "../../assets/assets.js";
import "./Main.css";

const Main = () => {
    const [question, setQuestion] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCarousel, setShowCarousel] = useState(true);
    const [conversation, setConversation] = useState([]);
    const [loadingAnim, setLoadingAnim] = useState(false);
    const [generatingResponse, setGeneratingResponse] = useState(false);
    const [typedResponse, setTypedResponse] = useState('');
    const [cardLoading, setCardLoading] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const typingTimeoutRef = useRef(null);
    const conversationEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    // Function responsible for chat scrolling
    const scrollToBottom = () => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    useEffect(() => {
        if (!userId) {
            // Redirect to login if userId is not available
            navigate('/');
        } else {
            fetch(`https://localhost:5182/Conversation/IdUser/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setConversationHistory(data["$values"]);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
    };

    // function responsible if the question is empty it will declare an alert else it will fetch the response
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (question.trim() === '') {
            alert('Please enter a question');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratingResponse(true);
        await fetchResponse(question);
    };

    // function responsible for the typeEffect of the responses
    const typeText = (text) => {
        setTypedResponse('');
        let i = 0;

        const type = () => {
            if (i < text.length) {
                setTypedResponse(prev => prev + text.charAt(i));
                i++;
                typingTimeoutRef.current = setTimeout(type, 50);
            } else {
                setGeneratingResponse(false);
            }
        };

        type();
    };

    // function responsible for the fetching Logic of the responses
    const fetchResponse = async (question) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const res = await fetch('http://localhost:5182/api/OpenAI', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    conversationId: 0,
                    userInput: question
                }),
            });

            const data = await res.json();
            const responseText = data.response;  // Extract the response text

            if (!res.ok) {
                setError(`Error: ${res.statusText} - ${responseText}`);
                setLoading(false);
                return;
            }

            const newEntry = { question, response: responseText };
            setConversationHistory((prev) => [...prev, newEntry]);
            setShowResult(true);
            setShowCarousel(false);

            typeText(responseText);

            setConversation(prevConversation => [...prevConversation, responseText]);
            setQuestion('');
        } catch (networkError) {
            setError(`Network error: ${networkError.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleCardClick = async (card) => {
        setCardLoading(true);

        try {
            await fetchResponse(card);
        } catch (error) {
            console.error('Error fetching response:', error);
        } finally {
            setCardLoading(false);
        }
    };

    return (
        <div className="main">
            <div className="nav flex items-center relative">
                <p>AzureOpenAI</p>
                <button className="ml-4" onClick={handleButtonClick}>
                    <img src={assets.user_icon} alt="User Icon" className="h-10 w-10" />
                </button>
                {isDropdownVisible && (
                    <div className={`drop absolute top-16 mr-8 right-0 bg-white shadow-lg rounded-md z-10`}>
                        <Link to='/LoginSignup'>
                            <ul className="list-none p-0 px-2 m-0 flex hover:bg-gray-200 hover:rounded-md">
                                <FaSignInAlt size={17} className='mt-[14px] text-[#183680]' />
                                <button className="p-2 cursor-pointer text-lg text-[#183680]">Sign In</button>
                            </ul>
                        </Link>
                    </div>
                )}
            </div>

            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className='greet text-center'>
                            <p><span>Azul, UIR</span></p>
                            <p>How can I assist you today?</p>
                        </div>
                        {error && <p className='error text-red-500'>{error}</p>}
                        {showCarousel && <Carousel handleCardClick={handleCardClick} cardLoading={cardLoading}/>}
                    </>
                ) : null}

                <div className='main-bottom'>
                    {conversation.length > 0 &&
                        <div className='conversation space-y-4'>
                            {conversationHistory.map((convo, index) => (
                                <div key={index} className='conversation-entry flex flex-col space-y-2'>
                                    <div className='question-title flex items-center space-x-2'>
                                        <img className='question-img w-10' src={assets.user_icon} alt='User Icon' />
                                        <p>You <br /><span>{convo.question}</span></p>
                                    </div>
                                    <div className='response-data space-x-2'>
                                        <img src={assets.uir_icon} width={40} className='response-image' alt='Response Icon' />
                                        <p>AzureOpenAI <span><ReactMarkdown
                                            remarkPlugins={[remarkGfm]}>{index === conversationHistory.length - 1 && generatingResponse ? typedResponse : convo.response}</ReactMarkdown></span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={conversationEndRef} />
                        </div>
                    }

                    <form onSubmit={handleFormSubmit} className='search-box flex items-center space-x-2'>
                        <input
                            type="text"
                            id="question"
                            className='border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-transparent'
                            placeholder="Enter your question"
                            value={question}
                            onChange={handleInputChange}
                            disabled={generatingResponse}
                        />
                        <div>
                            <button
                                className='image-button'
                                type="submit"
                                disabled={generatingResponse}
                            >
                                {generatingResponse ? (
                                    <ClipLoader color="#183680" size={30} />
                                ) : (
                                    <img src={assets.send_icon} alt='Send Icon' />
                                )}
                            </button>
                        </div>
                    </form>

                    <p className='bottom-info text-gray-500 mt-4'>
                        The information provided here is exclusive to UIR and is intended solely for its use.
                        Unauthorized use, or distribution is strictly prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;