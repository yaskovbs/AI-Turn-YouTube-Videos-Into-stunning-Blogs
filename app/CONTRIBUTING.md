# 🤝 Contributing to AI Turn YouTube Videos Into Stunning Blogs

Thank you for your interest in contributing to our AI-powered YouTube blog generator! We welcome contributions from developers of all skill levels. This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Recognition](#recognition)

## 📜 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help maintain a positive community

## 🚀 Getting Started

1. **Prerequisites**:
   - Node.js v18 or later
   - npm or yarn
   - Git

2. **Setup**:
   ```bash
   # Fork and clone the repository
   git clone https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs.git
   cd AI-Turn-YouTube-Videos-Into-stunning-Blogs

   # Install dependencies
   npm install

   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your API keys

   # Start development server
   npm run dev
   ```

3. **Learn the codebase**:
   - Read the [README.md](./README.md) for project overview
   - Check [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) for API setup
   - Browse the `/src` directory to understand the structure

## 🤔 How to Contribute

There are many ways to contribute:

### 🐛 **Bug Fixes**
- Fix reported bugs
- Improve error handling
- Enhance performance

### ✨ **New Features**
- Add new AI capabilities
- Improve UI/UX
- Integrate additional APIs

### 📚 **Documentation**
- Fix typos and grammar
- Add code comments
- Create tutorials or guides

### 🧪 **Testing**
- Write unit tests
- Add integration tests
- Improve test coverage

### 🛠 **Infrastructure**
- Improve build processes
- Update dependencies
- Enhance tooling

## 🔄 Development Process

1. **Choose an issue** from [GitHub Issues](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs/issues) or create your own
2. **Fork the repository** on GitHub
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```
4. **Make your changes** following our coding standards
5. **Test your changes** locally
6. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new AI content generation feature

   - Implements advanced prompt engineering
   - Adds support for multiple content formats
   - Includes proper error handling"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** with a detailed description

## 📏 Code Standards

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for consistent formatting
- Write self-documenting code

### Code Structure
```typescript
// Good: Clear naming and types
interface User {
  id: string;
  name: string;
  email: string;
}

const createUser = (userData: Partial<User>): User => {
  // Implementation
};

// Bad: Unclear naming and no types
const makeUser = (data) => {
  // Implementation
};
```

### Commit Messages
Use conventional commits:
```
feat: add new authentication feature
fix: resolve YouTube API rate limiting issue
docs: update OAuth setup guide
refactor: clean up component structure
test: add unit tests for AI service
```

## 🧪 Testing

We use modern testing practices:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines
- Write tests for new features
- Maintain high test coverage (>80%)
- Test both happy path and error cases
- Use descriptive test names

## 📖 Documentation

### Code Documentation
```typescript
/**
 * Generates blog content from YouTube video using AI
 * @param videoId - The YouTube video ID to process
 * @param options - Configuration options for content generation
 * @returns Promise resolving to generated blog content
 * @throws {Error} When video processing fails
 */
const generateBlogFromVideo = async (
  videoId: string,
  options: GenerationOptions
): Promise<BlogContent> => {
  // Implementation
};
```

### API Documentation
Document API changes in the relevant files and update the README if needed.

## 🐛 Issues

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Provide detailed steps to reproduce
4. Include error messages and screenshots
5. Specify your environment (browser, OS, Node version)

### Feature Requests
1. Check if the feature already exists
2. Describe the problem it solves
3. Provide use cases and examples
4. Consider implementation complexity

## 🔍 Pull Requests

### PR Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No sensitive data is committed
- [ ] Commit messages follow conventions
- [ ] PR description explains the changes

### PR Review Process
1. Automated checks run (linting, tests)
2. Manual review by maintainers
3. Feedback provided within 48 hours
4. Changes requested if needed
5. Approved PRs are merged

## 🎖 Recognition

Contributors are recognized through:

- **GitHub Contributors**: Listed in repository contributors
- **Changelog**: Mentioned in release notes
- **Social Recognition**: Featured in project communications
- **Collaboration Credits**: Mentioned in commit attributions

## 🚨 Security

If you discover security vulnerabilities:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: yaskovbs2502@gmail.com
3. Allow time for investigation and response
4. Receive acknowledgment within 48 hours

## 📞 Contact

**Yakov Team** - Project Maintenance

📧 yaskovbs2502@gmail.com
📱 050-818-1948

For general questions, use [GitHub Discussions](https://github.com/yaskovbs/AI-Turn-YouTube-Videos-Into-stunning-Blogs/discussions).

---

Thank you for contributing to making YouTube video-to-blog conversion better! 🚀
