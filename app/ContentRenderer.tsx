import React from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';
import VideoAnalyzer from './components/VideoAnalyzer';
import Chatbot from './components/Chatbot';
import VoiceAssistant from './components/VoiceAssistant';
import TextToSpeech from './components/TextToSpeech';
import Home from './components/Home';
import YouTubeChannelLoader from './components/YouTubeChannelLoader';
import ApiKeyManagement from './components/ApiKeyManagement';
import AdSenseManager from './components/AdSenseManager';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import { YOUTUBE_ICON } from './constants'; // Updated back to proper constants file without explicit .tsx extension
import { formatMarkdownToHtml } from './utils/file';

interface ContentRendererProps {
  currentView: string;
  isLoggedIn: boolean;
  youtubeUrl: string;
  setYoutubeUrl: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  desiredTone: string;
  setDesiredTone: (value: string) => void;
  error: string | null;
  setError: (value: string | null) => void;
  isLoading: boolean;
  isGenerateDisabled: boolean;
  handleGenerateBlog: (e: any) => void;
  showToast: (message: string, type?: string) => void;
  setCurrentView: (value: string) => void;
  blogGenerationResponse: any;
  handleDownloadBlog: () => void;
  handleDownloadPdf: () => void;
  handleCopyBlog: () => void;
  handleShareBlog: () => void;
  handleViewFullBlog: () => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  currentView,
  isLoggedIn,
  youtubeUrl,
  setYoutubeUrl,
  targetAudience,
  setTargetAudience,
  desiredTone,
  setDesiredTone,
  error,
  setError,
  isLoading,
  isGenerateDisabled,
  handleGenerateBlog,
  showToast,
  setCurrentView,
  blogGenerationResponse,
  handleDownloadBlog,
  handleDownloadPdf,
  handleCopyBlog,
  handleShareBlog,
  handleViewFullBlog,
}) => {
  if (!isLoggedIn && currentView !== 'home' && currentView !== 'faq' && currentView !== 'contact' && currentView !== 'terms' && currentView !== 'privacy' && currentView !== 'youtube-channel' && currentView !== 'api-key' && currentView !== 'adsense') {
    return React.createElement(
      'div',
      { className: 'text-center text-xl text-red-400 mt-20' },
      'Please log in to use the AI features.',
    );
  }

  switch (currentView) {
    case 'home':
      return React.createElement(Home, { showToast });
    case 'blog':
      return React.createElement(
        'section',
        { className: 'text-center mb-8 max-w-4xl mx-auto' },
        React.createElement(
          'h2',
          { className: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-blue-400' },
          'Turn YouTube Videos into Stunning Blogs'
        ),
        React.createElement(
          'p',
          { className: 'text-lg sm:text-xl text-gray-400 mb-8' },
          'Paste a YouTube link, and our AI will craft a high-quality, engaging blog post for you in seconds.'
        ),
        React.createElement(
          'form',
          { onSubmit: handleGenerateBlog, className: 'w-full max-w-xl mx-auto' },
          React.createElement(
            'div',
            { className: 'flex items-center bg-gray-700 rounded-xl p-2 shadow-lg mb-4' },
            React.createElement('span', { className: 'p-2' }, YOUTUBE_ICON),
            React.createElement('input', {
              key: 'youtube-url-input',
              type: 'text',
              value: youtubeUrl,
              onChange: (e) => {
                setYoutubeUrl(e.target.value);
                setError(null);
              },
              placeholder: 'https://www.youtube.com/watch?v=...',
              className: 'flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 p-2 outline-none',
              'aria-label': 'YouTube Video URL',
            }),
            React.createElement(
              'button',
              {
                type: 'submit',
                className: `ml-3 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  isGenerateDisabled
                    ? 'bg-blue-800 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`,
                disabled: isGenerateDisabled,
              },
              isLoading
                ? React.createElement(
                    'svg',
                    {
                      className: 'animate-spin h-5 w-5 text-white',
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
                    })
                  )
                : 'Generate'
            )
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col sm:flex-row gap-4 mb-4' },
            React.createElement(
              'div',
              { className: 'flex-1' },
              React.createElement(
                'label',
                { htmlFor: 'targetAudience', className: 'block text-gray-300 text-sm font-bold mb-2 text-left' },
                'Target Audience (e.g., Beginners, Experts, Kids):'
              ),
              React.createElement('input', {
                key: 'target-audience-input',
                type: 'text',
                id: 'targetAudience',
                value: targetAudience,
                onChange: (e) => setTargetAudience(e.target.value),
                placeholder: 'e.g., Tech enthusiasts, Small business owners',
                className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
                'aria-label': 'Target audience for blog post',
              })
            ),
            React.createElement(
              'div',
              { className: 'flex-1' },
              React.createElement(
                'label',
                { htmlFor: 'desiredTone', className: 'block text-gray-300 text-sm font-bold mb-2 text-left' },
                'Desired Tone (e.g., Formal, Casual, Humorous):'
              ),
              React.createElement('input', {
                key: 'desired-tone-input',
                type: 'text',
                id: 'desiredTone',
                value: desiredTone,
                onChange: (e) => setDesiredTone(e.target.value),
                placeholder: 'e.g., Informative, Inspiring, Conversational',
                className: 'shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600',
                'aria-label': 'Desired tone for blog post',
              })
            )
          )
        ),
        error &&
          React.createElement(
            'div',
            { className: 'text-red-500 mt-4 text-center' },
            error
          ),
        blogGenerationResponse &&
          React.createElement(
            'div',
            { className: 'mt-8 w-full max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl' },
            // Blog Header with Title and Thumbnail
            React.createElement(
              'div',
              { className: 'mb-6' },
              React.createElement(
                'h3',
                { className: 'text-2xl font-bold text-blue-300 mb-4 text-center' },
                blogGenerationResponse.videoTitle
              ),
              React.createElement(
                'div',
                { className: 'flex flex-col md:flex-row gap-6 items-start' },
                // Video/Thumbnail Section
                React.createElement(
                  'div',
                  { className: 'shrink-0' },
                  React.createElement('iframe', {
                    src: blogGenerationResponse.videoEmbedUrl,
                    title: blogGenerationResponse.videoTitle,
                    className: 'w-full md:w-80 h-48 md:h-44 rounded-lg',
                    allowFullScreen: true,
                  })
                ),
                // Blog Content Preview
                React.createElement(
                  'div',
                  { className: 'flex-1' },
                  React.createElement('div', {
                    className: 'prose prose-invert max-w-none text-sm',
                    dangerouslySetInnerHTML: {
                      __html: formatMarkdownToHtml(
                        blogGenerationResponse.blogContent.length > 500
                          ? blogGenerationResponse.blogContent.substring(0, 500) + '...'
                          : blogGenerationResponse.blogContent
                      )
                    },
                  }),
                  blogGenerationResponse.blogContent.length > 500 && React.createElement(
                    'p',
                    { className: 'text-gray-400 text-xs mt-2' },
                    'Click "View Full Blog" to see complete content'
                  )
                )
              )
            ),

            // Action Buttons
            React.createElement(
              'div',
              { className: 'mt-6 flex flex-wrap gap-4 justify-center' },
              React.createElement(
                'button',
                {
                  onClick: handleDownloadBlog,
                  className: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center gap-2',
                },
                '⬇️ הורד כקובץ TXT'
              ),
              React.createElement(
                'button',
                {
                  onClick: handleDownloadPdf,
                  className: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center gap-2',
                },
                '📄 הורד כ-PDF'
              ),
              React.createElement(
                'button',
                {
                  onClick: handleCopyBlog,
                  className: 'bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center gap-2',
                },
                '📋 העתק ללוח'
              ),
              React.createElement(
                'button',
                {
                  onClick: handleShareBlog,
                  className: 'bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center gap-2',
                },
                '🚀 שתף'
              ),
              React.createElement(
                'button',
                {
                  onClick: handleViewFullBlog,
                  className: 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center gap-2',
                },
                '📖 צפה בבלוג המלא'
              )
            ),

            // Full Blog Content (initially hidden, shown when user clicks "View Full Blog")
            React.createElement(
              'div',
              {
                id: 'full-blog-content',
                className: 'mt-8 border-t border-gray-700 pt-8',
                style: { display: 'none' }
              },
              React.createElement(
                'h4',
                { className: 'text-xl font-bold text-white mb-4 text-center' },
                'הבלוג המלא'
              ),
              React.createElement('div', {
                className: 'prose prose-invert max-w-none',
                dangerouslySetInnerHTML: { __html: formatMarkdownToHtml(blogGenerationResponse.blogContent) },
              }),

              // AdSense Integration Example - Header Banner
              React.createElement(
                'div',
                { className: 'mt-8 text-center' },
                React.createElement(
                  'p',
                  { className: 'text-sm text-gray-400 mb-4' },
                  'פרסומת:'
                ),
                React.createElement(
                  'div',
                  { className: 'bg-gray-700 p-4 rounded-lg' },
                  'AdSense Banner Ad - Configure in AdSense Manager'
                )
              )
            )
          )
      );
    case 'image-gen':
      return React.createElement(ImageGenerator, { showToast });
    case 'image-edit':
      return React.createElement(ImageEditor, { showToast });
    case 'video-gen':
      return React.createElement(VideoGenerator, { showToast });
    case 'video-analyze':
      return React.createElement(VideoAnalyzer, { showToast });
    case 'chatbot':
      return React.createElement(Chatbot, { showToast });
    case 'voice-assistant':
      return React.createElement(VoiceAssistant, { showToast });
    case 'text-to-speech':
      return React.createElement(TextToSpeech, { showToast });
    case 'youtube-channel':
      return React.createElement(YouTubeChannelLoader, { showToast, isLoggedIn });
    case 'api-key':
      return React.createElement(ApiKeyManagement, { showToast, setCurrentView });
    case 'adsense':
      return React.createElement(AdSenseManager, { showToast });
    case 'faq':
      return React.createElement(FAQ, { showToast });
    case 'contact':
      return React.createElement(Contact, { showToast });
    case 'terms':
      return React.createElement(Terms, { showToast });
    case 'privacy':
      return React.createElement(Privacy, { showToast });
    default:
      return React.createElement(
        'div',
        { className: 'text-center text-xl text-gray-400 mt-20' },
        'Select an AI feature from the navigation.',
      );
  }
};

export default ContentRenderer;
