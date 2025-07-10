# SkyJournal App

A mindful mobile journaling app for capturing sky moments with beautiful animations and cloud type identification.

## Features

- 📸 Capture sky photos with camera integration
- 📍 Automatic location tagging
- ☁️ Cloud type identification and education
- 🎨 Beautiful Airbnb-inspired UI with smooth animations
- 💾 Local storage for your sky moments
- 📱 Responsive design for mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the SkyJournalApp directory:
   ```bash
   cd SkyJournalApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal  
- **Web**: Press `w` in the terminal
- **Mobile Device**: Scan QR code with Expo Go

## Permissions

The app requires the following permissions:
- Camera: To capture sky photos
- Location: To tag photos with location data

## Cloud Types Supported

- **Cumulus**: Fluffy, white, fair weather clouds
- **Stratus**: Low, gray, layered clouds
- **Cirrus**: High, thin, wispy clouds
- **Cumulonimbus**: Large, towering storm clouds
- **Altocumulus**: Mid-level, gray/white patches
- **Nimbostratus**: Dark, rain-bearing clouds
- **Cirrostratus**: Thin, sheet-like high clouds
- **Clear Sky**: No clouds visible

## Tech Stack

- React Native
- Expo
- AsyncStorage for local data persistence
- Expo Image Picker for camera functionality
- Expo Location for GPS services
- Expo File System for file operations
- Expo Blur for UI effects

## Project Structure

```
SkyJournalApp/
├── App.js              # Main application component
├── app.json            # Expo configuration
├── package.json        # Dependencies
├── index.js            # Entry point
└── assets/             # App icons and splash screen
```

## Troubleshooting

If you encounter any issues:

1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Reset Expo cache: `expo start -c`
4. Ensure all permissions are granted on your device

## Contributing

Feel free to submit issues and enhancement requests! 