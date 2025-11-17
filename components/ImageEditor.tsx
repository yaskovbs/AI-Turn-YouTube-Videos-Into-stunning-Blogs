import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/file';

const ImageEditor = ({ showToast }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setEditedImage(null); // Clear edited image when new original is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async (e) => {
    e.preventDefault();
    setError(null);
    setEditedImage(null);

    if (!imageFile || !originalImage) {
      const errorMessage = 'Please upload an image first.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }
    if (!editPrompt.trim()) {
      const errorMessage = 'Please enter an editing prompt.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const base64Image = await fileToBase64(imageFile);
      const response = await editImage({
        imageBytes: base64Image,
        mimeType: imageFile.type,
        prompt: editPrompt,
      });
      setEditedImage(response.editedImageUrl);
      showToast('Image edited successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to edit image: ${err instanceof Error ? err.message : String(err)}`;
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
      'Edit Images with AI',
    ),
    React.createElement(
      'form',
      { onSubmit: handleEditImage, className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'imageUpload', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Upload Image:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('input', {
          key: 'image-upload-input',
          type: 'file',
          id: 'imageUpload',
          accept: 'image/*',
          onChange: handleImageUpload,
          ref: fileInputRef,
          className: 'block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer',
          'aria-label': 'Upload image file',
        }),
      ),
      originalImage &&
        React.createElement(
          'div',
          { className: 'mb-4' },
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-blue-300 mb-2' },
            'Original Image:',
          ),
          React.createElement('img', {
            src: originalImage,
            alt: 'Original',
            className: 'w-full h-auto rounded-lg border border-gray-700 max-h-96 object-contain',
          }),
        ),
      React.createElement(
        'div',
        { className: 'mb-6' },
        React.createElement(
          'label',
          { htmlFor: 'editPrompt', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'Editing Prompt:',
        ),
        // Fix: Added `key` prop, which sometimes helps React.createElement's type inference.
        React.createElement('textarea', {
          key: 'edit-prompt-input',
          id: 'editPrompt',
          value: editPrompt,
          onChange: (e) => setEditPrompt(e.target.value),
          rows: 3,
          placeholder: 'Add a retro filter, remove the person in the background...',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 resize-none',
          'aria-label': 'Image editing prompt input',
        }),
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: `w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
            isLoading || !originalImage ? 'opacity-50 cursor-not-allowed' : ''
          }`,
          disabled: isLoading || !originalImage,
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
          : 'Edit Image',
      ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-4', role: 'alert' },
          error,
        ),
    ),
    editedImage &&
      React.createElement(
        'div',
        { className: 'mt-8 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-4' },
          'Edited Image:',
        ),
        React.createElement('img', {
          src: editedImage,
          alt: 'Edited by AI',
          className: 'w-full h-auto rounded-lg border border-gray-700 max-h-96 object-contain',
        }),
      ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_IMAGE_EDIT_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default ImageEditor;
