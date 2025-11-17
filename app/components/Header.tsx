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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>

          {/* Nav Items - Organized */}
          <NavigationMenu className="flex-1 justify-center mx-4">
            <NavigationMenuList className="gap-1">
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`nav-button whitespace-nowrap ${
                      currentView === 'home' ? 'nav-button-active' : 'nav-button-inactive'
                    }`}
                  >
                    {HOME_ICON}
                    <span className="text-xs">בית</span>
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* AI Tools Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-button nav-button-inactive whitespace-nowrap">
                  🎨 כלי AI
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => handleNavClick('image-gen')}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500/10 to-cyan-500/10 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="text-2xl mb-2">{IMAGE_GENERATOR_ICON}</div>
                          <div className="mb-2 text-lg font-medium">כלי יצירה</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            צור תמונות, וידאו ותוכן מתקדם בעזרת בינה מלאכותית
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('blog')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'blog' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {BLOG_ICON}
                        <span>יוטיוב לבלוג</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('image-gen')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'image-gen' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {IMAGE_GENERATOR_ICON}
                        <span>מחולל תמונות</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('image-edit')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'image-edit' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {IMAGE_EDITOR_ICON}
                        <span>עורך תמונות</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('video-gen')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'video-gen' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {VIDEO_GENERATOR_ICON}
                        <span>מחולל וידאו</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('video-analyze')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'video-analyze' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {VIDEO_ANALYZER_ICON}
                        <span>מנתח וידאו</span>
                      </button>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Communication Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-button nav-button-inactive whitespace-nowrap">
                  💬 תקשורת
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => handleNavClick('chatbot')}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-green-500/10 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="text-2xl mb-2">{CHAT_ICON}</div>
                          <div className="mb-2 text-lg font-medium">כלי תקשורת</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            צ'טבוט כביש, עוזר קולי והמרת קול לטקסט
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('chatbot')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'chatbot' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {CHAT_ICON}
                        <span>צ'אט בוט</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('voice-assistant')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'voice-assistant' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {VOICE_ASSISTANT_ICON}
                        <span>עוזר קולי</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('text-to-speech')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'text-to-speech' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {TEXT_TO_SPEECH_ICON}
                        <span>טקסט לדיבור</span>
                      </button>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Account Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-button nav-button-inactive whitespace-nowrap">
                  👤 חשבון
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[300px]">
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('youtube-channel')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'youtube-channel' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {YOUTUBE_CHANNEL_ICON}
                        <span>ערוץ יוטיוב שלי</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('api-key')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'api-key' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {API_KEY_ICON}
                        <span>מפתח API</span>
                      </button>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Support Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="nav-button nav-button-inactive whitespace-nowrap">
                  ❓ תמיכה
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[300px]">
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('faq')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'faq' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {FAQ_ICON}
                        <span>שאלות נפוצות</span>
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => handleNavClick('contact')}
                        className={`w-full nav-button justify-start ${
                          currentView === 'contact' ? 'nav-button-active' : 'nav-button-inactive'
                        }`}
                      >
                        {CONTACT_ICON}
                        <span>צור קשר</span>
                      </button>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
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
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white'
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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
