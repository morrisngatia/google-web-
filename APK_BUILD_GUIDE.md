# MOH Stylist Android APK Compile & Build Guide

This premium guide outlines the steps to build and package this **MOH Stylist** web application into a fully functional, installable Android `.apk` file using **CapacitorJS**—the modern, lightweight, industry-standard hybrid wrapper from Ionic.

---

## 🚀 Recommended Approach: CapacitorJS

Capacitor easily wraps your built React-Vite static assets (`dist/`) into an Android Studio project, allowing you to build and debug an APK.

### Step 1: Install Capacitor Dependencies
Run the following commands in your project's terminal:
```bash
# Install Capacitor core & CLI
npm install @capacitor/core
npm install -D @capacitor/cli

# Initialize your Capacitor project config
npx cap init "MOH Stylist" "com.mohstylist.app" --web-dir=dist
```

### Step 2: Install the Android Platform
```bash
# Install the Android package
npm install @capacitor/android

# Add the Android platform workspace
npx cap add android
```

### Step 3: Configure `capacitor.config.json`
Your `capacitor.config.json` is automatically created in your root folder. For maximum compatibility with web elements, verify it resembles this:
```json
{
  "appId": "com.mohstylist.app",
  "appName": "MOH Stylist",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

### Step 4: Build your React App & Sync Assets
Each time you make visual changes in your React workspace, run:
```bash
# Compile and build the optimized production web assets
npm run build

# Copy web files into the native Android structure
npx cap sync
```

### Step 5: Compile your APK in Android Studio
1. Open the Capacitor project in Android Studio:
   ```bash
   npx cap open android
   ```
2. Wait for Gradle to finish indexing.
3. Select **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)** from the top menu bar.
4. Android Studio will compile your code and show a pop-up: *"APK(s) generated successfully: Locate APK"*.
5. Transfer this `.apk` file to your mobile phone via email, WhatsApp, or Google Drive, and install it instantly!

---

## ⚡ Alternative Approach: Rapid WebView wrapper (Zero Code)

If you don't have Android Studio installed locally or want a one-click build, follow this:

1. **Host your preview URL**: Publish this web application (using the AI Studio deployment or platforms like Vercel/Netlify).
2. Go to [Llama-Life Android Generator](https://www.webintoapp.com/) or [Appflow](https://ionicframework.com/appflow).
3. Insert your hosted URL (e.g., `https://mohstylist.ke`).
4. Set the app name to **MOH Stylist**, select your icon, and download your ready-to-install `.apk` file in under 2 minutes.
