import React, { useState, useRef } from 'react';
import { analyzeVideo } from '../services/geminiService';
import { getVideoThumbnail } from '../utils/file';

const VideoAnalyzer = ({ showToast }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleVideoUpload = async (e) => {
    setError(null);
    setAnalysisResult(null);
    setThumbnailUrl(null);
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      try {
        const thumb = await getVideoThumbnail(file);
        setThumbnailUrl(thumb);
      } catch (err) {
        console.error('Error generating thumbnail:', err);
        const errorMessage = 'Could not generate video thumbnail. Please try another video.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        setThumbnailUrl(null);
      }
    }
  };

  const handleAnalyzeVideo = async (e) => {
    e.preventDefault();
    setError(null);
    setAnalysisResult(null);

    if (!videoFile || !thumbnailUrl) {
      const errorMessage = 'Please upload a video file first.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    if (!analysisPrompt.trim()) {
      const errorMessage = 'Please enter an analysis prompt.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await analyzeVideo(
        { videoFile, analysisPrompt },
        thumbnailUrl, // Pass thumbnail base64 directly
      );
      setAnalysisResult(response.analysisResult);
      showToast('Video analyzed successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to analyze video: ${err instanceof Error ? err.message : String(err)}`;
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
      'Analyze Videos with AI',
    ),
    React.createElement(
      'form',
      { onSubmit: handleAnalyzeVideo, className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'videoUpload', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Upload Video:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('input', {
          key: 'video-upload-input',
          type: 'file',
          id: 'videoUpload',
          accept: 'video/*',
          onChange: handleVideoUpload,
          ref: fileInputRef,
          className: 'block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer',
          'aria-label': 'Upload video file',
        }),
      ),
      videoFile &&
        React.createElement(
          'p',
          { className: 'text-gray-400 text-xs mb-4' },
          'Video: ',
          videoFile.name,
          ' (Thumbnail generated from first frame)',
        ),
      thumbnailUrl &&
        React.createElement(
          'div',
          { className: 'mb-4' },
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-blue-300 mb-2' },
            'Video Thumbnail:',
          ),
          React.createElement('img', {
            src: thumbnailUrl,
            alt: 'Video Thumbnail',
            className: 'w-full h-auto rounded-lg border border-gray-700 max-h-64 object-contain',
          }),
        ),
      React.createElement(
        'div',
        { className: 'mb-6' },
        React.createElement(
          'label',
          { htmlFor: 'analysisPrompt', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Analysis Prompt:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'analysis-prompt-input',
          id: 'analysisPrompt',
          value: analysisPrompt,
          onChange: (e) => setAnalysisPrompt(e.target.value),
          rows: 4,
          placeholder: 'What are the key events in this video? Summarize the content. Identify objects present.',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'Video analysis prompt input',
        }),
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: `w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
            isLoading || !videoFile || !thumbnailUrl ? 'opacity-50 cursor-not-allowed' : ''
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
          : 'Analyze Video',
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
        'Analyzing video... This might take a while depending on video length and prompt complexity.',
      ),
    ),
    analysisResult &&
      React.createElement(
        'div',
        { className: 'mt-8 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-4' },
          'Analysis Result:',
        ),
        React.createElement('div', {
          className: 'prose prose-invert max-w-none break-words whitespace-pre-wrap',
          dangerouslySetInnerHTML: { __html: analysisResult },
        }),
      ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_VIDEO_ANALYZE_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default VideoAnalyzer;
