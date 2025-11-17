import React, { useState, useRef } from 'react';
import { generateVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/file';
import { DOWNLOAD_ICON } from '../constants'; // Updated import to use correct constants file without explicit .tsx extension

const VideoGenerator = ({ showToast }) => {
  const [prompt, setPrompt] = useState('');
  const [startImageFile, setStartImageFile] = useState(null);
  const [endImageFile, setEndImageFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);

  const startImageInputRef = useRef(null);
  const endImageInputRef = useRef(null);

  const handleStartImageUpload = (e) => {
    setStartImageFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleEndImageUpload = (e) => {
    setEndImageFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleGenerateVideo = async (e) => {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    setEstimatedWaitTime('Generating video... This might take a few minutes depending on complexity.');

    if (!prompt.trim() && !startImageFile && !endImageFile) {
      const errorMessage = 'Please provide a prompt, a starting image, or both to generate a video.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsLoading(false);
      setEstimatedWaitTime(null);
      return;
    }

    setIsLoading(true);
    try {
      let startImageBase64;
      if (startImageFile) {
        const base64 = await fileToBase64(startImageFile);
        startImageBase64 = { imageBytes: base64, mimeType: startImageFile.type };
      }

      let endImageBase64;
      if (endImageFile) {
        const base64 = await fileToBase64(endImageFile);
        endImageBase64 = { imageBytes: base64, mimeType: endImageFile.type };
      }

      const response = await generateVideo({
        prompt,
        image: startImageBase64,
        lastFrame: endImageBase64,
        aspectRatio,
        resolution,
      });
      setVideoUrl(response.videoUrl);
      showToast('Video generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to generate video: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
      setEstimatedWaitTime(null);
    }
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'generated_video.mp4'; // You can make this more dynamic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Video download started!', 'success');
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'Generate Videos with AI',
    ),
    React.createElement(
      'form',
      { onSubmit: handleGenerateVideo, className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'prompt', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Video Prompt (optional):',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'video-prompt-input',
          id: 'prompt',
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          rows: 3,
          placeholder: 'A neon hologram of a cat driving at top speed...',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'Video prompt input',
        }),
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'startImageUpload', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Upload Starting Image (optional):',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('input', {
          key: 'start-image-upload-input',
          type: 'file',
          id: 'startImageUpload',
          accept: 'image/*',
          onChange: handleStartImageUpload,
          ref: startImageInputRef,
          className: 'block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer',
          'aria-label': 'Upload starting image',
        }),
        startImageFile && React.createElement('p', { className: 'text-gray-400 text-xs mt-1' }, startImageFile.name),
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'endImageUpload', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Upload Ending Image (optional):',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('input', {
          key: 'end-image-upload-input',
          type: 'file',
          id: 'endImageUpload',
          accept: 'image/*',
          onChange: handleEndImageUpload,
          ref: endImageInputRef,
          className: 'block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer',
          'aria-label': 'Upload ending image',
        }),
        endImageFile && React.createElement('p', { className: 'text-gray-400 text-xs mt-1' }, endImageFile.name),
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
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
            onChange: (e) => setAspectRatio(e.target.value),
            className: 'shadow border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
            'aria-label': 'Aspect ratio selector',
          },
          React.createElement('option', { value: '16:9' }, '16:9 (Landscape)'),
          React.createElement('option', { value: '9:16' }, '9:16 (Portrait)'),
        ),
      ),
      React.createElement(
        'div',
        { className: 'mb-6' },
        React.createElement(
          'label',
          { htmlFor: 'resolution', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Resolution:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement(
          'select',
          {
            key: 'resolution-select',
            id: 'resolution',
            value: resolution,
            onChange: (e) => setResolution(e.target.value),
            className: 'shadow border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
            'aria-label': 'Resolution selector',
          },
          React.createElement('option', { value: '720p' }, '720p'),
          React.createElement('option', { value: '1080p' }, '1080p'),
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
          : 'Generate Video',
      ),
      estimatedWaitTime &&
        React.createElement(
          'p',
          { className: 'text-blue-300 text-center mt-4' },
          estimatedWaitTime,
        ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-4', role: 'alert' },
          error,
        ),
    ),
    videoUrl &&
      React.createElement(
        'div',
        { className: 'mt-8 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-4' },
          'Generated Video:',
        ),
        React.createElement('video', {
          src: videoUrl,
          controls: true,
          className: 'w-full h-auto rounded-lg border border-gray-700',
          title: 'Generated Video by AI',
          style: { aspectRatio: aspectRatio === '16:9' ? '16 / 9' : '9 / 16' },
        }),
        React.createElement(
          'button',
          {
            onClick: handleDownloadVideo,
            className: 'flex items-center justify-center mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200',
            'aria-label': 'Download generated video',
          },
          DOWNLOAD_ICON,
          'Download Video',
        ),
      ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_VIDEO_GEN_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default VideoGenerator;
