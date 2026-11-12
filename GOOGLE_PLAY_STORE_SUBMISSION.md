# AlkePlay Android v1.0.0 — Google Play submission

Updated November 12, 2026. iOS is postponed. This guide is preparation, not a claim that a signed bundle exists or Play Console setup is complete.

## Prepared in this project
- Application/package ID: `com.alkeplay.app`. Your ownership of alkeplay.com makes this a suitable reverse-domain identifier. It does not need www. If you already uploaded a different package to Play Console, this is a new app identity, not an update to that listing.
- Android versionName `1.0.0`, versionCode `1`. Increment versionCode on every later upload. npm version is not the Android store version.
- Complete Capacitor Android project with Gradle wrapper and Java activity.
- compileSdk and targetSdk: **36**; minSdk: 23. New mobile app submissions now require Android 16/API 36, not the previously suggested API 34.
- Native Premium and artist-support checkout routes redirect to the player. Upgrade/payment entry points are hidden. Website payments remain unchanged. Existing subscription entitlements are not made free or changed by this release.
- Profile Settings → Delete Account and public `/delete-account` page perform authenticated permanent deletion. Owned avatars are removed first; profile, supporter, and subscription-reference rows cascade with account deletion.
- Public Privacy Policy works without signing in; review its wording against your actual hosting arrangements before publishing.

## Required next steps on your Windows computer

1. Back up any local uncommitted work first; do not reset or discard it blindly. Pull these changes from your connected repository. If Git reports conflicts, resolve them before continuing.
2. Use Node 20+ and JDK 21 (Capacitor 7), current Android Studio, Android SDK Platform 36 and build tools. Let Android Studio install required SDK packages. Ensure local.properties points to your local Android SDK; never copy another machine’s SDK path.
3. In the VS Code terminal at the project root:

```powershell
npm install
npm run build
npx cap sync android
npx cap open android
```

4. In Android Studio choose **Build → Generate Signed App Bundle / APK → Android App Bundle**. Select the app module, create or choose your **upload keystore**, save that file and its passwords securely outside the repository, choose **release**, and finish. Do not commit keystores, passwords, or keystore.properties. The output directory is shown by Android Studio (commonly `android/app/release/`); copy the resulting `.aab` for upload.
5. Enable Play App Signing when creating the first release. Keep the upload key for future releases. `gradlew bundleRelease` without a signing configuration only produces an unsigned bundle; it is not submission-ready. No signing keys or Play developer login are available in this workspace, so this agent cannot complete signing or submit on your behalf. There is also no Android SDK/JDK installed here to build the bundle.
6. Whenever project changes reach your computer, run `npm install` if dependencies changed, then `npm run build` and `npx cap sync android` again before testing/rebuilding.

## Publish the website before supplying these URLs

- Privacy policy: **https://alkeplay.com/privacy-policy**
- Account deletion: **https://alkeplay.com/delete-account**
- Website: **https://alkeplay.com**

Publish the latest Lovable changes, then open both pages while signed out in a fresh browser. A 200 status alone is insufficient for a single-page website: verify the policy and deletion form actually render. The older published privacy page may still crash until these changes are published. Supply your real support email in Play Console; none has been invented in this guide.

## Play Console setup

1. Open https://play.google.com/console, enroll if needed, and complete identity/contact/device verification shown by Google.
2. Create **AlkePlay**, default language English, **App**, **Free**. Category: **Music & Audio**. There are no Android in-app purchases in this release; do not create Premium subscription products for it.
3. Start with an **internal testing** release. Upload your signed AAB, provide release notes, and test the Play-delivered version, not just a browser preview.
4. App access: document **Continue as Guest** for listening. If reviewers need account-only features, supply a dedicated reviewer account in Play Console, not your personal password.
5. Answer ads, target audience, content rating, and countries based on the real audio/lyrics and actual release. Do not automatically claim “Everyone”, no ads, or no sensitive content. The software has promotional banners; check the final Android release before declaring ads status.
6. For personal accounts created after November 13, 2023: **12 testers continuously opted into closed testing for 14 days**, then apply for production access. This is not the earlier 20-tester requirement and production approval is not automatic.
7. Complete Data Safety and the account-deletion questions, store listing, and all dashboard requirements before requesting review. Upload does not guarantee acceptance.

