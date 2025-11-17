import React, { useEffect, useState } from 'react';

const Home = ({ showToast }: { showToast: (message: string, type: string) => void }) => {
  // Calculate real rating from user feedback
  const getAverageRating = () => {
    const ratings = localStorage.getItem('userRatings');
    if (ratings) {
      const ratingsArray: number[] = JSON.parse(ratings);
      if (ratingsArray.length > 0) {
        return parseFloat((ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1));
      }
    }
    return 0; // Start with 0 until users provide feedback
  };

  const [stats, setStats] = useState({
    rating: getAverageRating(),
    uptime: 99.9,
    activeUsers: 0, // Reset to 0 as requested
    recapsCreated: 0 // Reset to 0 as requested
  });

  const [userRating, setUserRating] = useState(5);

  // Allow users to submit rating
  const submitRating = (rating: number) => {
    const existingRatings = localStorage.getItem('userRatings') || '[]';
    const ratingsArray: number[] = JSON.parse(existingRatings);
    ratingsArray.push(rating);
    localStorage.setItem('userRatings', JSON.stringify(ratingsArray));

    // Update stats with new average
    const newAverage = parseFloat((ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1));
    setStats(prev => ({ ...prev, rating: newAverage }));

    showToast(`הודות על הדירוג! דירוג ממוצע חדש: ${newAverage}/5`, 'success');
  };

  return React.createElement(
    'div',
    { className: 'w-full max-w-7xl mx-auto px-4 py-12' },
    React.createElement(
      'div',
      { className: 'text-center mb-16' },
      React.createElement(
        'h2',
        { className: 'text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse' },
        'ברוכים הבאים ל-AI Studio!',
      ),
      React.createElement(
        'p',
        { className: 'text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto font-bold' },
        'Welcome to Emergent'
      ),
      React.createElement(
        'p',
        { className: 'text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto' },
        'Your single destination to build and deploy production-ready applications'
      ),
      React.createElement(
        'p',
        { className: 'text-base md:text-lg text-gray-500' },
        'ממאמרים בבלוג ועד תמונות, סרטונים ושיחות קוליות - הכל במקום אחד!',
      ),
    ),

    // Statistics Section - "המספרים מדברים בעד עצמם"
    React.createElement(
      'div',
      { className: 'mb-16' },
      React.createElement(
        'h3',
        { className: 'text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent' },
        'המספרים מדברים בעד עצמם'
      ),
      React.createElement(
        'p',
        { className: 'text-center text-gray-400 mb-8 text-lg' },
        'הישגים שלנו עד היום'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
        // Stat Card 1 - User Rating
        React.createElement(
          'div',
          { className: 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20' },
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
              'דירוג משתמשים'
            )
          )
        ),
        // Stat Card 2 - Service Availability
        React.createElement(
          'div',
          { className: 'bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20' },
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
              { className: 'text-4xl md:text-5xl font-black text-cyan-400 mb-2' },
              `${stats.uptime}%`
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'זמינות השירות'
            )
          )
        ),
        // Stat Card 3 - Active Users
        React.createElement(
          'div',
          { className: 'bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20' },
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
              { className: 'text-4xl md:text-5xl font-black text-blue-400 mb-2' },
              stats.activeUsers
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'משתמשים פעילים'
            )
          )
        ),
        // Stat Card 4 - Recaps Created
        React.createElement(
          'div',
          { className: 'bg-gradient-to-br from-purple-900/50 to-pink-800/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20' },
          React.createElement(
            'div',
            { className: 'flex flex-col items-center text-center' },
            React.createElement(
              'div',
              { className: 'text-4xl mb-3' },
              '📊'
            ),
            React.createElement(
              'div',
              { className: 'text-4xl md:text-5xl font-black text-pink-400 mb-2' },
              stats.recapsCreated
            ),
            React.createElement(
              'div',
              { className: 'text-gray-300 font-semibold' },
              'בלוגים שנוצרו'
            )
          )
        )
      )
    ),

    // User Rating Section
    React.createElement(
      'div',
      { className: 'mb-16 text-center' },
      React.createElement(
        'h3',
        { className: 'text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent' },
        'דרג את האפליקציה שלנו'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-400 mb-6' },
        'המשוב שלכם עוזר לנו להשתפר!'
      ),
      React.createElement(
        'div',
        { className: 'flex flex-col items-center space-y-4' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          Array.from({ length: 5 }, (_, i) => i + 1).map(rating =>
            React.createElement(
              'button',
              {
                key: rating,
                className: `text-3xl hover:scale-110 transition-transform ${
                  rating <= userRating ? 'text-yellow-400' : 'text-gray-600'
                }`,
                onClick: () => setUserRating(rating)
              },
              '⭐'
            )
          )
        ),
        React.createElement(
          'button',
          {
            className: 'px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all font-semibold',
            onClick: () => submitRating(userRating)
          },
          'שלח דירוג'
        ),
        React.createElement(
          'p',
          { className: 'text-sm text-gray-500' },
          `נבחר: ${userRating}/5 כוכבים`
        )
      )
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
