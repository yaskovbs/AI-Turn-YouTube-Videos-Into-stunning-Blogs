import React, { useEffect, useState } from 'react';

const Home = ({ showToast }: { showToast: (message: string, type: string) => void }) => {
  const [stats, setStats] = useState({
    rating: 5.0,
    uptime: 99.9,
    activeUsers: 496,
    blogsCreated: 1240
  });

  useEffect(() => {
    // Simulate real-time stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        blogsCreated: prev.blogsCreated + Math.floor(Math.random() * 4)
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return React.createElement(
    'div',
    { className: 'w-full max-w-7xl mx-auto px-4 py-12' },

    // Hero Section - YouTube to Blog focus
    React.createElement(
      'div',
      { className: 'text-center mb-16' },
      React.createElement(
        'h1',
        { className: 'text-6xl md:text-8xl font-black mb-6 bg-linear-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent animate-pulse' },
        '🎬 → 📝'
      ),
      React.createElement(
        'h2',
        { className: 'text-4xl md:text-6xl font-black mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent' },
        'הפוך סרטוני יוטיוב לבלוגים מושלמים!',
      ),
      React.createElement(
        'p',
        { className: 'text-xl md:text-3xl text-gray-300 mb-8 leading-relaxed font-bold' },
        'AI-powered YouTube Video to Blog Converter'
      ),
      React.createElement(
        'p',
        { className: 'text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8' },
        'צפהבאום סרטון יוטיוב והפוך אותו באופן אוטומטי למאמר בלוג מקצועי ומרתק עם כותרת, תיאור ותמונות.'
      ),
      React.createElement(
        'div',
        { className: 'bg-linear-to-r from-purple-900/50 to-cyan-900/50 rounded-2xl p-8 border border-purple-500/30 mb-8' },
        React.createElement(
          'h3',
          { className: 'text-2xl font-bold mb-4 text-cyan-400' },
          '🎯 איך זה עובד?'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 text-sm' },
          React.createElement('div', { className: 'text-center' }, '1️⃣ הזן קישור ליוטיוב'),
          React.createElement('div', { className: 'text-center' }, '2️⃣ בחר קהל יעד וטון'),
          React.createElement('div', { className: 'text-center' }, '3️⃣ קבל בלוג יפהפה!')
        )
      ),
    ),

    // Statistics Section - YouTube focused
    React.createElement(
      'div',
      { className: 'mb-16' },
      React.createElement(
        'h3',
        { className: 'text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent' },
        'התוצאות שלנו מדברות בעד עצמן'
      ),
      React.createElement(
        'p',
        { className: 'text-center text-gray-400 mb-8 text-lg' },
        'בלוגים שנוצרו מוידאו יוטיוב'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-4 gap-6' },
        // Blogs Created
        React.createElement(
          'div',
          { className: 'bg-linear-to-br from-red-900/50 to-pink-800/30 rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20' },
          React.createElement(
            'div',
            { className: 'flex flex-col items-center text-center' },
            React.createElement(
              'div',
              { className: 'text-4xl mb-3' },
              '📝'
            ),
            React.createElement(
              'div',
              { className: 'text-4xl md:text-5xl font-black text-pink-400 mb-2' },
              stats.blogsCreated
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'בלוגים נוצרו'
            )
          )
        ),
        // User Rating
        React.createElement(
          'div',
          { className: 'bg-linear-to-br from-yellow-900/50 to-orange-800/30 rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20' },
          React.createElement(
            'div',
            { className: 'flex flex-col items-center text-center' },
            React.createElement(
              'div',
              { className: 'text-4xl mb-3' },
              '⭐'
            ),
            React.createElement(
              'div',
              { className: 'text-4xl md:text-5xl font-black text-yellow-400 mb-2' },
              `${stats.rating}/5`
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'דירוג איכות'
            )
          )
        ),
        // Active Users
        React.createElement(
          'div',
          { className: 'bg-linear-to-br from-blue-900/50 to-cyan-800/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20' },
          React.createElement(
            'div',
            { className: 'flex flex-col items-center text-center' },
            React.createElement(
              'div',
              { className: 'text-4xl mb-3' },
              '👥'
            ),
            React.createElement(
              'div',
              { className: 'text-4xl md:text-5xl font-black text-cyan-400 mb-2' },
              stats.activeUsers
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'משתמשים פעילים'
            )
          )
        ),
        // Service Uptime
        React.createElement(
          'div',
          { className: 'bg-linear-to-br from-green-900/50 to-emerald-800/30 rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20' },
          React.createElement(
            'div',
            { className: 'flex flex-col items-center text-center' },
            React.createElement(
              'div',
              { className: 'text-4xl mb-3' },
              '⚡'
            ),
            React.createElement(
              'div',
              { className: 'text-4xl md:text-5xl font-black text-emerald-400 mb-2' },
              `${stats.uptime}%`
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'זמינות'
            )
          )
        )
      )
    ),

    // Features Section - YouTube to Blog specific
    React.createElement(
      'div',
      { className: 'mb-16' },
      React.createElement(
        'h3',
        { className: 'text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent' },
        'כלי העבודה שלנו'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },

        // Main Feature - YouTube to Blog
        React.createElement(
          'div',
          { className: 'bg-linear-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-8 border border-red-500/30' },
          React.createElement(
            'div',
            { className: 'flex items-center gap-4 mb-4' },
            React.createElement(
              'div',
              { className: 'text-4xl' },
              '🎥'
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'h4',
                { className: 'text-2xl font-bold bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2' },
                'המרת יוטיוב לטקסט בלוג'
              ),
              React.createElement(
                'div',
                { className: 'bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-semibold inline-block' },
                '⭐ אבן יסוד'
              )
            )
          ),
          React.createElement(
            'p',
            { className: 'text-gray-300 leading-relaxed mb-4' },
            'שלף תמלול, חלץ רעיונות מרכזיים וצור מאמר בלוג מלא וקרא בצורה אוטומטית.'
          ),
          React.createElement(
            'ul',
            { className: 'space-y-2 text-sm text-gray-400' },
            React.createElement('li', null, '• תמלול אוטומטי מדויק'),
            React.createElement('li', null, '• חילוץ מפתחות ורעיונות'),
            React.createElement('li', null, '• כתיבה באיכות עיתונאית'),
            React.createElement('li', null, '• תמונות וגרפיקה אוטומטית')
          )
        ),

        // Secondary Features Grid
        React.createElement(
          'div',
          { className: 'grid grid-rows-2 gap-4' },

          // Feature 1 - Video Analyzer
          React.createElement(
            'div',
            { className: 'bg-linear-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 mb-3' },
              React.createElement('div', { className: 'text-2xl' }, '🔍'),
              React.createElement(
                'h4',
                { className: 'text-xl font-bold text-cyan-400' },
                'ניתוח וידאו מתקדם'
              )
            ),
            React.createElement(
              'p',
              { className: 'text-gray-400 text-sm' },
              'נתח תוכן וידאו בכל עומק לקבלת תובנות מלאות.'
            )
          ),

          // Feature 2 - Content Distribution
          React.createElement(
            'div',
            { className: 'bg-linear-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 mb-3' },
              React.createElement('div', { className: 'text-2xl' }, '🚀'),
              React.createElement(
                'h4',
                { className: 'text-xl font-bold text-pink-400' },
                'שיתוף והפצה'
              )
            ),
            React.createElement(
              'p',
              { className: 'text-gray-400 text-sm' },
              'שמור, הורד ושתף את הבלוגים באתרי תוכן או ברשתות חברתיות.'
            )
          )
        )
      )
    ),

    // Call to Action
    React.createElement(
      'div',
      { className: 'text-center' },
      React.createElement(
        'div',
        { className: 'bg-linear-to-r from-red-600 to-purple-600 rounded-3xl p-8 max-w-4xl mx-auto' },
        React.createElement(
          'h3',
          { className: 'text-3xl font-black mb-4 text-white' },
          '🔥 מוכנים להתחיל?'
        ),
        React.createElement(
          'p',
          { className: 'text-xl text-gray-200 mb-6' },
          'התחבר והמר את הוידאו הבא שלך לבלוג מדהים!'
        ),
        React.createElement(
          'div',
          { className: 'text-lg font-bold text-yellow-300' },
          '🎉 זמן ממוצע להמרה: פחות מדקה!'
        )
      )
    )
  );
};

export default Home;
