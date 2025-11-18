# 🎬 AI Turn YouTube Videos Into Stunning Blogs

Transform YouTube videos into professional, engaging blog posts instantly using advanced AI technology.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://ai-turn-youtube-videos-into-stunning-blogs.pages.dev/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge&logo=v0)](https://v0.app/chat/sgHCYk5mlmt)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Using Google Gemini AI for intelligent blog creation
- 📺 **YouTube Integration** - Direct video analysis and transcription
- 🔐 **Secure OAuth Authentication** - Google Identity Services for safe login
- 📱 **Responsive Design** - Mobile-first approach with modern UI/UX
- ⚡ **Real-time Processing** - Fast content generation and publishing
- 🎨 **Multiple Themes** - Dark/light mode support
- 🌐 **Multi-language Support** - Hebrew and English interface

## 🔧 Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

### Backend & APIs
- **Google Gemini AI** - Content generation
- **YouTube Data API v3** - Video analysis
- **Google OAuth 2.0** - Secure authentication

### Tools & Deployment
- **Vercel** - Hosting platform
- **v0.app** - UI design and prototyping
- **ESLint** - Code quality
- **Prettier** - Code formatting

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Google Cloud Console account** for API access

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs.git
cd AI-Turn-YouTube-Videos-Into-stunning-Blogs

# Install dependencies
npm install
# or
yarn install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
# or
yarn dev

# Open http://localhost:3000
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth 2.0
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Google APIs Setup

1. **Google Cloud Console**: Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Enable APIs**:
   - YouTube Data API v3
   - Google+ API
3. **Create OAuth 2.0 Credentials**:
   - Set up consent screen
   - Add authorized origins and redirects
4. **API Keys**: Generate API key for YouTube Data API

**Complete Setup Guide** → [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs)

1. Fork this repository
2. Connect your GitHub to Vercel
3. Import the project
4. Add environment variables
5. Deploy automatically!
6. Your live app will be available instantly

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to your hosting provider
# (Vercel, Netlify, Firebase, Railway, etc.)
```

## 🏗 Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base components (buttons, inputs, etc.)
│   │   └── ...           # Feature components
│   ├── services/         # API integrations (Google, YouTube)
│   ├── hooks/            # Custom React hooks
│	├── lib/              # Utility functions & configurations
│   ├── styles/           # Global styles & themes
│   └── utils/            # Helper functions
├── public/               # Static assets & icons
├── docs/                 # Documentation
└── types/                # TypeScript definitions
```

## 🛠 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Code quality
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Development Workflow

1. **Local Development**: Use `npm run dev` for hot-reload
2. **Code Quality**: Run linting and formatting before commits
3. **Testing**: Ensure all functionality works locally
4. **Build Check**: Test production build regularly

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with proper commits
4. Test thoroughly
5. Submit Pull Request

### Code Standards:
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow established rules
- **Prettier**: Consistent code formatting
- **Security**: Never commit sensitive data

## 📞 Contact

**Yakov Team** - Project Creator & Maintainer

📧 Email: yaskovbs2502@gmail.com
📱 Phone: 050-818-1948
🐙 GitHub: [@yaskovbs](https://github.com/yaskovbs)

**Project Link**: [https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs)

### Support
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs/discussions)
- **📖 Documentation**: [OAuth Setup Guide](./OAUTH_SETUP_GUIDE.md)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License - see LICENSE file for full text
```

## 🙏 Acknowledgments

Special thanks to our amazing contributors and the open-source community:

- **Google AI Studio** - Powered by Google Gemini AI
- **YouTube Data API** - For seamless video integration
- **v0.app** - Modern UI design and rapid prototyping
- **Vercel** - Fast, reliable deployment platform
- **React & TypeScript** - Building modern web applications

---

<div align="center">

**Built with ❤️ using React, TypeScript, and AI technology**

[![Forks](https://img.shields.io/github/forks/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs?style=social)](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs/fork)
[![Stars](https://img.shields.io/github/stars/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs?style=social)](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs)

</div>
