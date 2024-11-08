import React, { useState } from 'react';

const VoiceQuery = ({ onQuery }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      onQuery(speechToText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleVoiceInput}
      className={`ml-2 px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
    >
      {isListening ? 'Listening...' : 'Voice Input'}
    </button>
  );
};

export default VoiceQuery;