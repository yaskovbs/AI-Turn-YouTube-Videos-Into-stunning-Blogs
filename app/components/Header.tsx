import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
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
  AD_ICON,
  FAQ_ICON,
  CONTACT_ICON,
  LEGAL_ICON,
} from '../constants.tsx';

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

  const navItems = [
    { icon: HOME_ICON, text: "בית", view: 'home' },
    { icon: BLOG_ICON, text: "יוטיוב לבלוג", view: 'blog' },
    { icon: IMAGE_GENERATOR_ICON, text: "מחולל תמונות", view: 'image-gen' },
    { icon: IMAGE_EDITOR_ICON, text: "עורך תמונות", view: 'image-edit' },
    { icon: VIDEO_GENERATOR_ICON, text: "מחולל וידאו", view: 'video-gen' },
    { icon: VIDEO_ANALYZER_ICON, text: "מנתח וידאו", view: 'video-analyze' },
    { icon: CHAT_ICON, text: 'צ\'אט בוט', view: 'chatbot' },
    { icon: VOICE_ASSISTANT_ICON, text: "עוזר קולי", view: 'voice-assistant' },
    { icon: TEXT_TO_SPEECH_ICON, text: "טקסט לדיבור", view: 'text-to-speech' },
    { icon: YOUTUBE_CHANNEL_ICON, text: "ערוץ יוטיוב שלי", view: 'youtube-channel' },
    { icon: API_KEY_ICON, text: "מפתח API", view: 'api-key' },
    { icon: AD_ICON, text: "AdSense", view: 'adsense' },
    { icon: FAQ_ICON, text: "שאלות נפוצות", view: 'faq' },
    { icon: CONTACT_ICON, text: "צור קשר", view: 'contact' },
  ];

  const legalNavItems = [
    { name: 'תנאי שימוש', icon: LEGAL_ICON, view: 'terms' },
    { name: 'מדיניות פרטיות', icon: LEGAL_ICON, view: 'privacy' },
  ];

  const handleNavClick = (view: string) => {
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
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>

          {/* Nav Items - Flat */}
          <NavigationMenu className="flex-1 justify-center mx-4">
            <NavigationMenuList className="gap-1 flex overflow-x-auto">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.view}>
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => handleNavClick(item.view)}
                      className={`nav-button whitespace-nowrap ${
                        currentView === item.view ? 'nav-button-active' : 'nav-button-inactive'
                      }`}
                    >
                      {item.icon}
                      <span className="text-xs">{item.text}</span>
                    </button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

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
            <button
              onClick={() => onLoginToggle(!isLoggedIn)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isLoggedIn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white'
              }`}
              data-testid="login-button"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h1 className="text-lg font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector currentTheme={themeMode} onThemeChange={onThemeChange} />
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
              {/* Home */}
              <button
                onClick={() => handleNavClick('home')}
                className={`nav-button justify-start ${
                  currentView === 'home' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {HOME_ICON}
                <span>בית</span>
              </button>

              {/* AI Tools Section */}
              <div className="border-t border-gray-700 my-2" />
              <div className="text-xs text-gray-400 px-2 py-1">כלי AI</div>
              <button
                onClick={() => handleNavClick('blog')}
                className={`nav-button justify-start ${
                  currentView === 'blog' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {BLOG_ICON}
                <span>יוטיוב לבלוג</span>
              </button>
              <button
                onClick={() => handleNavClick('image-gen')}
                className={`nav-button justify-start ${
                  currentView === 'image-gen' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {IMAGE_GENERATOR_ICON}
                <span>מחולל תמונות</span>
              </button>
              <button
                onClick={() => handleNavClick('image-edit')}
                className={`nav-button justify-start ${
                  currentView === 'image-edit' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {IMAGE_EDITOR_ICON}
                <span>עורך תמונות</span>
              </button>
              <button
                onClick={() => handleNavClick('video-gen')}
                className={`nav-button justify-start ${
                  currentView === 'video-gen' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {VIDEO_GENERATOR_ICON}
                <span>מחולל וידאו</span>
              </button>
              <button
                onClick={() => handleNavClick('video-analyze')}
                className={`nav-button justify-start ${
                  currentView === 'video-analyze' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {VIDEO_ANALYZER_ICON}
                <span>מנתח וידאו</span>
              </button>

              {/* Communication Section */}
              <div className="border-t border-gray-700 my-2" />
              <div className="text-xs text-gray-400 px-2 py-1">תקשורת</div>
              <button
                onClick={() => handleNavClick('chatbot')}
                className={`nav-button justify-start ${
                  currentView === 'chatbot' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {CHAT_ICON}
                <span>צ'אט בוט</span>
              </button>
              <button
                onClick={() => handleNavClick('voice-assistant')}
                className={`nav-button justify-start ${
                  currentView === 'voice-assistant' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {VOICE_ASSISTANT_ICON}
                <span>עוזר קולי</span>
              </button>
              <button
                onClick={() => handleNavClick('text-to-speech')}
                className={`nav-button justify-start ${
                  currentView === 'text-to-speech' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {TEXT_TO_SPEECH_ICON}
                <span>טקסט לדיבור</span>
              </button>

              {/* Account Section */}
              <div className="border-t border-gray-700 my-2" />
              <div className="text-xs text-gray-400 px-2 py-1">חשבון</div>
              <button
                onClick={() => handleNavClick('youtube-channel')}
                className={`nav-button justify-start ${
                  currentView === 'youtube-channel' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {YOUTUBE_CHANNEL_ICON}
                <span>ערוץ יוטיוב שלי</span>
              </button>
              <button
                onClick={() => handleNavClick('api-key')}
                className={`nav-button justify-start ${
                  currentView === 'api-key' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {API_KEY_ICON}
                <span>מפתח API</span>
              </button>
              <button
                onClick={() => handleNavClick('adsense')}
                className={`nav-button justify-start ${
                  currentView === 'adsense' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {AD_ICON}
                <span>AdSense</span>
              </button>

              {/* Support Section */}
              <div className="border-t border-gray-700 my-2" />
              <div className="text-xs text-gray-400 px-2 py-1">תמיכה</div>
              <button
                onClick={() => handleNavClick('faq')}
                className={`nav-button justify-start ${
                  currentView === 'faq' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {FAQ_ICON}
                <span>שאלות נפוצות</span>
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`nav-button justify-start ${
                  currentView === 'contact' ? 'nav-button-active' : 'nav-button-inactive'
                }`}
              >
                {CONTACT_ICON}
                <span>צור קשר</span>
              </button>

              {/* Legal */}
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
                    : 'bg-linear-to-r from-purple-600 to-cyan-500 text-white text-sm'
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
