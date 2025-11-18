import React, { useState, useEffect, useRef } from 'react';
import ThemeSelector from './ThemeSelector';
import {
  BLOG_ICON,
  IMAGE_GENERATOR_ICON,
  IMAGE_EDITOR_ICON,
  VIDEO_GENERATOR_ICON,
  VIDEO_ANALYZER_ICON,
  CHAT_ICON,
  VOICE_ASSISTANT_ICON,
  TEXT_TO_SPEECH_ICON,
  HOME_ICON,
  YOUTUBE_CHANNEL_ICON,
  API_KEY_ICON,
  FAQ_ICON,
  CONTACT_ICON,
  LEGAL_ICON,
  DASHBOARD_ICON,
} from '../constants';

type ThemeMode = 'light' | 'dark' | 'system';

const Header = ({
  isLoggedIn,
  onLoginToggle,
  themeMode,
  onThemeChange,
  currentView,
  onViewChange,
  currentUser,
}: {
  isLoggedIn: boolean;
  onLoginToggle: (loggedIn: boolean) => void;
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentView: string;
  onViewChange: (view: string) => void;
  currentUser: any;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMenuPreview, setShowMenuPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuPreviewRef = useRef<HTMLDivElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Always show menu preview on desktop when not logged in
  useEffect(() => {
    if (!isLoggedIn && !isMobile) {
      setShowMenuPreview(true);
    } else if (isMobile) {
      setShowMenuPreview(false);
    }
  }, [isLoggedIn, isMobile]);

  // Close menu preview when clicking outside (but not on login button) - only on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOnLoginButton = loginButtonRef.current && loginButtonRef.current.contains(target);

      if (menuPreviewRef.current &&
          !menuPreviewRef.current.contains(target) &&
          !isClickOnLoginButton) {
        setShowMenuPreview(false);
      }
    };

    if (showMenuPreview && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuPreview, isMobile]);

  const navItems = [
    { name: 'בית', icon: HOME_ICON, view: 'home' },
    { name: 'דשבורד', icon: DASHBOARD_ICON, view: 'dashboard' },
    { name: 'יוטיוב לבלוג', icon: BLOG_ICON, view: 'blog' },
    { name: 'מחולל תמונות', icon: IMAGE_GENERATOR_ICON, view: 'image-gen' },
    { name: 'עורך תמונות', icon: IMAGE_EDITOR_ICON, view: 'image-edit' },
    { name: 'מחולל וידאו', icon: VIDEO_GENERATOR_ICON, view: 'video-gen' },
    { name: 'מנתח וידאו', icon: VIDEO_ANALYZER_ICON, view: 'video-analyze' },
    { name: 'צ\'אט בוט', icon: CHAT_ICON, view: 'chatbot' },
    { name: 'עוזר קולי', icon: VOICE_ASSISTANT_ICON, view: 'voice-assistant' },
    { name: 'טקסט לדיבור', icon: TEXT_TO_SPEECH_ICON, view: 'text-to-speech' },
    { name: 'ערוץ יוטיוב שלי', icon: YOUTUBE_CHANNEL_ICON, view: 'youtube-channel' },
    { name: 'מפתח API', icon: API_KEY_ICON, view: 'api-key' },
    { name: 'שאלות נפוצות', icon: FAQ_ICON, view: 'faq' },
    { name: 'צור קשר', icon: CONTACT_ICON, view: 'contact' },
  ];

  const legalNavItems = [
    { name: 'תנאי שימוש', icon: LEGAL_ICON, view: 'terms' },
    { name: 'מדיניות פרטיות', icon: LEGAL_ICON, view: 'privacy' },
  ];

  const handleNavClick = (view: string) => {
    onViewChange(view);
    setMobileMenuOpen(false);
    setShowMenuPreview(false);
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      setShowMenuPreview(true);
    } else {
      onLoginToggle(false);
      setShowMenuPreview(false);
    }
  };

  const handleLoginFromDropdown = () => {
    setShowMenuPreview(false); // Close dropdown first
    onLoginToggle(true); // Then start login
  };

  const showNavigation = isLoggedIn || showMenuPreview;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>

          {/* Nav Items - Scrollable (Conditional) */}
          {showNavigation && (
            <nav className="flex-1 flex justify-center overflow-x-auto gap-1 mx-4 scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`nav-button whitespace-nowrap ${
                    currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs">{item.name}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right Side - User & Auth */}
          <div className="flex items-center gap-4 ml-4">
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                {currentUser.picture && (
                  <img
                    src={currentUser.picture || "/placeholder.svg"}
                    alt="User profile"
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
            )}
            <ThemeSelector currentTheme={themeMode} onThemeChange={onThemeChange} />

            {/* Login/Logout Button */}
            <div className="relative">
              {showMenuPreview && !isLoggedIn && (
                <div
                  ref={menuPreviewRef}
                  className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2 whitespace-nowrap z-50"
                >
                  <p className="text-xs text-gray-300 mb-1">התחבר כדי לגשת לכלי AI</p>
                  <button
                    onClick={() => {
                      setShowMenuPreview(false);
                      onLoginToggle(true);
                    }}
                    className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-3 py-1 rounded text-sm touch-manipulation"
                  >
                    התחבר
                  </button>
                </div>
              )}
              <button
                ref={loginButtonRef}
                onClick={handleLoginClick}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isLoggedIn
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white'
                }`}
                data-testid="login-button"
              >
                {isLoggedIn ? 'Logout' : 'התחבר'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col">
          {/* Top Row - Logo and Actions */}
          <div className="flex justify-between items-center h-16 px-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-lg font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent truncate">
                AI Studio
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn && currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
                  <span className="text-xs font-medium truncate max-w-20">{currentUser.name}</span>
                </div>
              )}
              <ThemeSelector currentTheme={themeMode} onThemeChange={onThemeChange} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-lg hover:bg-gray-800 active:bg-gray-700 touch-manipulation"
                aria-label="Toggle menu"
              >
                <span className="text-lg">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row - Niut Button (only for non-logged users) */}
          {!isLoggedIn && (
            <div className="px-2 pb-2 relative z-40">
              <button
                onClick={() => setShowMenuPreview(!showMenuPreview)}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-200 touch-manipulation bg-net shadow-net"
              >
                📋 ניוט - תצוגה מקדימה של הכלים
              </button>

              {/* Mobile Menu Preview - Opens Downward */}
              {showMenuPreview && (
                <div
                  ref={menuPreviewRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2"
                >
                  <div className="p-3">
                    <p className="text-xs text-gray-300 mb-3 font-medium">כלי AI זמינים:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {navItems.slice(0, 8).map((item) => (
                        <div
                          key={item.view}
                          className="flex items-center gap-2 p-2 bg-gray-700/50 rounded border border-gray-600 text-sm text-gray-300"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-xs truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <button
                        onClick={() => {
                          setShowMenuPreview(false);
                          onLoginToggle(true);
                        }}
                        className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded font-semibold text-sm touch-manipulation"
                      >
                        התחבר לגשת לכל הכלים
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 max-h-screen overflow-y-auto">
            <div className="flex flex-col gap-0">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full nav-button justify-start py-4 px-4 text-left border-b border-gray-700/50 active:bg-gray-700 ${
                    currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                  }`}
                >
                  <span className="text-lg ml-1">{item.icon}</span>
                  <span className="text-base">{item.name}</span>
                </button>
              ))}
              <div className="border-t border-gray-700 my-2" />
              {legalNavItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full nav-button justify-start py-3 px-4 text-left text-sm border-b border-gray-700/50 active:bg-gray-700 ${
                    currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                  }`}
                >
                  <span className="text-lg ml-1">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-700 p-4">
              <button
                onClick={() => {
                  onLoginToggle(!isLoggedIn);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all touch-manipulation ${
                  isLoggedIn
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                    : 'bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 active:from-purple-800 active:to-cyan-600 text-white'
                }`}
              >
                {isLoggedIn ? 'Logout' : 'התחבר'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
