// services/authService.ts

// IMPORTANT: Replace 'VITE_GOOGLE_CLIENT_ID' with your actual Google Cloud Project Client ID
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'profile email https://www.googleapis.com/auth/youtube.readonly';

// TypeScript type definitions
interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthResult {
  idToken?: string;
  accessToken?: string | null;
  profile: UserProfile;
}

interface TokenResponse {
  access_token?: string;
}

interface GoogleSignInResponse {
  credential: string;
}

type ShowToastFunction = (message: string, type: string) => void;

let googleApiClient: any = null; // Google API client type

export const initGoogleSignIn = (
  onSignIn: (authResult: AuthResult) => void,
  onSignOut: () => void
): void => {
  if (!CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined in environment variables.");
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
    callback: (tokenResponse: TokenResponse) => {
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
    callback: (response: GoogleSignInResponse) => {
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
    ux_mode: 'popup',
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

// Validate and refresh token if needed
export const validateToken = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + accessToken);
    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Request new access token for additional scopes
export const requestAdditionalScopes = (newScopes: string[]) => {
  if (googleApiClient) {
    const combinedScopes = SCOPES + ' ' + newScopes.join(' ');
    googleApiClient.requestAccessToken({
      scope: combinedScopes,
      include_granted_scopes: true,
    });
  }
};

// Simulate email/password authentication (client-side only for demo)
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  // Simple validation - in a real app, this would be server-side
  if (!email || !password) {
    throw new Error('אימייל וסיסמה נדרשים');
  }

  // Check if user exists in localStorage (demo purpose)
  const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    return {
      idToken: `demo-token-${Date.now()}`, // Mock token
      accessToken: null,
      profile: user.profile
    };
  } else {
    throw new Error('אימייל או סיסמה שגויים');
  }
};

// Demo function to create a user account
export const createAccount = async (email: string, password: string, name: string): Promise<void> => {
  const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');

  // Check if user already exists
  if (users.some((u: any) => u.email === email)) {
    throw new Error('משתמש כבר קיים עם אימייל זה');
  }

  // Create new user
  const newUser = {
    email,
    password,
    profile: {
      id: `demo-${Date.now()}`,
      name,
      email,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    }
  };

  users.push(newUser);
  localStorage.setItem('demoUsers', JSON.stringify(users));
};

const fetchUserInfo = async (accessToken: string): Promise<AuthResult> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return { accessToken, profile: { id: data.sub, name: data.name, email: data.email, picture: data.picture } };
};
