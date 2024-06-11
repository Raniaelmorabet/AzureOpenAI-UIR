import React from "react";
import { assets } from "../../assets/assets.js";

const Carousel = ({ handleCardClick }) => {
    return (
        <div className='cards'>
            <div className='card' onClick={() => handleCardClick("What is UIR ? How does it Help learners")}>
                <p>What is UIR ? How does it Help learners </p>
                <img src={assets.compass_icon} alt='compass-icon' />
            </div>
            <div className='card' onClick={() => handleCardClick("Suggest innovative ideas for a new project")}>
                <p>Suggest innovative ideas for a new project</p>
                <img src={assets.bulb_icon} alt='bulb-icon' />
            </div>
            <div className='card' onClick={() => handleCardClick("Suggest improvements for the current system")}>
                <p>Suggest improvements for the current system</p>
                <img src={assets.message_icon} alt='message-icon' />
            </div>
            <div className='card' onClick={() => handleCardClick("Provide coding tips and tricks")}>
                <p>Provide coding tips and tricks</p>
                <img src={assets.code_icon} alt='code-icon' />
            </div>
        </div>
    );
}

export default Carousel;