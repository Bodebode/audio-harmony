# AlkePlay - App Store (iOS) Submission Metadata

> Accurate as of 21 Nov 2026. This file previously listed the old Lovable app ID and
> described Premium/offline features that are **not** present in the shipped app.
> Both have been corrected below — do not submit the App Store record using the old text.

## Basic Information
- **App Name**: AlkePlay (17 characters max on the App Store — this fits)
- **Version**: 1.0.0 (versionCode/build 1 for the first iOS build)
- **Bundle ID**: `com.alkeplay.app`
- **Primary Language**: English (UK)
- **Category**: Music
- **Content Rating**: answer the questionnaire honestly; if any lyrics are explicit,
  declare it, otherwise 4+ is defensible
- **Price**: Free

## App Description

### Promotional Text (170 characters max)
Bode Nathaniel's catalogue, lyrics and favourites — free, in one place.

### Description (4000 characters max)
AlkePlay is a free music app for listening to Bode Nathaniel's catalogue.

What you can do:
- Stream the full library with play, pause, skip and seek
- Read synced lyrics alongside the track you're playing
- Search by song or artist
- Browse the library and artist pages
- Sign in to like songs and keep your favourites
- Continue as a guest without creating an account
- Upload a profile photo and manage your profile
- Delete your account and its data from inside the app

AlkePlay is free to use. There are no subscriptions, no in-app purchases and no
ads in the iOS app.

### Keywords (100 characters max, comma separated)
Bode Nathaniel,music,streaming,lyrics,player,library,favourites,guest,nigerian

## What is NOT in the iOS app (do not mention these)
- No Premium tier
- No subscriptions or in-app purchases
- No offline downloads
- No high-quality/320kbps toggle
- No ads

Stripe and PayPal checkout exist on the **website only**. `src/lib/platform.ts`
hides them on every native build (Android **and** iOS), and the `/premium` and
`/support` routes are blocked before those pages mount.

## URLs
- **Privacy Policy**: https://alkeplay.com/privacy-policy
- **Terms of Service**: https://alkeplay.com/terms-of-service
- **Account Deletion**: https://alkeplay.com/delete-account
- **Support URL**: https://alkeplay.com/support (website page — supply a support
  email in App Store Connect as well)

## App Store Review notes (paste into "Notes for Reviewer")
Guest mode is fully functional: browsing, search, playback and lyrics all work
without an account. Sign-in is only required to like songs and save favourites.
To test account creation and deletion, use the dedicated reviewer account below.
There are no in-app purchases, subscriptions or paid features in this build.

## Reviewer account (fill in before submitting)
- Email: <create a dedicated reviewer account>
- Password: <strong, disposable password>

## Data collected (must match App Store Connect "App Privacy")
| Data | Collected | Used for | Linked to you |
|---|---|---|---|
| Email address | Yes | Account creation, sign-in | Yes |
| Name (display name) | Yes | Profile | Yes |
| User ID | Yes | Account, favourites | Yes |
| Photos (profile avatar) | Yes | Profile | Yes |
| Purchases | No | — | — |
| Location | No | — | — |
| Contact info | No | — | — |

Nothing is sold or shared with third parties for advertising. If you later add
analytics, search-history logging or location, update App Privacy and the
privacy policy **before** shipping that change.

## Required iOS configuration
1. **Photo library / camera permission text** — `src/components/AvatarUpload.tsx`
   uses `<input type="file" accept="image/*">`, which opens the iPhone photo
   picker and camera. Without these Info.plist keys the app **crashes** when a
   user taps "upload photo":
   - `NSPhotoLibraryUsageDescription`
   - `NSCameraUsageDescription`
   Add both to `ios/App/App/Info.plist` after the iOS project is created.
2. **No `server.url`** in `capacitor.config.ts` — the app ships its bundled
   assets, which is what makes the native payment hiding apply.
3. **Push notifications** are not used; do not enable the capability.
4. App Store requires **64-bit** and a recent minimum iOS version — accept
   Capacitor's default deployment target unless Xcode tells you otherwise.

## Assets
- [x] App icon 1024x1024: `public/app-icons/ios-icon-1024.png` (no alpha channel)
- [x] Splash screen: `public/app-icons/splash-screen.png`
- [ ] iPhone screenshots — **must be real captures from the installed build**,
      not AI-generated mockups. Apple rejects listings whose screenshots do not
      match the running app.
- [ ] iPad screenshots (only if you support iPad)
- [ ] App Store Connect app icon upload (1024x1024, no transparency)

### Screenshot set to capture (iPhone 6.7" and 6.5")
1. Home / main player
2. Library list
3. Now playing with lyrics
4. Search results
5. Profile with avatar and Delete Account visible

## Checklist
- [x] Apple Developer Program paid
- [ ] Apple enrolment verified (watch for the confirmation email)
- [ ] Accept the Program License Agreement in App Store Connect
- [ ] Banking & tax forms (only needed if you ever charge money; skip for a free app)
- [ ] Create the App Store Connect app record, bundle ID `com.alkeplay.app`
- [ ] Add the iOS project to the repository (`npx cap add ios`)
- [ ] Add the two Info.plist permission keys above
- [ ] Real device screenshots
- [ ] TestFlight build to your own device
- [ ] Submit for review
