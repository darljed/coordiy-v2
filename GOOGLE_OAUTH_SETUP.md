# Google OAuth Setup Guide

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API (or Google Identity API)

## 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: `CoorDIY`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`
5. Save and continue

## 3. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
5. Save and copy the Client ID and Client Secret

## 4. Update Environment Variables

Add to your `.env` file:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 5. Account Linking Behavior

- **Existing users**: Google account automatically links to existing email
- **New users**: Creates new account with Google profile info
- **Google-only users**: Cannot use password login (redirected to Google)
- **Email verification**: Automatically verified for Google users

## 6. Testing

1. Visit your app's login page
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect to dashboard on success