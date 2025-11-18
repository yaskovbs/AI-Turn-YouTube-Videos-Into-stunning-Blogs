import React, { useState, useEffect } from 'react';
import {
  getYouTubeApiKey,
  setYouTubeApiKey,
  fetchYouTubeChannelData,
  fetchYouTubeVideosFromChannel,
  convertVideoToBlog,
  type ChannelData,
  type VideoData,
  type BlogConversion
} from '../utils/youtube';

const YouTubeChannelLoader = ({ showToast, isLoggedIn }: { showToast: (message: string, type: string) => void; isLoggedIn: boolean }) => {
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [channelId, setChannelId] = useState('');
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversions, setConversions] = useState<{[key: string]: BlogConversion}>({});

  // Bulk conversion settings
  const [targetAudience, setTargetAudience] = useState('General audience');
  const [desiredTone, setDesiredTone] = useState('Informative');
  const [isBulkConverting, setIsBulkConverting] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = getYouTubeApiKey();
    if (savedKey) {
      setYoutubeApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeApiKey(e.target.value);
    setError(null);
  };

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId(e.target.value);
    setError(null);
  };

  const handleSaveApiKey = () => {
    if (youtubeApiKey.trim()) {
      setYouTubeApiKey(youtubeApiKey.trim());
      showToast('YouTube Data API Key saved!', 'success');
    } else {
      showToast('Please enter a valid API key.', 'error');
    }
  };

  const handleLoadChannelData = async () => {
    setError(null);
    setChannelData(null);
    setVideos([]);

    if (!isLoggedIn) {
      setError('Please log in to load channel data.');
      showToast('Please log in to load channel data.', 'error');
      return;
    }

    if (!youtubeApiKey.trim()) {
      setError('Please enter and save your YouTube Data API Key first.');
      showToast('Please enter and save your YouTube Data API Key first.', 'error');
      return;
    }

    if (!channelId.trim()) {
      setError('Please enter a YouTube Channel ID.');
      showToast('Please enter a YouTube Channel ID.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchYouTubeChannelData(youtubeApiKey, channelId);
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

  const handleLoadVideos = async () => {
    if (!channelData) return;

    setIsLoadingVideos(true);
    setError(null);

    try {
      const result = await fetchYouTubeVideosFromChannel(youtubeApiKey, channelData);
      setVideos(result.videos);
      showToast(`Loaded ${result.videos.length} videos from channel!`, 'success');
    } catch (err) {
      console.error('Error loading videos:', err);
      const errorMessage = `Failed to load videos: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleConvertVideo = async (video: VideoData) => {
    setConversions(prev => ({
      ...prev,
      [video.id]: { ...prev[video.id], status: 'processing' as const }
    }));

    try {
      const onProgress = (progress: string) => {
        showToast(`Converting "${video.title}": ${progress}`, 'info');
      };

      const blogContent = await convertVideoToBlog(youtubeApiKey, video.url, targetAudience, desiredTone, onProgress);

      const conversion: BlogConversion = {
        id: video.id,
        title: video.title,
        blogContent,
        processedAt: new Date().toISOString(),
        videoUrl: video.url,
        status: 'completed'
      };

      setConversions(prev => ({
        ...prev,
        [video.id]: conversion
      }));

      showToast(`Successfully converted "${video.title}" to blog!`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setConversions(prev => ({
        ...prev,
        [video.id]: { ...prev[video.id], status: 'failed' as const, error: errorMessage }
      }));
      showToast(`Failed to convert "${video.title}": ${errorMessage}`, 'error');
    }
  };

  const handleBulkConvert = async () => {
    const videosToConvert = videos.filter(video => !conversions[video.id] || conversions[video.id].status !== 'completed');

    if (videosToConvert.length === 0) {
      showToast('All videos are already converted!', 'info');
      return;
    }

    setIsBulkConverting(true);
    showToast(`Starting bulk conversion of ${videosToConvert.length} videos...`, 'info');

    for (const video of videosToConvert) {
      await handleConvertVideo(video);
      // Small delay between conversions to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsBulkConverting(false);
    showToast('Bulk conversion completed!', 'success');
  };

  return (
    <div className='flex flex-col items-center p-4 w-full max-w-6xl mx-auto text-center'>
      <h2 className='text-3xl font-bold text-blue-400 mb-6'>
        ערוץ היוטיוב שלי - YouTube Data API
      </h2>
      <p className='text-lg text-gray-300 mb-4'>
        כאן תוכלו לנהל את ערוץ היוטיוב שלכם על ידי שילוב ה-YouTube Data API.
        התכונה הזו תאפשר לכם להעלות סרטונים, לנהל פלייליסטים, לצפות בנתוני ערוץ ועוד, הכל מתוך AI Studio.
      </p>

      {/* Enhanced security warning */}
      <div className='bg-yellow-900 border border-yellow-400 text-yellow-100 px-4 py-3 rounded relative mb-6 w-full max-w-lg'>
        <strong className='font-bold'>אזהרת אבטחה חמורה:</strong> אחסון מפתח ה-YouTube Data API ב-localStorage בדפדפן הלקוח הוא <strong>לא מאובטח</strong> וחושף את המפתח לפגיעות אבטחה. עבור סביבת ייצור, <strong>חובה</strong> להשתמש בשרת בק-אנד (proxy) כדי להגן על המפתח שלכם ולמנוע את חשיפתו למשתמשים.
      </div>

      {!isLoggedIn && (
        <div className='text-center text-xl text-red-400 mt-4 mb-8'>
          אנא התחברו כדי לנהל את מפתח ה-API שלכם ולטעון נתוני ערוץ.
        </div>
      )}

      {isLoggedIn && (
        <>
          {/* API Configuration */}
          <div className='w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl mb-8 text-left'>
            <h3 className='text-xl font-bold text-blue-300 mb-4'>הזנת מפתח YouTube Data API v3:</h3>

            <div className='mb-4'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveApiKey();
                }}
              >
                <label htmlFor='youtubeApiKey' className='block text-gray-300 text-sm font-bold mb-2'>
                  מפתח API:
                </label>
                <input
                  type='password'
                  id='youtubeApiKey'
                  value={youtubeApiKey}
                  onChange={handleApiKeyChange}
                  placeholder='הזינו את מפתח ה-YouTube Data API שלכם'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600'
                  aria-label='YouTube Data API key input'
                />
                <button
                  type='submit'
                  className='mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200'
                >
                  שמור מפתח API
                </button>
              </form>
            </div>

            <div className='mb-4'>
              <label htmlFor='channelId' className='block text-gray-300 text-sm font-bold mb-2'>
                מזהה ערוץ יוטיוב (לדוגמה: UC_xxxxxxxxxxxxxxxxx):
              </label>
              <input
                type='text'
                id='channelId'
                value={channelId}
                onChange={handleChannelIdChange}
                placeholder='הזינו את מזהה הערוץ שלכם'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600'
                aria-label='YouTube Channel ID input'
              />
            </div>

            <button
              onClick={handleLoadChannelData}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className='animate-spin h-5 w-5 text-white mx-auto' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
              ) : 'טעון נתוני ערוץ'}
            </button>

            {error && <p className='text-red-500 text-center mt-4'>{error}</p>}
          </div>

          {/* Channel Information */}
          {channelData && (
            <div className='w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-xl mb-8'>
              <div className='flex items-center gap-4 mb-4'>
                <img
                  src={channelData.thumbnails.medium.url}
                  alt={channelData.title}
                  className='w-16 h-16 rounded-full'
                />
                <div className='text-left'>
                  <h3 className='text-xl font-bold text-blue-300'>{channelData.title}</h3>
                  <p className='text-gray-400 text-sm'>{channelData.subscriberCount} מנויים • {channelData.videoCount} סרטונים</p>
                </div>
              </div>
              <p className='text-gray-300 mb-4'>{channelData.description}</p>
              <div className='flex gap-2'>
                <a
                  href={`https://www.youtube.com/channel/${channelData.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                  צפה בערוץ
                </a>
                <button
                  onClick={handleLoadVideos}
                  disabled={isLoadingVideos}
                  className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
                >
                  {isLoadingVideos ? 'טוען...' : 'טעון סרטונים מהערוץ'}
                </button>
              </div>
            </div>
          )}

          {/* Bulk Conversion Settings */}
          {videos.length > 0 && (
            <div className='w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-xl mb-8'>
              <h3 className='text-xl font-bold text-green-400 mb-4'>המרת בלוגים קבוצתית</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-gray-300 text-sm font-bold mb-2'>קהל יעד:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                  >
                    <option>General audience</option>
                    <option>Tech enthusiasts</option>
                    <option>Small business owners</option>
                    <option>Students</option>
                    <option>Professionals</option>
                    <option>Kids</option>
                  </select>
                </div>
                <div>
                  <label className='block text-gray-300 text-sm font-bold mb-2'>טון כתיבה:</label>
                  <select
                    value={desiredTone}
                    onChange={(e) => setDesiredTone(e.target.value)}
                    className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white'
                  >
                    <option>Informative</option>
                    <option>Casual</option>
                    <option>Professional</option>
                    <option>Humorous</option>
                    <option>Inspirational</option>
                    <option>Technical</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleBulkConvert}
                disabled={isBulkConverting}
                className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50'
              >
                {isBulkConverting ? 'ממיר...' : 'התחל המרה קבוצתית'}
              </button>
            </div>
          )}

          {/* Videos Grid */}
          {videos.length > 0 && (
            <div className='w-full'>
              <h3 className='text-2xl font-bold text-cyan-400 mb-6'>סרטונים מהערוץ ({videos.length})</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {videos.map((video) => {
                  const conversion = conversions[video.id];
                  return (
                    <div key={video.id} className='bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
                      <img
                        src={video.thumbnails.medium.url}
                        alt={video.title}
                        className='w-full h-32 object-cover'
                      />
                      <div className='p-4'>
                        <h4 className='font-bold text-white mb-2 line-clamp-2'>{video.title}</h4>
                        <div className='text-sm text-gray-400 mb-2'>
                          <span>👁️ {parseInt(video.statistics.viewCount).toLocaleString()}</span>
                          <span className='ml-2'>👍 {parseInt(video.statistics.likeCount).toLocaleString()}</span>
                        </div>
                        <div className='text-xs text-gray-500 mb-3'>
                          {new Date(video.publishedAt).toLocaleDateString('he-IL')}
                        </div>

                        {conversion ? (
                          <div className='text-center'>
                            <div className={`text-sm font-bold mb-2 ${
                              conversion.status === 'completed' ? 'text-green-400' :
                              conversion.status === 'processing' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {conversion.status === 'completed' ? 'הומרה לבלוג' :
                               conversion.status === 'processing' ? 'מעבד...' :
                               'שגיאה'}
                            </div>
                            {conversion.status === 'completed' && (
                              <button
                                onClick={() => showToast(`בלוג עבור "${video.title}" הומר בהצלחה!`, 'success')}
                                className='text-green-500 hover:text-green-400 text-sm'
                              >
                                צפה בבלוג
                              </button>
                            )}
                            {conversion.error && (
                              <div className='text-xs text-red-400 mt-1'>{conversion.error}</div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConvertVideo(video)}
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200'
                          >
                            המר לבלוג
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ads */}
          <div className='adsbygoogle my-8 text-center' style={{ minHeight: '100px' }}>
            <ins
              className='adsbygoogle'
              style={{ display: 'block' }}
              data-ad-client='ca-pub-9953179201685717'
              data-ad-slot='YOUR_AD_SLOT_ID_YOUTUBE_1'
              data-ad-format='auto'
              data-full-width-responsive='true'
            />
          </div>
        </>
      )}
    </div>
  );
};

export default YouTubeChannelLoader;
