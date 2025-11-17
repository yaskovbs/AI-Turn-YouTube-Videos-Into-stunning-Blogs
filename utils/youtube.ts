export const getYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
};

export const setYouTubeApiKey = (key) => {
  if (window.localStorage) {
    localStorage.setItem('youtube_data_api_key', key);
  }
};

export const getYouTubeApiKey = () => {
  if (window.localStorage) {
    return localStorage.getItem('youtube_data_api_key');
  }
  return null;
};

// This is a placeholder for a function that would actually fetch data
// In a real application, this would involve a backend proxy for security.
export const fetchYouTubeChannelData = async (apiKey, channelId) => {
  if (!apiKey) {
    throw new Error("YouTube Data API key is missing. Please set it in the API Key Management page.");
  }
  if (!channelId) {
    throw new Error("YouTube Channel ID is missing.");
  }

  console.warn("WARNING: Fetching YouTube data directly from client-side using a stored API key is INSECURE for production. Use a backend proxy.");

  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: channelId,
        title: "Simulated YouTube Channel",
        description: "This is a simulated description for a YouTube channel. For real data, a backend proxy would be required.",
        uploadsPlaylistId: "UUxxxxxxxxxxxxxxxxx"
      });
    }, 1000);
  });
};
