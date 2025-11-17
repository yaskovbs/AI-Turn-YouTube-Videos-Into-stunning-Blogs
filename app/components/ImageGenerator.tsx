import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

const ImageGenerator = ({ showToast }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState(
    '1:1'
  );
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setError(null);
    setImageUrl(null);

    if (!prompt.trim()) {
      const errorMessage = 'Please enter a prompt for image generation.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateImage({ prompt, aspectRatio });
      setImageUrl(response.imageUrl);
      showToast('Image generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to generate image: ${err instanceof Error ? err.message : String(err)}`;
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
      'Generate Images with AI',
    ),
    React.createElement(
      'form',
      { onSubmit: handleGenerateImage, className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'prompt', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Image Prompt:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'prompt-input',
          id: 'prompt',
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          rows: 3,
          placeholder: 'A futuristic city at sunset, highly detailed, cyberpunk style...',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'Image prompt input',
        }),
      ),
      React.createElement(
        'div',
        { className: 'mb-6' },
        React.createElement(
          'label',
          { htmlFor: 'aspectRatio', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Aspect Ratio:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement(
          'select',
          {
            key: 'aspect-ratio-select',
            id: 'aspectRatio',
            value: aspectRatio,
            onChange: (e) =>
              setAspectRatio(
                e.target.value
              )
            ,
            className: 'shadow border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
            'aria-label': 'Aspect ratio selector',
          },
          React.createElement('option', { value: '1:1' }, '1:1 (Square)'),
          React.createElement('option', { value: '3:4' }, '3:4 (Portrait)'),
          React.createElement('option', { value: '4:3' }, '4:3 (Landscape)'),
          React.createElement('option', { value: '9:16' }, '9:16 (Tall Portrait)'),
          React.createElement('option', { value: '16:9' }, '16:9 (Widescreen)'),
        ),
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
          : 'Generate Image',
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
        'Generating image... This may take a few seconds.',
      ),
    ),
    imageUrl &&
      React.createElement(
        'div',
        { className: 'mt-8 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-4' },
          'Generated Image:',
        ),
        React.createElement('img', {
          src: imageUrl,
          alt: 'Generated by AI',
          className: 'w-full h-auto rounded-lg border border-gray-700',
        }),
      ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_IMAGE_GEN_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default ImageGenerator;
