import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToChatbot } from '../services/geminiService';
import { formatMarkdownToHtml } from '../utils/file';


const Chatbot = ({ showToast }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Request geolocation permission on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
          console.log('Geolocation successful:', position.coords);
        },
        (geoError) => {
          console.warn('Geolocation failed:', geoError);
          // Optionally set an error here if location is critical
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) {
      return;
    }

    const newMessage = { role: 'user', content: trimmedMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(messages, trimmedMessage, userLocation);
      setMessages((prev) => [...prev, response.newMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to get response: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col h-full p-4 w-full max-w-3xl mx-auto' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6 text-center' },
      'AI Chatbot',
    ),
    React.createElement(
      'div',
      { className: 'flex-grow overflow-y-auto p-4 bg-gray-800 rounded-lg shadow-xl mb-4 custom-scrollbar' },
      messages.map((msg, index) =>
        React.createElement(
          'div',
          {
            key: index,
            className: `mb-4 p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-700 text-white'
                : 'mr-auto bg-gray-700 text-gray-100'
            }`,
          },
          React.createElement(
            'strong',
            { className: 'capitalize' },
            msg.role === 'user' ? 'You:' : 'Gemini:',
          ),
          React.createElement('div', {
            dangerouslySetInnerHTML: { __html: formatMarkdownToHtml(msg.content) },
            className: 'prose prose-invert max-w-none text-sm break-words',
          }),
          msg.groundingUrls && msg.groundingUrls.length > 0 &&
            React.createElement(
              'div',
              { className: 'mt-2 text-xs text-blue-300' },
              React.createElement('strong', null, 'Sources:'),
              React.createElement(
                'ul',
                { className: 'list-disc pl-4' },
                msg.groundingUrls.map((url, urlIndex) =>
                  React.createElement(
                    'li',
                    { key: urlIndex },
                    React.createElement(
                      'a',
                      { href: url.uri, target: '_blank', rel: 'noopener noreferrer', className: 'hover:underline' },
                      url.title,
                    ),
                  ),
                ),
              ),
            ),
        ),
      ),
      React.createElement('div', { ref: messagesEndRef }),
    ),
    error &&
      React.createElement(
        'p',
        { className: 'text-red-500 text-center mb-4', role: 'alert' },
        error,
      ),
    React.createElement(
      'form',
      { onSubmit: handleSendMessage, className: 'flex w-full' },
      React.createElement('input', {
        type: 'text',
        value: inputMessage,
        onChange: (e) => setInputMessage(e.target.value),
        placeholder: 'Ask me anything...',
        className: 'flex-grow bg-gray-700 border-none focus:ring-0 text-white placeholder-gray-400 p-3 rounded-l-lg outline-none',
        disabled: isLoading,
        'aria-label': 'Chat message input',
      }),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: `bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-r-lg transition-colors duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`,
          disabled: isLoading,
        },
        isLoading
          ? (
              React.createElement(
                'svg',
                {
                  className: 'animate-spin h-5 w-5 text-white',
                  xmlns: 'http://www.w3.org/2000/svg',
                  fill: 'none',
                  viewBox: '0 0 24 24',
                },
                React.createElement('circle', {
                  className: 'opacity-25',
                  cx: '12',
                  cy: '12',
                  r: '10',
                  stroke: 'currentColor',
                  strokeWidth: '4',
                }),
                React.createElement('path', {
                  className: 'opacity-75',
                  fill: 'currentColor',
                  d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
                }),
              )
            )
          : 'Send',
      ),
    ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_CHATBOT_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default Chatbot;
