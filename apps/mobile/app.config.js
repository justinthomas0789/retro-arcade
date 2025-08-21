export default {
    expo: {
      name: "Retro Arcade",
      slug: "retro-arcade",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "dark",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#001100"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.retroarcade.mobile",
        buildNumber: "1.0.0"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#001100"
        },
        package: "com.retroarcade.mobile",
        versionCode: 1,
        permissions: [
          "VIBRATE",
          "ACCESS_NETWORK_STATE",
          "INTERNET"
        ]
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      plugins: [
        "expo-ads-admob"
      ],
      extra: {
        eas: {
          projectId: "32d09398-b6e4-4237-bf5b-23a09c21744f"
        }
      }
    }
  };