import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import "./Main.css";
import Carousel from "../Carousel/Carousel.jsx";
import { assets } from "../../assets/assets.js";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BsStopCircle } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";

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
    const typingTimeoutRef = useRef(null);
    const conversationEndRef = useRef(null);

    // Function responsible for chat scrolling
    const scrollToBottom = () => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

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

    // function responsible fot the typeEffect of the responses
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
                body: JSON.stringify({ question }),
            });

            const text = await res.text();
            if (!res.ok) {
                setError(`Error: ${res.statusText} - ${text}`);
                setLoading(false);
                return;
            }

            const newEntry = { question, response: text };
            setConversationHistory((prev) => [...prev, newEntry]);
            setShowResult(true);
            setShowCarousel(false);

            typeText(text);

            setConversation(prevConversation => [...prevConversation, text]);
            setQuestion('');
        } catch (networkError) {
            setError(`Network error: ${networkError.message}`);
        } finally {
            setLoading(false);
        }
    };

    // function responsible for stopping the response
    const handleStopResponse = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        setGeneratingResponse(false);
        setTypedResponse(prevTypedResponse => prevTypedResponse);
    };

    // function responsible for the loader in the cards whenever they are clicked
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
    // function responsible for the dropdown of the user Icon
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleButtonClick = () => {
        setIsDropdownVisible(!isDropdownVisible);
    }
    return (
        <div className="main">
            <div className="nav flex items-center relative">
                <p>AzureOpenAI</p>
                <button className="ml-4" onClick={() => handleButtonClick()}>
                    <img src={assets.user_icon} alt="User Icon" className="h-10 w-10"/>
                </button>
                {isDropdownVisible && (
                    <div className={`drop absolute top-16 mr-8 right-0 bg-white shadow-md rounded-md z-10`}>
                        <ul className="list-none p-0 m-0">
                            <li className="p-2 hover:bg-gray-200 hover:rounded-md cursor-pointer text-[#183680]">Sign In</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className='greet text-center'>
                            <p><span>
                                Azul, UIR
                            </span></p>
                            <p>How can I Assist you today?</p>
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
                                        <img className='question-img w-10' src={assets.user_icon} alt='User Icon'/>
                                        <p>You <br/><span>{convo.question}</span></p>
                                    </div>
                                    <div className='response-data space-x-2'>
                                        <img src={assets.uir_icon} width={40} className='response-image'
                                             alt='Response Icon'/>
                                        <p>AzureOpenAI <span><ReactMarkdown
                                            remarkPlugins={[remarkGfm]}>{index === conversationHistory.length - 1 && generatingResponse ? typedResponse : convo.response}</ReactMarkdown></span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={conversationEndRef}/>
                        </div>
                    }

                    <form onSubmit={handleFormSubmit} className='search-box flex items-center space-x-2'>
                        <input
                            type="text"
                            id="question"
                            className='border border-gray-300 rounded-md px-4 py-2 w-full'
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
                                    <ClipLoader color="#183680" size={30}/>
                                ) : (
                                    <img src={assets.send_icon} alt='Send Icon'/>
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