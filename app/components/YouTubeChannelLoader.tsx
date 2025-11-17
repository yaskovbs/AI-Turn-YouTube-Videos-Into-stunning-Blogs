import React, { useState } from 'react';
import { fetchYouTubeChannelData } from '../utils/youtube';

const YouTubeChannelLoader = ({ showToast, isLoggedIn, userProfile }: {
  showToast: (message: string, type: string) => void,
  isLoggedIn: boolean,
  userProfile?: { accessToken: string } & Record<string, any>
}) => {
  const [channelId, setChannelId] = useState('');
  const [channelData, setChannelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
    setError(null);
  };

  const handleLoadChannelData = async () => {
    setError(null);
    setChannelData(null);

    if (!isLoggedIn || !userProfile?.accessToken) {
      setError('Please log in with Google OAuth to load channel data.');
      showToast('Please log in with Google OAuth to load channel data.', 'error');
      return;
    }

    if (!channelId.trim()) {
      setError('Please enter a YouTube Channel ID.');
      showToast('Please enter a YouTube Channel ID.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchYouTubeChannelData(userProfile.accessToken, channelId.trim());
      setChannelData(data);
      showToast('Channel data loaded successfully!', 'success');
    } catch (err) {
      console.error('Error loading channel data:', err);
      const errorMessage = `Failed to load channel data: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'ערוץ היוטיוב שלי - (YouTube Data API)',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-4' },
      'כאן תוכלו לנהל את ערוץ היוטיוב שלכם על ידי שילוב ה-YouTube Data API.',
      React.createElement('br', null),
      'התכונה הזו תאפשר לכם להעלות סרטונים, לנהל פלייליסטים, לצפות בנתוני ערוץ ועוד, הכל מתוך AI Studio.',
    ),
    // Enhanced security warning
    React.createElement(
      'div',
      { className: 'bg-yellow-900 border border-yellow-400 text-yellow-100 px-4 py-3 rounded relative mb-6 w-full max-w-lg', role: 'alert' },
      React.createElement(
        'strong',
        { className: 'font-bold' },
        'אזהרת אבטחה חמורה:',
      ),
      ' ',
      React.createElement(
        'span',
        { className: 'block sm:inline' },
        'שימוש ב-OAuth tokens מאובטח יותר מאחסון API keys ישיר בדפדפן. בפרויקט ייצור, יש להשתמש בשרת בק-אנד (proxy) כדי להגן על הבקשות.',
      ),
    ),

    !isLoggedIn && React.createElement(
      'div',
      { className: 'text-center text-xl text-red-400 mt-4 mb-8' },
      'אנא התחברו כדי לנהל את מפתח ה-API שלכם ולטעון נתוני ערוץ.',
    ),

    isLoggedIn && React.createElement(
      'div',
      { className: 'w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl mt-8 text-left' },
      React.createElement(
        'h3',
        { className: 'text-xl font-bold text-blue-300 mb-4' },
        'טעינת נתוני ערוץ YouTube עם OAuth:',
      ),
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'label',
          { htmlFor: 'channelId', className: 'block text-gray-300 text-sm font-bold mb-2' },
          'מזהה ערוץ יוטיוב (לדוגמה: UC_xxxxxxxxxxxxxxxxx):',
        ),
        React.createElement('input', {
          key: 'youtube-channel-id-input',
          type: 'text',
          id: 'channelId',
          value: channelId,
          onChange: handleChannelIdChange,
          placeholder: 'הזינו את מזהה הערוץ שלכם',
          className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
          'aria-label': 'YouTube Channel ID input',
        }),
      ),
      React.createElement(
        'button',
        {
          onClick: handleLoadChannelData,
          className: `w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
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
          : 'טעון נתוני ערוץ',
      ),
      error &&
        React.createElement(
          'p',
          { className: 'text-red-500 text-center mt-4', role: 'alert' },
          error,
        ),
      channelData && React.createElement(
        'div',
        { className: 'mt-8 border-t border-gray-700 pt-6' },
        React.createElement('h3', { className: 'text-xl font-bold text-blue-300 mb-2' }, 'נתוני ערוץ נטענו:'),
        React.createElement('p', { className: 'text-gray-300' }, React.createElement('strong', null, 'שם ערוץ:'), ' ', channelData.title),
        React.createElement('p', { className: 'text-gray-300' }, React.createElement('strong', null, 'מזהה ערוץ:'), ' ', channelData.id),
        React.createElement('p', { className: 'text-gray-300' }, React.createElement('strong', null, 'תיאור:'), ' ', channelData.description),
        React.createElement(
          'a',
          { href: `https://www.youtube.com/channel/${channelData.id}`, target: '_blank', rel: 'noopener noreferrer', className: 'text-blue-400 hover:underline block mt-2' },
          'צפה בערוץ ביוטיוב',
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
        'data-ad-slot': 'YOUR_AD_SLOT_ID_YOUTUBE_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default YouTubeChannelLoader;
