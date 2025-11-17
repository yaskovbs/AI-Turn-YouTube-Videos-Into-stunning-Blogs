import React, { useState } from 'react';
import {
  MOON_ICON,
  SUN_ICON,
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
} from '../constants.tsx';

const Header = ({
  isLoggedIn,
  onLoginToggle,
  isDarkMode,
  onDarkModeToggle,
  currentView,
  onViewChange,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'בית', icon: HOME_ICON, view: 'home' },
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

  const handleNavClick = (view) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>

          {/* Nav Items - Scrollable */}
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
            <button
              onClick={onDarkModeToggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? SUN_ICON : MOON_ICON}
            </button>
            <button
              onClick={() => onLoginToggle(!isLoggedIn)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isLoggedIn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white'
              }`}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDarkModeToggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg hover:bg-gray-800"
            >
              {isDarkMode ? SUN_ICON : MOON_ICON}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-800"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 max-h-96 overflow-y-auto">
            <div className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`nav-button justify-start ${
                    currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              <div className="border-t border-gray-700 my-2" />
              {legalNavItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`nav-button justify-start text-xs ${
                    currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-700 p-2 flex gap-2">
              <button
                onClick={() => onLoginToggle(!isLoggedIn)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isLoggedIn
                    ? 'bg-red-600 hover:bg-red-700 text-white text-sm'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm'
                }`}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
