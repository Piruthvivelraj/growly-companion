GROWLY Android APK Distribution
==================================

This folder (public/downloads/) hosts the direct downloadable APK for GROWLY companion.

HOW TO BUILD & UPDATE THE APK:
-------------------------------
Method 1: Android Studio (Recommended)
1. In your terminal, run:
   npm run cap:open
2. In Android Studio, go to top menu:
   Build -> Build Bundle(s) / APK(s) -> Build APK(s)
3. Once built, copy the generated APK:
   from: android/app/build/outputs/apk/debug/app-debug.apk
   to:   public/downloads/GROWLY.apk
4. Run 'npm run build' or deploy your site!

Method 2: Command Line (with Android SDK installed)
1. Run:
   npm run cap:sync
2. Build debug APK:
   cd android && ./gradlew assembleDebug
3. Copy the APK:
   copy android\app\build\outputs\apk\debug\app-debug.apk public\downloads\GROWLY.apk

Method 3: External Hosting (GitHub Releases / Cloud Storage)
You can also host your APK on GitHub Releases or Supabase Storage, and set the custom download URL directly in GROWLY Settings!
