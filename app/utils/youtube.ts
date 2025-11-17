export const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
};

export const setYouTubeApiKey = (key: string): void => {
  if (window.localStorage) {
    localStorage.setItem('youtube_data_api_key', key);
  }
};

export const getYouTubeApiKey = (): string | null => {
  if (window.localStorage) {
    return localStorage.getItem('youtube_data_api_key');
  }
  return null;
};

// Fetch real YouTube channel data from YouTube Data API v3 using OAuth access token
// This is secure as it uses authenticated access tokens instead of API keys
export const fetchYouTubeChannelData = async (accessToken: string, channelId: string): Promise<any> => {
  if (!accessToken) {
    throw new Error("OAuth access token is missing. Please authenticate first.");
  }
  if (!channelId) {
    throw new Error("YouTube Channel ID is missing.");
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      const snippet = channel.snippet;
      const contentDetails = channel.contentDetails;

      return {
        id: channel.id,
        title: snippet.title,
        description: snippet.description,
        thumbnails: snippet.thumbnails,
        publishedAt: snippet.publishedAt,
        uploadsPlaylistId: contentDetails?.relatedPlaylists?.uploads,
        subscriberCount: snippet.subscriberCount,
        videoCount: snippet.videoCount
      };
    } else {
      throw new Error("Channel not found or API key invalid.");
    }
  } catch (error) {
    console.error('Error fetching YouTube channel data:', error);
    throw new Error(`Failed to fetch channel data: ${error instanceof Error ? error.message : String(error)}`);
  }
};
