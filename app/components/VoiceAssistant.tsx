import React, { useState, useRef, useEffect } from 'react';
import { startLiveAudioSession } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/file';


const VoiceAssistant = ({ showToast }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState({
    fullInputTranscription: '',
    fullOutputTranscription: '',
    history: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemInstruction, setSystemInstruction] = useState('You are a friendly and helpful assistant.');

  const sessionRef = useRef(null); // Use any for the session object if its type is complex/unexported
  const mediaStreamRef = useRef(null); 
  const audioOutputContextRef = useRef(null); 
  const audioOutputNodeRef = useRef(null); 
  const audioSourcesRef = useRef(new Set()); // Explicitly type the Set
  const nextStartTimeRef = useRef(0); // Cursor for audio playback queue

  // Initialize AudioContext for output on component mount
  useEffect(() => {
    // Corrected: Use standard AudioContext
    const outputAudioContext = new AudioContext({ sampleRate: 24000 });
    audioOutputContextRef.current = outputAudioContext;
    const outputNode = outputAudioContext.createGain();
    audioOutputNodeRef.current = outputNode;
    outputNode.connect(outputAudioContext.destination);

    return () => {
      // Clean up audio context on unmount
      if (audioOutputContextRef.current) {
        audioOutputContextRef.current.close();
        audioOutputContextRef.current = null;
      }
      stopRecording();
    };
  }, []);

  const stopRecording = () => {
    // Fix: Add type guard to ensure mediaStreamRef.current is MediaStream
    if (mediaStreamRef.current instanceof MediaStream) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        // Fix: Add type guard to ensure track is a MediaStreamTrack
        if (track instanceof MediaStreamTrack) {
          track.stop();
        }
      });
      mediaStreamRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    // Stop all playing audio
    audioSourcesRef.current.forEach((source) => {
      // Fix: Add type assertion for source to ensure .stop() is available
      if (source instanceof AudioBufferSourceNode) {
        source.stop();
      }
    });
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0; // Reset audio playback cursor
    setIsRecording(false);
    setIsLoading(false);
  };

  const handleStartRecording = async () => {
    setError(null);
    setIsLoading(true);
    setTranscription({ fullInputTranscription: '', fullOutputTranscription: '', history: [] });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const session = await startLiveAudioSession(
        handleLiveMessage,
        handleLiveError,
        handleLiveClose,
        async () => stream, // Pass the stream here
        systemInstruction,
      );
      sessionRef.current = session;
      setIsRecording(true);
      showToast('Voice assistant started!', 'success');
    } catch (err) {
      console.error('Error starting live session:', err);
      const errorMessage = `Failed to start voice assistant: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
      stopRecording(); // Ensure cleanup on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveMessage = async (message) => {
    // Process audio output
    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
    if (base64EncodedAudioString && audioOutputContextRef.current && audioOutputNodeRef.current) {
      nextStartTimeRef.current = Math.max(
        nextStartTimeRef.current,
        audioOutputContextRef.current.currentTime,
      );
      const audioBuffer = await decodeAudioData(
        decode(base64EncodedAudioString),
        audioOutputContextRef.current,
        24000, // sampleRate
        1, // numChannels
      );
      const source = audioOutputContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioOutputNodeRef.current);
      source.addEventListener('ended', () => {
        audioSourcesRef.current.delete(source);
      });

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
      audioSourcesRef.current.add(source);
    }

    // Handle interruption
    const interrupted = message.serverContent?.interrupted;
    if (interrupted) {
      audioSourcesRef.current.forEach((source) => {
        if (source instanceof AudioBufferSourceNode) {
          source.stop();
        }
      }); // Ensure stop is called on AudioBufferSourceNode
      audioSourcesRef.current.clear();
      nextStartTimeRef.current = 0;
    }

    // Process transcription
    setTranscription((prev) => {
      let currentInput = prev.fullInputTranscription;
      let currentOutput = prev.fullOutputTranscription;
      const history = [...prev.history];

      if (message.serverContent?.inputTranscription) {
        currentInput += message.serverContent.inputTranscription.text;
      }
      if (message.serverContent?.outputTranscription) {
        currentOutput += message.serverContent.outputTranscription.text;
      }

      if (message.serverContent?.turnComplete) {
        if (currentInput) history.push(`You: ${currentInput}`);
        if (currentOutput) history.push(`Assistant: ${currentOutput}`);
        currentInput = '';
        currentOutput = '';
      }

      return {
        fullInputTranscription: currentInput,
        fullOutputTranscription: currentOutput,
        history,
      };
    });

    // Handle function calls
    if (message.toolCall) {
      for (const fc of message.toolCall.functionCalls) {
        console.debug('Function call:', fc);
        // Example: Assume controlLight function is executed
        const result = "ok"; // Simulate successful execution
        if (sessionRef.current) {
          sessionRef.current.sendToolResponse({
            functionResponses: {
              id: fc.id, 
              name: fc.name,
              response: { result: result },
            },
          });
        }
      }
    }
  };

  const handleLiveError = (e) => {
    console.error('Live session error:', e);
    const errorMessage = `Live session error: ${e.message}`;
    setError(errorMessage);
    showToast(errorMessage, 'error');
    stopRecording();
  };

  const handleLiveClose = (e) => {
    console.debug('Live session closed:', e);
    setIsRecording(false);
    setIsLoading(false);
    showToast('Voice assistant stopped.', 'success');
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto h-full' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'AI Voice Assistant (Live API)',
    ),
    React.createElement(
      'div',
      { className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl mb-4' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'systemInstruction', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'System Instruction:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'system-instruction-input',
          id: 'systemInstruction',
          value: systemInstruction,
          onChange: (e) => setSystemInstruction(e.target.value),
          rows: 2,
          placeholder: 'You are a friendly and helpful customer support agent.',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'System instruction for voice assistant',
        }),
      ),
      React.createElement(
        'div',
        { className: 'flex justify-center space-x-4' },
        React.createElement(
          'button',
          {
            onClick: isRecording ? stopRecording : handleStartRecording,
            className: `px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
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
            : isRecording
            ? 'Stop Conversation'
            : 'Start Conversation',
        ),
      ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-4', role: 'alert' },
          error,
        ),
    ),
    React.createElement(
      'div',
      { className: 'mt-4 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl flex-grow overflow-y-auto custom-scrollbar' },
      React.createElement(
        'h3',
        { className: 'text-xl font-bold text-blue-300 mb-4' },
        'Transcription:',
      ),
      transcription.history.map((line, index) =>
        React.createElement(
          'p',
          { key: index, className: 'mb-2 text-gray-200' },
          line,
        ),
      ),
      transcription.fullInputTranscription &&
        React.createElement(
          'p',
          { className: 'text-blue-200' },
          'You (live): ',
          transcription.fullInputTranscription,
        ),
      transcription.fullOutputTranscription &&
        React.createElement(
          'p',
          { className: 'text-green-200' },
          'Assistant (live): ',
          transcription.fullOutputTranscription,
        ),
      !isRecording && !isLoading && transcription.history.length === 0 &&
        React.createElement(
          'p',
          { className: 'text-gray-400' },
          'Start a conversation to see transcription here.',
        ),
    ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_VOICE_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default VoiceAssistant;
