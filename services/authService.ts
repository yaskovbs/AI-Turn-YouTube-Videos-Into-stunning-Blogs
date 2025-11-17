// services/authService.ts

// IMPORTANT: Replace 'NEXT_PUBLIC_GOOGLE_CLIENT_ID' with your actual Google Cloud Project Client ID
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'profile email';

let googleApiClient = null; // Changed to null, relying on runtime checks

export const initGoogleSignIn = (
  onSignIn,
  onSignOut
) => {
  if (!CLIENT_ID) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined in environment variables.");
    return;
  }

  // Fix: Directly access window.google with runtime checks
  if (typeof window.google === 'undefined' || !window.google.accounts) {
    console.error("Google Identity Services library not loaded. Ensure script is in index.html <head>");
    return;
  }

  // Ensure google.accounts.oauth2 exists
  if (!window.google.accounts.oauth2) {
    console.error("Google OAuth2 services not available.");
    return;
  }
  
  googleApiClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      if (tokenResponse.access_token) {
        fetchUserInfo(tokenResponse.access_token).then(onSignIn).catch(console.error);
      } else {
        onSignOut();
      }
    },
  });

  // For direct button rendering or one-tap prompt initialization
  // Ensure google.accounts.id exists
  if (!window.google.accounts.id) {
    console.error("Google Identity services not available for ID management.");
    return;
  }

  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => {
      if (response.credential) {
        // Decode JWT to get user info, or send to backend for verification
        const userData = JSON.parse(atob(response.credential.split('.')[1]));
        onSignIn({
          idToken: response.credential,
          accessToken: null, // For one-tap/popup, access token might not be directly available without further steps
          profile: {
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          }
        });
      } else {
        onSignOut();
      }
    },
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  // You can also render a one-tap prompt if desired
  // window.google.accounts.id.prompt();
};

export const signIn = () => {
  if (googleApiClient) {
    googleApiClient.requestAccessToken();
  } else {
    console.error("Google API client not initialized. Attempting direct prompt.");
    // Fallback for one-tap or if direct sign-in from button
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      console.error("Google Identity services not fully loaded for prompt fallback.");
    }
  }
};

export const signOut = () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect(); // Disables auto-selection for future prompts
  } else {
    console.warn("Google Identity services not fully loaded for signOut operations.");
  }
  localStorage.removeItem('userProfile');
  // For full logout from session, if an access token was obtained:
  // if (accessToken) { // You'd need to store/pass the accessToken from the signIn process
  //   if (window.google && window.google.accounts && window.google.accounts.oauth2) { // Runtime check
  //      window.google.accounts.oauth2.revoke(accessToken, () => console.log('Access token revoked'));
  //   }
  // }
};

const fetchUserInfo = async (accessToken) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return { accessToken, profile: { id: data.sub, name: data.name, email: data.email, picture: data.picture } };
};
