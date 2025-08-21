// Project Structure Documentation
// README.md for the monorepo
# Retro Arcade - Modern Gaming Platform

A scalable monorepo for retro gaming experiences across web and mobile platforms.

## 🚀 Features

- **Cross-platform**: Web (React) and Mobile (React Native + Expo)
- **Monorepo Architecture**: Turborepo for efficient build and development
- **Shared Game Engine**: Reusable game logic across platforms
- **Modern UI/UX**: Multiple themes with smooth animations
- **Monetization Ready**: Ad integration for mobile apps
- **Performance Optimized**: Built for scalability and smooth gameplay

## 📁 Project Structure

```
retro-arcade/
├── apps/
│   ├── web/                 # React web application
│   └── mobile/              # React Native mobile app
├── packages/
│   └── game-engine/         # Shared game logic and utilities
├── package.json
├── turbo.json
└── README.md
```

## 🎮 Games

### Block Stack (Tetris-like) ✅ FULLY FUNCTIONAL
- Classic falling blocks puzzle game with modern Canvas 2D rendering
- Comprehensive scoring system (piece placement, hard drops, line clearing)
- Ghost piece preview for better gameplay
- Progressive difficulty levels with increasing speed
- High score tracking with local storage
- Responsive design that adapts to different screen sizes
- Smooth animations and visual feedback

### Planned Games
- Brick Breaker (Breakout-like)
- Space Defender (Space Invaders-like)
- Snake Classic
- And more retro favorites!

## 🛠️ Tech Stack

### Frontend
- **Web**: React 18, TypeScript, React Router, Vite
- **Mobile**: React Native, Expo SDK 49, React Navigation
- **Styling**: CSS-in-JS, Expo Linear Gradient
- **State Management**: React Hooks, Context API
- **Game Rendering**: HTML5 Canvas 2D API (migrated from PixiJS for better compatibility)

### Game Engine
- **Architecture**: Event-driven with EventEmitter pattern
- **Rendering**: Canvas 2D with responsive sizing
- **Game Loop**: RequestAnimationFrame for smooth 60fps gameplay
- **State Management**: Immutable state updates with event emission
- **Storage**: LocalStorage for high scores and game data

### Development
- **Monorepo**: Turborepo for efficient builds and caching
- **Build Tools**: TypeScript, ESLint, Vite (web), Metro (mobile)
- **Package Manager**: pnpm for fast, efficient dependency management
- **Version Control**: Git

### Mobile Features
- **Audio**: Expo AV for sound effects and music
- **Ads**: Expo AdMob integration
- **Storage**: AsyncStorage for game data
- **Gestures**: React Native Gesture Handler

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd retro-arcade

# Install dependencies
pnpm install

# Start development servers
pnpm run dev
```

### Web Development
```bash
# Start web app
cd apps/web
npm run dev
```

### Mobile Development
```bash
# Start mobile app
cd apps/mobile
npm run start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 📱 Mobile App Store Deployment

### Android (Google Play Store)
```bash
# Build for Android
cd apps/mobile
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

### iOS (App Store)
```bash
# Build for iOS
cd apps/mobile
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## 💰 Monetization

The mobile app includes non-intrusive ad integration:
- **Banner Ads**: Displayed between games list
- **Interstitial Ads**: Shown after game over (respectful timing)
- **Rewarded Ads**: Optional ads for bonus features

## 🎨 Themes

Three built-in themes:
- **Retro Green**: Classic terminal look
- **Neon Blue**: Cyberpunk aesthetic  
- **Classic White**: Clean modern design

## 🔧 Configuration

### Environment Variables
Create `.env` files for each app:

```bash
# apps/web/.env
REACT_APP_VERSION=1.0.0

# apps/mobile/.env
EXPO_PUBLIC_ADMOB_APP_ID=your-admob-app-id
EXPO_PUBLIC_ADMOB_BANNER_ID=your-banner-id
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=your-interstitial-id
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy-loaded game modules
- **Canvas 2D Rendering**: Hardware-accelerated graphics with efficient drawing operations
- **Event-Driven Architecture**: Minimal re-renders with targeted state updates
- **Responsive Design**: Dynamic canvas sizing for optimal performance across devices
- **Memory Management**: Proper cleanup of game instances and event listeners
- **Efficient Game Loop**: RequestAnimationFrame for smooth 60fps gameplay

## 🐛 Recent Bug Fixes & Improvements

### August 21, 2025 Session
- ✅ **Fixed Game Over Score Display**: Resolved issue where final score showed as 0
- ✅ **Added Missing Manifest**: Created PWA manifest file to eliminate 404 errors
- ✅ **Canvas 2D Migration**: Migrated from PixiJS to Canvas 2D for better compatibility
- ✅ **Enhanced Scoring System**: Added comprehensive scoring for piece placement, hard drops, and line clearing
- ✅ **Ghost Piece Preview**: Added semi-transparent ghost piece for better gameplay
- ✅ **Responsive Canvas**: Improved canvas sizing and responsiveness across screen sizes
- ✅ **High Score Preservation**: Fixed high score saving and display in game over modal

## 🎯 Current Status

### ✅ Working Features
- **Block Stack Game**: Fully functional with all game mechanics
- **Web Application**: Complete React app with routing and responsive design
- **Scoring System**: Comprehensive point system with local storage
- **Game Controls**: Keyboard controls with proper event handling
- **Visual Feedback**: Ghost pieces, grid lines, and smooth animations
- **PWA Support**: Basic progressive web app configuration

### 🚧 In Development
- **Mobile Application**: React Native version needs Canvas 2D migration
- **Additional Games**: Brick Breaker, Space Defender, Snake Classic
- **Sound Effects**: Audio integration for enhanced gameplay
- **Enhanced Themes**: More visual themes and customization options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the `RETRO_ARCADE_SESSION_SUMMARY.md` for detailed development history
- Review the troubleshooting section in the documentation

---

**Last Updated**: August 21, 2025  
**Version**: 1.0.0  
**Status**: Block Stack game fully functional, mobile app in development
