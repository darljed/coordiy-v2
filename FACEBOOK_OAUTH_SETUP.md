# Facebook OAuth Setup Guide

## 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - App name: `CoorDIY`
   - App contact email: Your email
5. Create the app

## 2. Configure Facebook Login

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`

## 3. Configure OAuth Settings

1. Go to **Facebook Login** > **Settings**
2. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/api/auth/facebook/callback`
   - Production: `https://yourdomain.com/api/auth/facebook/callback`
3. Enable **Use Strict Mode for Redirect URIs**
4. Save changes

## 4. Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy your **App ID** and **App Secret**
3. Add your app domain in **App Domains**:
   - Development: `localhost`
   - Production: `yourdomain.com`

## 5. Update Environment Variables

Add to your `.env` file:
```env
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

## 6. Account Linking Behavior

- **Existing users**: Facebook account automatically links to existing email
- **New users**: Creates new account with Facebook profile info
- **Facebook-only users**: Cannot use password login (redirected to Facebook)
- **Email verification**: Automatically verified for Facebook users

## 7. App Review (For Production)

1. Go to **App Review** > **Permissions and Features**
2. Request **email** permission (usually auto-approved)
3. Request **public_profile** permission (usually auto-approved)
4. Submit for review if needed

## 8. Testing

1. Visit your app's login page
2. Click "Continue with Facebook"
3. Complete Facebook OAuth flow
4. Should redirect to dashboard on success

## 9. Privacy Policy (Required)

1. Create a privacy policy for your app
2. Add the URL in **Settings** > **Basic** > **Privacy Policy URL**
3. Required for app approval and public use