import React, { useEffect, useState } from 'react';

const Home = ({ showToast }: { showToast: (message: string, type: string) => void }) => {
  const [stats, setStats] = useState({
    rating: 5.0,
    uptime: 99.9,
    activeUsers: 496,
    blogsCreated: 1240
  });

  const [displayedStats, setDisplayedStats] = useState({
    rating: 0,
    uptime: 0,
    activeUsers: 0,
    blogsCreated: 0
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
      blogsCreated: Math.ceil((target.blogsCreated - current.blogsCreated) / steps)
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
          blogsCreated: Math.min(target.blogsCreated, prev.blogsCreated + increment.blogsCreated)
        }));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [stats, displayedStats]);

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-12'>
      {/* Hero Section - YouTube to Blog focus */}
      <div className='text-center mb-16'>
        <h1 className='text-6xl md:text-8xl font-black mb-6 bg-linear-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent animate-pulse'>
          🎬 → 📝
        </h1>
        <h2 className='text-4xl md:text-6xl font-black mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent'>
          הפוך סרטוני יוטיוב לבלוגים מושלמים!
        </h2>
        <p className='text-xl md:text-3xl text-gray-300 mb-8 leading-relaxed font-bold'>
          AI-powered YouTube Video to Blog Converter
        </p>
        <p className='text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8'>
          צפהבאום סרטון יוטיוב והפוך אותו באופן אוטומטי למאמר בלוג מקצועי ומרתק עם כותרת, תיאור ותמונות.
        </p>
        <div className='bg-linear-to-r from-purple-900/50 to-cyan-900/50 rounded-2xl p-8 border border-purple-500/30 mb-8'>
          <h3 className='text-2xl font-bold mb-4 text-cyan-400'>
            🎯 איך זה עובד?
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
            <div className='text-center'>1️⃣ הזן קישור ליוטיוב</div>
            <div className='text-center'>2️⃣ בחר קהל יעד וטון</div>
            <div className='text-center'>3️⃣ קבל בלוג יפהפה!</div>
          </div>
        </div>
      </div>

      {/* Statistics Section - YouTube focused */}
      <div className='mb-16'>
        <h3 className='text-3xl md:text-4xl font-bold text-center mb-4 bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'>
          התוצאות שלנו מדברות בעד עצמן
        </h3>
        <p className='text-center text-gray-400 mb-8 text-lg'>
          בלוגים שנוצרו מוידאו יוטיוב
        </p>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Blogs Created */}
          <div className='bg-linear-to-br from-red-900/50 to-pink-800/30 rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                📝
              </div>
              <div className='text-4xl md:text-5xl font-black text-pink-400 mb-2'>
                {Math.floor(displayedStats.blogsCreated)}
              </div>
              <div className='text-gray-300 font-semibold'>
                בלוגים נוצרו
              </div>
            </div>
          </div>
          {/* User Rating */}
          <div className='bg-linear-to-br from-yellow-900/50 to-orange-800/30 rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                ⭐
              </div>
              <div className='text-4xl md:text-5xl font-black text-yellow-400 mb-2'>
                {`${displayedStats.rating.toFixed(1)}/5`}
              </div>
              <div className='text-gray-300 font-semibold'>
                דירוג איכות
              </div>
            </div>
          </div>
          {/* Active Users */}
          <div className='bg-linear-to-br from-blue-900/50 to-cyan-800/30 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                👥
              </div>
              <div className='text-4xl md:text-5xl font-black text-cyan-400 mb-2'>
                {Math.floor(displayedStats.activeUsers)}
              </div>
              <div className='text-gray-300 font-semibold'>
                משתמשים פעילים
              </div>
            </div>
          </div>
          {/* Service Uptime */}
          <div className='bg-linear-to-br from-green-900/50 to-emerald-800/30 rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20'>
            <div className='flex flex-col items-center text-center'>
              <div className='text-4xl mb-3'>
                ⚡
              </div>
              <div className='text-4xl md:text-5xl font-black text-emerald-400 mb-2'>
                {`${displayedStats.uptime.toFixed(1)}%`}
              </div>
              <div className='text-gray-300 font-semibold'>
                זמינות
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - YouTube to Blog specific */}
      <div className='mb-16'>
        <h3 className='text-3xl md:text-4xl font-bold text-center mb-8 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
          כלי העבודה שלנו
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Main Feature - YouTube to Blog */}
          <div className='bg-linear-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-8 border border-red-500/30'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='text-4xl'>
                🎥
              </div>
              <div>
                <h4 className='text-2xl font-bold bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2'>
                  המרת יוטיוב לטקסט בלוג
                </h4>
                <div className='bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-semibold inline-block'>
                  ⭐ אבן יסוד
                </div>
              </div>
            </div>
            <p className='text-gray-300 leading-relaxed mb-4'>
              שלף תמלול, חלץ רעיונות מרכזיים וצור מאמר בלוג מלא וקרא בצורה אוטומטית.
            </p>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>• תמלול אוטומטי מדויק</li>
              <li>• חילוץ מפתחות ורעיונות</li>
              <li>• כתיבה באיכות עיתונאית</li>
              <li>• תמונות וגרפיקה אוטומטית</li>
            </ul>
          </div>

          {/* Secondary Features Grid */}
          <div className='grid grid-rows-2 gap-4'>
            {/* Feature 1 - Video Analyzer */}
            <div className='bg-linear-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='text-2xl'>🔍</div>
                <h4 className='text-xl font-bold text-cyan-400'>
                  ניתוח וידאו מתקדם
                </h4>
              </div>
              <p className='text-gray-400 text-sm'>
                נתח תוכן וידאו בכל עומק לקבלת תובנות מלאות.
              </p>
            </div>

            {/* Feature 2 - Content Distribution */}
            <div className='bg-linear-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='text-2xl'>🚀</div>
                <h4 className='text-xl font-bold text-pink-400'>
                  שיתוף והפצה
                </h4>
              </div>
              <p className='text-gray-400 text-sm'>
                שמור, הורד ושתף את הבלוגים באתרי תוכן או ברשתות חברתיות.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='text-center'>
        <div className='bg-linear-to-r from-red-600 to-purple-600 rounded-3xl p-8 max-w-4xl mx-auto'>
          <h3 className='text-3xl font-black mb-4 text-white'>
            🔥 מוכנים להתחיל?
          </h3>
          <p className='text-xl text-gray-200 mb-6'>
            התחבר והמר את הוידאו הבא שלך לבלוג מדהים!
          </p>
          <div className='text-lg font-bold text-yellow-300'>
            🎉 זמן ממוצע להמרה: פחות מדקה!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
