import React, { useEffect, useState } from 'react';
import { getYouTubeApiKey, setYouTubeApiKey } from '../utils/youtube';

const ApiKeyManagement = ({ showToast, setCurrentView }) => {
  const [youtubeApiKey, setYoutubeApiKeyState] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved YouTube API key from localStorage
    const savedKey = getYouTubeApiKey();
    if (savedKey) {
      setYoutubeApiKeyState(savedKey);
    }

    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  const handleYouTubeApiKeyChange = (e) => {
    setYoutubeApiKeyState(e.target.value);
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
      { className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl mt-8 text-left' },
      React.createElement(
        'h3',
        { className: 'text-xl font-bold text-blue-300 mb-4' },
        'מפתח API של Google Gemini:',
      ),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside text-gray-300 space-y-2 mb-6' },
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'שימוש:'),
          ' מפתח זה משמש את AI Studio לגישה למודלי Gemini עבור יצירת בלוגים, תמונות, וידאו, צ\'אט, קול ו-TTS.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'אבטחה:'),
          ' מפתח ה-API הראשי של AI Studio נשמר באופן מאובטח בסביבת השרת ואינו נחשף ישירות בצד הלקוח.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'למשתמשים:'),
          ' אתם יכולים לבחור מפתח API משלכם עבור תכונות מסוימות כמו יצירת וידאו ב-Veo דרך הממשק המאובטח שלנו (',
          React.createElement('code', null, 'window.aistudio.openSelectKey()'),
          ').',
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
