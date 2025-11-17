import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';

const TextToSpeech = ({ showToast }) => {
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null); // Explicitly type AudioContext
  const audioSourceRef = useRef(null); // Explicitly type AudioBufferSourceNode

  useEffect(() => {
    return () => {
      // Clean up audio context on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const handleGenerateSpeech = async (e) => {
    e.preventDefault();
    setError(null);

    if (!textInput.trim()) {
      const errorMessage = 'Please enter some text to convert to speech.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }

    setIsLoading(true);
    // Stop any currently playing audio
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }

    try {
      // Corrected: Use standard AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const response = await generateSpeech({ text: textInput });
      const buffer = response.audioBuffer;

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      audioSourceRef.current = source; // Keep reference to current source

      source.onended = () => {
        audioSourceRef.current = null; // Clear reference once finished
      };
      showToast('Speech generated and playing!', 'success');
    } catch (err) {
      console.error('Error generating speech:', err);
      const errorMessage = `Failed to generate speech: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'Text-to-Speech',
    ),
    React.createElement(
      'form',
      { onSubmit: handleGenerateSpeech, className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'textInput', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Text to Speak:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'text-input-field',
          id: 'textInput',
          value: textInput,
          onChange: (e) => setTextInput(e.target.value),
          rows: 6,
          placeholder: 'Enter text here to convert to speech...',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'Text input for speech generation',
        }),
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: `w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`,
          disabled: isLoading,
        },
        isLoading
          ? (
              React.createElement(
                'svg',
                {
                  className: 'animate-spin h-5 w-5 text-white mx-auto',
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
          : 'Generate Speech',
      ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-4', role: 'alert' },
          error,
        ),
      isLoading && React.createElement(
        'p',
        { className: 'text-blue-300 text-center mt-4' },
        'Generating speech... This may take a few seconds.',
      ),
    ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_TTS_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default TextToSpeech;
