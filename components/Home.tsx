import React, { useEffect } from 'react';

const Home = ({ showToast }) => {
  useEffect(() => {
    // Push AdSense ads when component mounts
  }, []);

  return React.createElement(
    'div',
    { className: 'w-full max-w-7xl mx-auto px-4 py-12' },
    React.createElement(
      'div',
      { className: 'text-center mb-16' },
      React.createElement(
        'h2',
        { className: 'text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' },
        'ברוכים הבאים ל-AI Studio!',
      ),
      React.createElement(
        'p',
        { className: 'text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto' },
        'הפלטפורמה האולטימטיבית שלך ליצירת תוכן באמצעות כוחה של בינה מלאכותית.'
      ),
      React.createElement(
        'p',
        { className: 'text-base md:text-lg text-gray-500' },
        'ממאמרים בבלוג ועד תמונות, סרטונים ושיחות קוליות - הכל במקום אחד!',
      ),
    ),

    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12' },
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '📝'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'יצירת בלוגים מיוטיוב',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'הפכו סרטוני יוטיוב למאמרי בלוג מרתקים ואיכותיים בשניות.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '🎨'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'מחולל ועורך תמונות',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'צרו תמונות מרהיבות מפרומפטים טקסטואליים ועצבו אותן בקלות.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '🎬'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'וידאו: יצירה וניתוח',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'הפיקו סרטונים מדהימים ונתחו תוכן וידאו לעומק בעזרת AI.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '💬'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'צ\'אט ועוזר קולי',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'נהלו שיחות טקסט או קול עם AI לקבלת מידע ותמיכה בזמן אמת.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '🔊'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'טקסט לדיבור',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'המירו כל טקסט לדיבור טבעי ואיכותי בקלות.',
        ),
      ),
      React.createElement(
        'div',
        { className: 'card-feature' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3 mb-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center' },
            '⚙️'
          ),
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text' },
            'שילוב API',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-gray-400 leading-relaxed' },
          'למפתחים: אפשרויות לשלב מפתחות API משלכם לשליטה מלאה.',
        ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'text-center' },
      React.createElement(
        'p',
        { className: 'text-md text-gray-500' },
        'חקור את הכלים שלנו והתחל ליצור עוד היום!',
      ),
    ),
  );
};

export default Home;
