import React, { useState, useEffect } from 'react';

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchConversations();
        fetchResponses();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await fetch('https://localhost:7043/api/Conversations');
            const data = await response.json();
            setConversations(data?.$values || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchResponses = async () => {
        try {
            const response = await fetch('https://localhost:7043/api/Responses');
            const data = await response.json();
            setResponses(data?.$values || []);
        } catch (error) {
            console.error('Error fetching responses:', error);
        }
    };



    const deleteConversation = async (id) => {
        if (window.confirm('Are you sure you want to delete this conversation?')) {
            try {
                const response = await fetch(`https://localhost:7043/api/Conversations/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchConversations();
                } else {
                    console.error('Failed to delete conversation:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting conversation:', error);
            }
        }
    };

    return (
        <div>
            <h1>Conversations</h1>
            <ul>
                {conversations.map(conversation => (
                    <li key={conversation.id}>
                        conversation: {conversation.id}
                        <ul>
                            {conversation.questions.$values.map(question => (
                                <li key={question.id}>
                                   Q Text: {question.text} , {question.question}
                                </li>
                            ))}
                             {responses.map(response => (
                    <li key={response.id}>
                        Response: {response.text}
                    </li>
                ))}
                        </ul>
                       
                        <button onClick={() => deleteConversation(conversation.id)}>Delete</button>
                    </li>
                ))}
            </ul>
         
           
        </div>
    );
};

export default Conversations;
