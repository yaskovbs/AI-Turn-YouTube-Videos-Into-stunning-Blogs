import React, { useEffect, useState } from 'react';
import { signIn } from '../services/authService';

const Home = ({ showToast }: { showToast: (message: string, type: string) => void }) => {
  // Environment configuration for real, configurable stats
  const config = {
    initialRecaps: parseInt(import.meta.env.VITE_INITIAL_RECAPS_COUNT || '1240'),
    initialUsers: parseInt(import.meta.env.VITE_INITIAL_ACTIVE_USERS || '496'),
    defaultRating: parseFloat(import.meta.env.VITE_RATING_DEFAULT || '5.0'),
    uptimePercentage: parseFloat(import.meta.env.VITE_UPTIME_PERCENTAGE || '99.9'),
    adminOverrideRecaps: import.meta.env.VITE_ADMIN_OVERRIDE_RECAPS,
    adminOverrideUsers: import.meta.env.VITE_ADMIN_OVERRIDE_USERS,
    adminOverrideRating: import.meta.env.VITE_ADMIN_OVERRIDE_RATING,
    adminOverrideUptime: import.meta.env.VITE_ADMIN_OVERRIDE_UPTIME,
    enableTracking: import.meta.env.VITE_ENABLE_STATS_TRACKING !== 'false',
    enableRating: import.meta.env.VITE_ENABLE_USER_RATING !== 'false',
    enableUpdates: import.meta.env.VITE_ENABLE_DYNAMIC_UPDATES !== 'false'
  };

  // Calculate real rating from user feedback or admin override
  const getAverageRating = () => {
    // Admin override takes precedence
    if (config.adminOverrideRating) {
      return parseFloat(config.adminOverrideRating);
    }

    // Calculate from user ratings if enabled
    if (config.enableRating) {
      const ratings = localStorage.getItem('userRatings');
      if (ratings) {
        const ratingsArray: number[] = JSON.parse(ratings);
        if (ratingsArray.length > 0) {
          const avg = parseFloat((ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1));
          return avg > 5 ? 5 : avg; // Cap at 5
        }
      }
    }

    return config.defaultRating;
  };

  // Get real stats with admin override support
  const getStats = () => {
    // Admin overrides (if set, these are the "real" values)
    const adminRecaps = config.adminOverrideRecaps ? parseInt(config.adminOverrideRecaps) : null;
    const adminUsers = config.adminOverrideUsers ? parseInt(config.adminOverrideUsers) : null;
    const adminRating = config.adminOverrideRating ? parseFloat(config.adminOverrideRating) : null;
    const adminUptime = config.adminOverrideUptime ? parseFloat(config.adminOverrideUptime) : null;

    return {
      rating: adminRating ?? getAverageRating(),
      uptime: adminUptime ?? config.uptimePercentage,
      activeUsers: adminUsers ?? (config.enableTracking ?
        parseInt(localStorage.getItem('activeUsers') || config.initialUsers.toString()) :
        config.initialUsers),
      recapsCreated: adminRecaps ?? (config.enableTracking ?
        parseInt(localStorage.getItem('recapsCreated') || config.initialRecaps.toString()) :
        config.initialRecaps)
    };
  };

  // Track real usage stats
  const updateUsageStats = () => {
    if (!config.enableTracking) return;

    const currentRecaps = parseInt(localStorage.getItem('recapsCreated') || config.initialRecaps.toString());
    const currentUsers = parseInt(localStorage.getItem('activeUsers') || config.initialUsers.toString());

    // Increment for first visit of new user (only if not admin overridden)
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited && !config.adminOverrideUsers) {
      localStorage.setItem('activeUsers', (currentUsers + 1).toString());
      localStorage.setItem('hasVisited', 'true');
    }

    // Update stats with current values (respecting admin overrides)
    setStats(getStats());
  };

  // Increment recaps counter (call this from response handler)
  const incrementRecaps = () => {
    if (!config.enableTracking || config.adminOverrideRecaps) return;

    const current = parseInt(localStorage.getItem('recapsCreated') || config.initialRecaps.toString());
    localStorage.setItem('recapsCreated', (current + 1).toString());
    // Only update if no admin override
    if (!config.adminOverrideRecaps) {
      setStats(prev => ({ ...prev, recapsCreated: current + 1 }));
    }
  };

  const [stats, setStats] = useState(getStats());

  const [displayedStats, setDisplayedStats] = useState({
    rating: 0,
    uptime: 0,
    activeUsers: 0,
    recapsCreated: 0
  });

  useEffect(() => {
    updateUsageStats();
  }, []);

  useEffect(() => {
    // Animate count up effect
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const stepDuration = duration / steps;

    const target = stats;
    const current = displayedStats;

    const increment = {
      rating: (target.rating - current.rating) / steps,
      uptime: (target.uptime - current.uptime) / steps,
      activeUsers: Math.ceil((target.activeUsers - current.activeUsers) / steps),
      recapsCreated: Math.ceil((target.recapsCreated - current.recapsCreated) / steps)
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplayedStats(target);
        clearInterval(timer);
      } else {
        setDisplayedStats(prev => ({
          rating: Math.min(target.rating, prev.rating + increment.rating),
          uptime: Math.min(target.uptime, prev.uptime + increment.uptime),
          activeUsers: Math.min(target.activeUsers, prev.activeUsers + increment.activeUsers),
          recapsCreated: Math.min(target.recapsCreated, prev.recapsCreated + increment.recapsCreated)
        }));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [stats, displayedStats]);

  const [userRating, setUserRating] = useState(5);

  // Allow users to submit rating (only if enabled and not admin overridden)
  const submitRating = (rating: number) => {
    if (!config.enableRating || config.adminOverrideRating) return;

    const existingRatings = localStorage.getItem('userRatings') || '[]';
    const ratingsArray: number[] = JSON.parse(existingRatings);
    ratingsArray.push(rating);
    localStorage.setItem('userRatings', JSON.stringify(ratingsArray));

    // Update stats with new average (respect admin override)
    const newAverage = parseFloat((ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(1));
    if (!config.adminOverrideRating) {
      setStats(prev => ({ ...prev, rating: newAverage }));
    }

    showToast(`הודות על הדירוג! דירוג ממוצע חדש: ${newAverage}/5`, 'success');
  };

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-12'>
      <div className='text-center mb-16'>
        <h2 className='text-5xl md:text-7xl font-black mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse'>
          ברוכים הבאים ל-AI Studio!
        </h2>
        <p className='text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto font-bold'>
          Welcome to Emergent
        </p>
        <p className='text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto'>
          Your single destination to build and deploy production-ready applications
        </p>
        <p className='text-base md:text-lg text-gray-500'>
          ממאמרים בבלוג ועד תמונות, סרטונים ושיחות קוליות - הכל במקום אחד!
        </p>
      </div>

      {/* Statistics Section - "המספרים מדברים בעד עצמם" */}
      <div className='mb-16'>
        <h3 className='text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
          המספרים מדברים בעד עצמם
        </h3>
        <p className='text-center text-gray-400 mb-8 text-lg'>
          הישגים שלנו עד היום
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Stat Card 1 - User Rating */}
          <div className='bg-linear-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                ⭐
              </div>
              <div className='text-4xl md:text-5xl font-black text-yellow-400 mb-2'>
                {`${displayedStats.rating.toFixed(1)}/5`}
              </div>
              <div className='text-gray-300 font-semibold'>
                דירוג משתמשים
              </div>
            </div>
          </div>
          {/* Stat Card 2 - Service Availability */}
          <div className='bg-linear-to-br from-cyan-900/50 to-cyan-800/30 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                ⚡
              </div>
              <div className='text-4xl md:text-5xl font-black text-cyan-400 mb-2'>
                {`${displayedStats.uptime.toFixed(1)}%`}
              </div>
              <div className='text-gray-300 font-semibold'>
                זמינות השירות
              </div>
            </div>
          </div>
          {/* Stat Card 3 - Active Users */}
          <div className='bg-linear-to-br from-blue-900/50 to-blue-800/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                👥
              </div>
              <div className='text-4xl md:text-5xl font-black text-blue-400 mb-2'>
                {Math.floor(displayedStats.activeUsers)}
              </div>
              <div className='text-gray-300 font-semibold'>
                משתמשים פעילים
              </div>
            </div>
          </div>
          {/* Stat Card 4 - Recaps Created */}
          <div className='bg-linear-to-br from-purple-900/50 to-pink-800/30 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                📝
              </div>
              <div className='text-4xl md:text-5xl font-black text-pink-400 mb-2'>
                {Math.floor(displayedStats.recapsCreated)}
              </div>
              <div className='text-gray-300 font-semibold'>
                בלוגים נוצרו
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Rating Section */}
      <div className='mb-16 text-center'>
        <h3 className='text-2xl md:text-3xl font-bold mb-4 bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
          דרג את האפליקציה שלנו
        </h3>
        <p className='text-gray-400 mb-6'>
          המשוב שלכם עוזר לנו להשתפר!
        </p>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center space-x-2'>
            {Array.from({ length: 5 }, (_, i) => i + 1).map(rating =>
              <button
                key={rating}
                className={`text-3xl hover:scale-110 transition-transform ${
                  rating <= userRating ? 'text-yellow-400' : 'text-gray-600'
                }`}
                onClick={() => setUserRating(rating)}
              >
                ⭐
              </button>
            )}
          </div>
          <button
            className='px-6 py-2 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all font-semibold'
            onClick={() => submitRating(userRating)}
          >
            שלח דירוג
          </button>
          <p className='text-sm text-gray-500'>
            {`נבחר: ${userRating}/5 כוכבים`}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              📝
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              יצירת בלוגים מיוטיוב
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            הפכו סרטוני יוטיוב למאמרי בלוג מרתקים ואיכותיים בשניות.
          </p>
        </div>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              🎨
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              מחולל ועורך תמונות
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            צרו תמונות מרהיבות מפרומפטים טקסטואליים ועצבו אותן בקלות.
          </p>
        </div>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              🎬
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              וידאו: יצירה וניתוח
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            הפיקו סרטונים מדהימים ונתחו תוכן וידאו לעומק בעזרת AI.
          </p>
        </div>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              💬
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              צ'אט ועוזר קולי
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            נהלו שיחות טקסט או קול עם AI לקבלת מידע ותמיכה בזמן אמת.
          </p>
        </div>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              🔊
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              טקסט לדיבור
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            המירו כל טקסט לדיבור טבעי ואיכותי בקלות.
          </p>
        </div>
        <div className='card-feature'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center'>
              ⚙️
            </div>
            <h3 className='text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text'>
              שילוב API
            </h3>
          </div>
          <p className='text-gray-400 leading-relaxed'>
            למפתחים: אפשרויות לשלב מפתחות API משלכם לשליטה מלאה.
          </p>
        </div>
      </div>

      <div className='text-center'>
        <p className='text-md text-gray-500'>
          חקור את הכלים שלנו והתחל ליצור עוד היום!
        </p>
      </div>
    </div>
  );
};

export default Home;
