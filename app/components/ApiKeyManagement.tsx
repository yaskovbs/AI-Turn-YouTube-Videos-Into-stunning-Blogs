import React, { useEffect, useState } from 'react';
import { getYouTubeApiKey, setYouTubeApiKey } from '../utils/youtube';

// Helper functions for Gemini API Key
const getGeminiApiKey = () => localStorage.getItem('gemini_api_key') || '';
const setGeminiApiKey = (key: string) => localStorage.setItem('gemini_api_key', key);

const ApiKeyManagement = ({ showToast, setCurrentView }) => {
  const [youtubeApiKey, setYoutubeApiKeyState] = useState('');
  const [geminiApiKey, setGeminiApiKeyState] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved YouTube API key from localStorage
    const savedYouTubeKey = getYouTubeApiKey();
    if (savedYouTubeKey) {
      setYoutubeApiKeyState(savedYouTubeKey);
    }

    // Load saved Gemini API key from localStorage
    const savedGeminiKey = getGeminiApiKey();
    if (savedGeminiKey) {
      setGeminiApiKeyState(savedGeminiKey);
    }

    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  const handleYouTubeApiKeyChange = (e) => {
    setYoutubeApiKeyState(e.target.value);
    setError(null);
  };

  const handleGeminiApiKeyChange = (e) => {
    setGeminiApiKeyState(e.target.value);
    setError(null);
  };

  const handleSaveYouTubeApiKey = () => {
    if (youtubeApiKey.trim()) {
      setYouTubeApiKey(youtubeApiKey.trim());
      showToast('YouTube Data API Key saved!', 'success');
      setError(null);
    } else {
      setError('Please enter a valid API key.');
      showToast('Please enter a valid API key.', 'error');
    }
  };

  const handleSaveGeminiApiKey = () => {
    if (geminiApiKey.trim()) {
      setGeminiApiKey(geminiApiKey.trim());
      showToast('מפתח Google Gemini API נשמר בהצלחה!', 'success');
      setError(null);
    } else {
      setError('נא להזין מפתח API תקין.');
      showToast('נא להזין מפתח API תקין.', 'error');
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'ניהול מפתחות API',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-4' },
      'AI Studio משתמש במפתחות API כדי להתחבר לשירותי בינה מלאכותית חיצוניים ולשפר את הפונקציונליות שלו.',
      React.createElement('br', null),
      'הבנת אופן הפעולה של מפתחות API ואופן ניהולם חשובה לאבטחה ולשימוש יעיל.',
    ),

    React.createElement(
      'div',
      { className: 'w-full max-w-lg bg-linear-to-br from-purple-900/40 to-gray-800/60 p-6 rounded-xl shadow-2xl mt-8 text-left border border-purple-500/30' },
      React.createElement(
        'h3',
        { className: 'text-2xl font-black text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text mb-6 flex items-center gap-2' },
        '🔑 מפתח API של Google Gemini',
      ),
      React.createElement(
        'div',
        { className: 'mb-6' },
        React.createElement(
          'label',
          { htmlFor: 'geminiApiKey', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'מפתח Google Gemini API:',
        ),
        React.createElement('input', {
          key: 'gemini-api-key-input',
          type: 'password',
          id: 'geminiApiKey',
          value: geminiApiKey,
          onChange: handleGeminiApiKeyChange,
          placeholder: 'הזינו את מפתח ה-Gemini API שלכם',
          className: 'shadow-lg appearance-none border-2 border-purple-500/30 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 bg-gray-900/80 transition-all',
          'aria-label': 'Gemini API key input',
          'data-testid': 'gemini-api-key-input',
        }),
        React.createElement(
          'button',
          {
            onClick: handleSaveGeminiApiKey,
            className: 'mt-3 w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50',
            'data-testid': 'save-gemini-key-button',
          },
          '💾 שמור מפתח Gemini API',
        ),
      ),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside text-gray-300 space-y-3 mb-6 bg-gray-900/50 p-4 rounded-lg' },
        React.createElement(
          'li',
          null,
          React.createElement('strong', { className: 'text-purple-300' }, 'שימוש:'),
          ' מפתח זה משמש את AI Studio לגישה למודלי Gemini עבור יצירת בלוגים, תמונות, וידאו, צ\'אט, קול ו-TTS.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', { className: 'text-purple-300' }, 'אבטחה:'),
          ' מפתח ה-API נשמר בדפדפן שלכם (localStorage) ונשלח ישירות ל-API של Google.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', { className: 'text-purple-300' }, 'קבלת מפתח:'),
          ' קבלו מפתח API חינם ב-',
          React.createElement(
            'a',
            {
              href: 'https://aistudio.google.com/apikey',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-cyan-400 hover:text-cyan-300 underline font-semibold',
            },
            'Google AI Studio',
          ),
        ),
      ),

      React.createElement(
        'h3',
        { className: 'text-xl font-bold text-blue-300 mb-4' },
        'מפתח YouTube Data API v3:',
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'youtubeApiKey', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'מפתח YouTube Data API:',
        ),
        React.createElement('input', {
          key: 'youtube-api-key-input',
          type: 'password',
          id: 'youtubeApiKey',
          value: youtubeApiKey,
          onChange: handleYouTubeApiKeyChange,
          placeholder: 'הזינו את מפתח ה-YouTube Data API שלכם',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
          'aria-label': 'YouTube Data API key input',
        }),
        React.createElement(
          'button',
          {
            onClick: handleSaveYouTubeApiKey,
            className: 'mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200',
          },
          'שמור מפתח YouTube API',
        ),
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'p',
          { className: 'text-sm text-gray-300 mb-2' },
          'לניהול מתקדם של ערוץ היוטיוב שלכם (כולל טעינת נתוני ערוץ): ',
          React.createElement(
            'button',
            {
              onClick: () => {
                setCurrentView('youtube-channel');
              },
              className: 'text-blue-400 hover:text-blue-300 underline cursor-pointer bg-transparent border-none p-0',
            },
            'עברו לעמוד ערוץ היוטיוב',
          ),
        ),
      ),
      React.createElement(
        'div',
        { className: 'bg-yellow-900 border border-yellow-400 text-yellow-100 px-4 py-3 rounded mb-6' },
        React.createElement(
          'strong',
          { className: 'font-bold' },
          'אזהרת אבטחה:',
        ),
        ' מפתח ה-YouTube Data API נשמר בדפדפן שלכם (localStorage). לשימוש בסביבת ייצור, מומלץ להשתמש בשרת back-end עם proxy.',
      ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-2 mb-4', role: 'alert' },
          error,
        ),

      React.createElement(
        'h3',
        { className: 'text-xl font-bold text-blue-300 mb-4' },
        'מפתח Google AdSense (עבור בלוגים של משתמשים):',
      ),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside text-gray-300 space-y-2 mb-6' },
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'שימוש:'),
          ' אם תרצו להציג מודעות AdSense בבלוגים הפרטיים שלכם (שתהיה אפשרות ליצור בעתיד), תצטרכו לספק את מזהה ה-publisher שלכם ב-AdSense.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'אבטחה:'),
          ' ניהול AdSense עבור בלוגים מרובים עם דומיינים מותאמים אישית דורש תשתית בק-אנד מורכבת עבור אימות בעלות על אתרים, הצגת מודעות ודיווח. תכונה זו תהיה זמינה כחלק מפלטפורמת ניהול בלוגים מקיפה.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'אימות:'),
          ' תכונות אימות כמו קטע קוד של AdSense, קובץ ',
          React.createElement('code', null, 'ads.txt'),
          ' או תג מטא יסופקו במסגרת מערכת ניהול הבלוגים.',
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_API_KEY_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
    React.createElement(
      'p',
      { className: 'text-md text-gray-400 mt-8' },
      'אנו מחויבים לאבטחת המידע שלכם. תמיד נשאף לספק דרכים מאובטחות לשימוש במפתחות ה-API שלכם.',
    ),
  );
};

export default ApiKeyManagement;
