import React, { useEffect } from 'react';
import { signIn } from '../services/authService';

const Login = ({ showToast }: { showToast: (message: string, type: string) => void }) => {
  useEffect(() => {
    // Auto-trigger Google sign-in on component mount for convenience
    const timer = setTimeout(() => {
      signIn();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = () => {
    signIn();
  };

  return React.createElement(
    'div',
    {
      className: 'min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4'
    },
    React.createElement(
      'div',
      { className: 'w-full max-w-md' },
      // Header with logo
      React.createElement(
        'div',
        { className: 'text-center mb-12' },
        React.createElement(
          'div',
          { className: 'w-20 h-20 bg-linear-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6' },
          React.createElement(
            'span',
            { className: 'text-white text-3xl font-bold' },
            'AI'
          )
        ),
        React.createElement(
          'h1',
          { className: 'text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' },
          'ברוכים הבאים ל-AI Studio'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 text-lg' },
          'התחברו כדי לגשת לכל הכלים שלנו'
        )
      ),

      // Login Card
      React.createElement(
        'div',
        { className: 'bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-800 p-8 shadow-2xl' },
        React.createElement(
          'div',
          { className: 'text-center mb-8' },
          React.createElement(
            'h2',
            { className: 'text-2xl font-bold text-white mb-4' },
            'התחברות עם Google'
          ),
          React.createElement(
            'p',
            { className: 'text-gray-400' },
            'התחברו בחשבון Google שלכם כדי להתחיל'
          )
        ),

        // Google Sign-in Button
        React.createElement(
          'div',
          { className: 'space-y-4' },
          React.createElement(
            'button',
            {
              onClick: handleGoogleSignIn,
              className: 'w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]',
              'data-testid': 'google-login-button'
            },
            React.createElement(
              'svg',
              {
                className: 'w-6 h-6',
                viewBox: '0 0 24 24',
                fill: 'currentColor'
              },
              React.createElement('path', {
                d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              }),
              React.createElement('path', {
                d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              }),
              React.createElement('path', {
                d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              }),
              React.createElement('path', {
                d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              })
            ),
            'התחברות עם Google'
          ),

          // Features preview
          React.createElement(
            'div',
            { className: 'mt-8 pt-6 border-t border-gray-800' },
            React.createElement(
              'h3',
              { className: 'text-lg font-semibold text-white text-center mb-4' },
              'מה תוכלו לעשות:'
            ),
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 gap-3 text-sm' },
              React.createElement(
                'div',
                { className: 'flex items-center gap-3 text-gray-300' },
                React.createElement('span', { className: 'text-purple-400' }, '📝'),
                'יצירת בלוגים מיוטיוב'
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-3 text-gray-300' },
                React.createElement('span', { className: 'text-cyan-400' }, '🎨'),
                'מחולל ועורך תמונות'
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-3 text-gray-300' },
                React.createElement('span', { className: 'text-pink-400' }, '🎬'),
                'יצירה ונין SQL של וידאו'
              ),
              React.createElement(
                'div',
                { className: 'flex items-center gap-3 text-gray-300' },
                React.createElement('span', { className: 'text-green-400' }, '💬'),
                'צ\'אט AI ואסיסטנט קולי'
              )
            )
          )
        )
      ),

      // Footer
      React.createElement(
        'div',
        { className: 'text-center mt-8 text-gray-500 text-sm' },
        React.createElement('p', null, 'מגובה בטכנולוגיית AI מתקדמת')
      )
    )
  );
};

export default Login;