## Data Safety draft — confirm against your deployed Android release

Do not copy declarations blindly. Google distinguishes collection from sharing and exempts some service-provider processing; inspect your actual contracts and final SDK inventory.

| Data | Android behavior | Suggested purpose / optionality |
| --- | --- | --- |
| Email address | Sent to Supabase for registered accounts | Account management; optional because guest listening exists |
| User ID | Supabase authentication ID | Account management / app functionality; optional account |
| Display name | Sent to Supabase on signup | Account management; optional profile information |
| Photos | Optional uploaded avatar, stored publicly by URL | App functionality; optional; assess sharing honestly |
| Diagnostics/request information | Hosting and Supabase operational logs may contain IP, timestamps, requests and errors | Security / troubleshooting / app functionality; confirm provider log retention and Google’s applicable data categories |
| App interactions / listening telemetry | No dedicated listening-history analytics upload found; audio requests still create hosting request logs | Assess provider logs before deciding whether app interactions are collected; do not invent listening analytics |
| Payment details / purchase history | No Android checkout; existing website subscription state can be read for account display | Assess existing web-member account data in the final app; do not declare Android checkout payments |
| Liked songs | Stored locally, not uploaded by the app | Not collected by the developer if they never leave the device |

- Data is transmitted via HTTPS. Do not declare end-to-end encryption; transport encryption is different.
- Account deletion can be requested in-app and online; verify both with a disposable account. Deletion is immediate after a successful request, not just a hidden flag.
- AlkePlay-held records are removed. Other devices’ local likes, provider backups/logs and payment providers’ legal records have separate retention; the policy discloses this. Confirm actual retention with your providers before final submission.
- Existing website subscriptions are not cancelled automatically by deleting the account. Warn users to cancel billing with the provider first; app deletion itself is not blocked.

## Store listing copy (Android free edition)

**Short description:** Listen to Bode Nathaniel’s music, explore lyrics, and save your favorites.

**Full description:**

AlkePlay brings Bode Nathaniel’s music to your phone. Explore the song library, play tracks, read available lyrics, and save liked songs on your device. Learn more about the artist and enjoy listening as a guest or with a free account.

Only promise features that work in the tested release. Do not advertise offline downloads, purchases, unlimited premium access, or reliable locked-screen playback until implemented and tested on Android.

## Graphics and final acceptance checks

- Existing 512px icon source: `public/app-icons/android-icon-512.png`. Verify appearance on an installed phone; the same source is used for native launcher resources.
- Replace previous AI-generated screenshots with **real screenshots of the final Android release**. Never submit the old Premium/checkout images for the free app or images showing nonexistent features. Capture at least two phone screenshots; test tablet layouts if targeting tablets.
- Supply a real 1024×500 feature graphic. The previous guide claimed this was ready without proof; this task does not generate one.
- Confirm rights to distribute every audio track, lyric, artwork, and artist image, and keep proof ready.
- Test guest playback, account creation/sign-in, favorites, avatar upload, account deletion, interrupted network, and every navigation button. Run the Play pre-launch report and resolve launch crashes or broken core flows. Test with Android 16 as well as an older supported device.
- A Capacitor wrapper still needs a functional, useful native experience; hiding payments alone does not guarantee Google approval. Basic bugs, broken login/audio, misleading screenshots or unsupported claims can still prevent acceptance.

## Official references

- API requirements: https://support.google.com/googleplay/android-developer/answer/11926878
- Account deletion (in-app and web): https://support.google.com/googleplay/android-developer/answer/13327111
- Personal-account testing: https://support.google.com/googleplay/android-developer/answer/14151465
- Capacitor native workflow: https://capacitorjs.com/docs/basics/workflow
- Lovable mobile development: https://lovable.dev/blog/capacitor