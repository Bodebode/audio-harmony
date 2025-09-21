# Google Play Store Submission Guide - AlkePlay

## Pre-Submission Checklist

### ✅ App Configuration Ready
- [x] Production `capacitor.config.ts` configured
- [x] App name set to "AlkePlay"  
- [x] Bundle ID: `app.lovable.6df20c0596cb44a7923dcadad2c9355e`
- [x] Version: 1.0.0
- [x] Required Android permissions added

### ✅ Assets Ready
- [x] App icon (512x512): `public/app-icons/android-icon-512.png`
- [x] Feature graphic ready
- [x] Screenshots generated (5 phone + 2 tablet)

### ✅ Required Pages
- [x] Privacy Policy: Your app URL + `/privacy-policy`
- [x] Terms of Service: Your app URL + `/terms-of-service`
- [x] Support page: Your app URL + `/support`

## Google Play Console Setup Steps

### 1. Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete developer profile

### 2. Create New App
1. Click "Create app"
2. App details:
   - **App name**: AlkePlay
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (with in-app purchases)

### 3. Upload App Bundle
1. Build signed AAB:
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew bundleRelease
   ```
2. Upload the AAB file from `android/app/build/outputs/bundle/release/`

### 4. Store Listing
#### App Details
- **App name**: AlkePlay
- **Short description**: Experience Bode Nathaniel's soulful music with premium streaming features
- **Full description**:
```
Dive into the world of Bode Nathaniel's music with AlkePlay - your premium music streaming companion.

🎵 FEATURES:
• High-quality audio streaming
• Beautiful lyrics display
• Intuitive music player interface
• Seamless playlist management

⭐ PREMIUM BENEFITS:
• Ad-free listening experience
• Offline music downloads
• Unlimited song skips
• Exclusive premium content
• Early access to new releases
• VIP merchandise access

🎤 ABOUT THE ARTIST:
Experience the spiritual and uplifting music of Bode Nathaniel, featuring songs like "Alkebulan", "Fire", "Oyoyo", and many more inspirational tracks.

Download AlkePlay today and immerse yourself in premium music streaming designed for true music lovers.
```

#### Graphics
- **App icon**: Upload `public/app-icons/android-icon-512.png`
- **Feature graphic**: Create 1024x500px promotional image
- **Phone screenshots**: Upload all 5 generated phone screenshots
- **Tablet screenshots**: Upload both tablet screenshots

#### Categorization
- **App category**: Music & Audio
- **Content rating**: Everyone
- **Target age group**: 13+

### 5. Content Rating
Complete the content rating questionnaire:
- No violence, sexual content, or inappropriate material
- Music streaming app suitable for all ages

### 6. App Content
- **Privacy Policy**: Provide URL to your privacy policy page
- **Terms of Service**: Provide URL to your terms page
- **Target audience**: Everyone
- **Content guidelines**: Music streaming, no user-generated content

### 7. Pricing & Distribution
- **Price**: Free
- **Countries**: Available in all countries
- **Device categories**: Phone and Tablet

### 8. In-App Products (Premium Subscription)
Set up premium subscription:
- **Product ID**: premium_monthly
- **Price**: $4.99/month
- **Description**: Premium features including ad-free listening and offline downloads

## Pre-Launch Testing

### Internal Testing
1. Upload signed AAB
2. Add internal testers (your email)
3. Test all features:
   - Music playback
   - Premium subscription flow
   - User authentication
   - Offline functionality

### Production Release
1. Complete all store listing requirements
2. Submit for review
3. Review typically takes 1-3 days
4. Once approved, release to production

## Required Developer Information

### Developer Details
- **Developer name**: [Your Name/Company]
- **Contact email**: [Your Email]
- **Website**: [Your Website]
- **Phone**: [Your Phone Number]

### App Signing
- Use Google Play App Signing (recommended)
- Google will manage your app signing key

## Post-Launch
- Monitor crash reports and ANRs
- Respond to user reviews
- Update app regularly
- Track key metrics in Play Console

## Support Links
- **Support URL**: Your app URL + `/support`
- **Privacy Policy**: Your app URL + `/privacy-policy`
- **Terms of Service**: Your app URL + `/terms-of-service`

---

**Note**: Ensure all URLs are accessible and contain proper content before submission. Test thoroughly on different Android devices before releasing to production.