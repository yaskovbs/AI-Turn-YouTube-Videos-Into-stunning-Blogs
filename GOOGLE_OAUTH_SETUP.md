# Google OAuth Setup Instructions

## Why You Need This

The application requires Google OAuth setup to enable user authentication. Without proper setup, users won't be able to:

- Generate AI blog content
- Save their work
- Access premium features

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing one
3. Note down the **Project ID**

## Step 2: Enable Google APIs

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Enable the following APIs:
   - **Google Identity API** (for OAuth)
   - **Google Gemini API** (for AI blog generation)

## Step 3: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth Consent Screen:
   - User Type: External
   - App Name: AI Studio
   - User support email: Your email
   - Developer contact: Your email
4. Add the following scopes:
   - `.../auth/profile`
   - `.../auth/email`
5. Create Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: http://localhost:3001
   - Authorized redirect URIs:
     - http://localhost:3001
     - If uploading to a server, add your domain here

## Step 4: Create Gemini API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key

## Step 5: Update Environment Variables

Edit the `.env` file in your project root:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_google_oauth_client_id_here

# Gemini AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace the placeholder values with your actual credentials.

## Step 6: Enable Billing (if needed)

For production use with many requests:
1. Go to "Billing" in Google Cloud Console
2. Enable billing
3. Set up usage quotas to avoid unexpected costs

## Troubleshooting

### Error: `NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined`
- Check that the `.env` file exists in project root
- Make sure variable names match exactly
- Restart the dev server after changes

### Login Not Working
- Verify OAuth Consent Screen is properly configured
- Check that http://localhost:3001 is in authorized origins
- Make sure you're using HTTP for localhost (HTTPS required for production)

### API Quotas Exceeded
- Check Google Cloud Console > APIs & Services > Quotas
- Consider upgrading to paid plan for higher limits

## Security Notes

- Never commit `.env` file to version control
- Use different credentials for development/production
- Regularly rotate API keys
- Monitor usage in Google Cloud Console

## Next Steps

After setup is complete:
1. Restart the development server: `npm run dev`
2. Test login functionality
3. Verify AI blog generation works
4. Check that generated blogs are saved properly

Need help? Check the video tutorial or contact support.
