import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import { initGoogleSignIn, signIn, signOut } from './services/authService';
import { getYouTubeVideoId } from './utils/youtube';
import { createHandlers, createShowToast } from './handlers';
import ContentRenderer from './ContentRenderer';

type ThemeMode = 'light' | 'dark' | 'system';

type BlogGenerationResponse = {
  videoTitle: string;
  videoEmbedUrl: string;
  blogContent: string;
} | null;

type Toast = {
  id: number;
  message: string;
  type: string;
} | null;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  picture?: string;
} | null;

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState(''); // New state for target audience
  const [desiredTone, setDesiredTone] = useState(''); // New state for desired tone
  const [blogGenerationResponse, setBlogGenerationResponse] =
    useState<BlogGenerationResponse>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(null); // New state for current user
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to not logged in
  const [themeMode, setThemeMode] = useState<ThemeMode>('system'); // New: System theme by default
  const [isDarkMode, setIsDarkMode] = useState(true); // Computed based on themeMode
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // Default view to 'home'
  const [toast, setToast] = useState<Toast>(null); // New state for toast notifications

  const { showToast, handleCloseToast } = createShowToast(setToast);

  const {
    handleGenerateBlog,
    handleDownloadBlog,
    handleDownloadPdf,
    handleCopyBlog,
    handleShareBlog,
    handleViewFullBlog,
  } = createHandlers(
    setYoutubeUrl,
    setTargetAudience,
    setDesiredTone,
    setBlogGenerationResponse,
    setIsLoading,
    setError,
    setToast,
    isLoggedIn,
    youtubeUrl,
    targetAudience,
    desiredTone,
    blogGenerationResponse,
    showToast
  );


  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    }

    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentView('home'); // Default to home if logged in
    } else {
      setCurrentView('login'); // Default to login if not logged in
    }

    initGoogleSignIn(
      (authResult) => {
        // This is called when user signs in via prompt or initTokenClient
        console.log("Signed in:", authResult);
        setCurrentUser(authResult.profile);
        setIsLoggedIn(true);
        setCurrentView('home');
        localStorage.setItem('userProfile', JSON.stringify(authResult.profile));
        showToast(`Welcome, ${authResult.profile.name}!`, 'success');
      },
      () => {
        console.log("Signed out.");
        setCurrentUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('userProfile');
        showToast('Logged out successfully.', 'success');
      }
    );

  }, []);

  // Compute actual dark mode based on theme mode and system preference
  useEffect(() => {
    const applyTheme = () => {
      let shouldBeDark = false;

      if (themeMode === 'system') {
        // Check system preference
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        shouldBeDark = themeMode === 'dark';
      }

      setIsDarkMode(shouldBeDark);
    };

    applyTheme();

    // Listen for system theme changes if in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Apply dark/light mode classes to the body and save to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-white', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-white', 'text-gray-900');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [isDarkMode, themeMode]);

  const handleLoginToggle = (loggedIn: boolean) => {
    if (loggedIn) {
      signIn(); // Initiates Google Sign-In flow
    } else {
      signOut(); // Initiates Google Sign-Out
      setCurrentUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('userProfile');
    }
    setError(null);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
  };

  const videoId = getYouTubeVideoId(youtubeUrl);
  // Disabled if not logged in, URL is empty, or if an invalid YouTube ID
  const isGenerateDisabled = isLoading || !isLoggedIn || !youtubeUrl.trim() || !videoId; // Changed to youtubeUrl.trim() and videoId check

  return React.createElement(
    'div',
    {
      className: `min-h-screen flex flex-col bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-white`,
    },
    currentView !== 'login' && React.createElement(Header, {
      isLoggedIn: isLoggedIn,
      onLoginToggle: handleLoginToggle,
      themeMode: themeMode,
      onThemeChange: handleThemeChange,
      currentView: currentView,
      onViewChange: setCurrentView,
      currentUser: currentUser, // Pass currentUser to Header
    }),
    React.createElement(
      'main',
      { className: 'flex-grow flex flex-col items-center py-8' },
      React.createElement(ErrorBoundary, null, React.createElement(ContentRenderer, {
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
      }))
    ),
    React.createElement(
      'footer',
      { className: 'border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 py-12' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8' },
          // Navigation
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'font-bold text-white mb-4 text-sm uppercase tracking-wider' },
              'ניווט',
            ),
            React.createElement(
              'ul',
              { className: 'space-y-3' },
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('home'), className: 'text-gray-400 hover:text-purple-400 transition-colors text-sm' },
                  'בית',
                ),
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'a',
                  { href: 'https://youtube.com/@movies_and_tv_show_recap?si=2Q6EtL5v-NpZcJO1', target: '_blank', rel: 'noopener noreferrer', className: 'text-gray-400 hover:text-cyan-400 transition-colors text-sm' },
                  'ערוץ יוטיוב',
                ),
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('contact'), className: 'text-gray-400 hover:text-purple-400 transition-colors text-sm' },
                  'צור קשר',
                ),
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('faq'), className: 'text-gray-400 hover:text-purple-400 transition-colors text-sm' },
                  'שאלות נפוצות',
                ),
              ),
            ),
          ),
          // Legal
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'font-bold text-white mb-4 text-sm uppercase tracking-wider' },
              'משפטי',
            ),
            React.createElement(
              'ul',
              { className: 'space-y-3' },
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('terms'), className: 'text-gray-400 hover:text-purple-400 transition-colors text-sm' },
                  'תנאי שימוש',
                ),
              ),
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('privacy'), className: 'text-gray-400 hover:text-purple-400 transition-colors text-sm' },
                  'מדיניות פרטיות',
                ),
              ),
            ),
          ),
          // Social & Developers
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'font-bold text-white mb-4 text-sm uppercase tracking-wider' },
              'למפתחים',
            ),
            React.createElement(
              'ul',
              { className: 'space-y-3' },
              React.createElement(
                'li',
                null,
                React.createElement(
                  'button',
                  { onClick: () => setCurrentView('api-key'), className: 'text-gray-400 hover:text-cyan-400 transition-colors text-sm' },
                  'מפתח API',
                ),
              ),
            ),
          ),
          // Contact
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'font-bold text-white mb-4 text-sm uppercase tracking-wider' },
              'צור קשר',
            ),
            React.createElement(
              'ul',
              { className: 'space-y-2 text-sm' },
              React.createElement('li', { className: 'text-gray-400' }, '📧 yaskovbs2502@gmail.com'),
              React.createElement('li', { className: 'text-gray-400' }, '📱 050-818-1948'),
            ),
          ),
        ),
        // Divider
        React.createElement('div', { className: 'border-t border-gray-800 mb-6' }),
        // Bottom
        React.createElement(
          'div',
          { className: 'flex flex-col md:flex-row justify-between items-center text-sm text-gray-500' },
          React.createElement(
            'p',
            null,
            `© ${new Date().getFullYear()} AI Studio. All rights reserved.`
          ),
          React.createElement(
            'p',
            { className: 'mt-4 md:mt-0' },
            'Built with ❤️ for content creators'
          ),
        ),
      ),
    ),
    toast && React.createElement(Toast, {
      key: toast.id,
      message: toast.message,
      type: toast.type,
      onClose: handleCloseToast,
    })
  );
}

export default App;
