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

export const getYouTubeApiKey = () => {
  if (window.localStorage) {
    return localStorage.getItem('youtube_data_api_key');
  }
  return null;
};

// Channel data interface
export interface ChannelData {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  uploadsPlaylistId: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
}

// Video data interface
export interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  url: string;
}

// Blog conversion data interface
export interface BlogConversion {
  id: string;
  title: string;
  blogContent: string;
  processedAt: string;
  videoUrl: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

// Updated function to fetch real channel data
export const fetchYouTubeChannelData = async (apiKey: string, channelId: string): Promise<ChannelData> => {
  if (!apiKey) {
    throw new Error("YouTube Data API key is missing. Please set it in the API Key Management page.");
  }
  if (!channelId) {
    throw new Error("YouTube Channel ID is missing.");
  }

  console.warn("WARNING: Fetching YouTube data directly from client-side using a stored API key is INSECURE for production. Use a backend proxy.");

  const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,statistics,contentDetails`;

  try {
    const response = await fetch(channelsUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Channel not found. Please check the Channel ID.');
    }

    const channel = data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount,
      uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads,
      publishedAt: channel.snippet.publishedAt,
      thumbnails: channel.snippet.thumbnails
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch channel data');
  }
};

// Function to fetch videos from a channel
export const fetchYouTubeVideosFromChannel = async (
  apiKey: string,
  channelData: ChannelData,
  maxResults: number = 50,
  pageToken?: string
): Promise<{ videos: VideoData[]; nextPageToken?: string; totalResults: number }> => {
  if (!apiKey) {
    throw new Error("YouTube Data API key is missing.");
  }

  let videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${channelData.uploadsPlaylistId}&part=snippet,contentDetails,status&maxResults=${maxResults}`;

  if (pageToken) {
    videosUrl += `&pageToken=${pageToken}`;
  }

  try {
    const response = await fetch(videosUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items) {
      throw new Error('No videos found for this channel.');
    }

    // Get video statistics
    const videoIds = data.items.map((item: any) => item.contentDetails.videoId).join(',');
    const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics`);
    const statsData = await statsResponse.json();

    const videos: VideoData[] = data.items.map((item: any) => {
      const videoId = item.contentDetails.videoId;
      const stats = statsData.items?.find((v: any) => v.id === videoId);

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        statistics: stats ? stats.statistics : { viewCount: '0', likeCount: '0', commentCount: '0' },
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    });

    return {
      videos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch videos from channel');
  }
};

// Function to convert YouTube video to blog
export const convertVideoToBlog = async (
  apiKey: string,
  videoUrl: string,
  targetAudience: string = 'General audience',
  desiredTone: string = 'Informative',
  onProgress?: (progress: string) => void
): Promise<string> => {
  try {
    if (onProgress) onProgress('Extracting video transcript...');

    // In a real implementation, you would get the transcript here
    // For now, we'll simulate the process
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const transcriptUrl = `https://www.googleapis.com/youtube/v3/captions?key=${apiKey}&videoId=${videoId}&part=snippet`;

    if (onProgress) onProgress('Analyzing video content...');

    // Simulate AI processing
    if (onProgress) onProgress('Generating blog content...');

    // This would be where you call your AI service (Gemini, OpenAI, etc.)
    // For now, we'll create a simulated blog post
    const simulatedBlog = `# Video to Blog Conversion

## Original Video: Sample Video Title

**Published:** ${new Date().toLocaleDateString()}

**Transcription Analysis:**
This video covers important topics related to the content.

**Key Points:**
- Main point 1
- Main point 2
- Main point 3

**Blog Content:**
[Simulated blog content based on video analysis]

Note: This is a simulated conversion. In production, this would use AI services to analyze the actual video transcript and generate comprehensive blog posts.

**Video Source:** ${videoUrl}

---

*Converted with AI Studio - Target Audience: ${targetAudience} | Tone: ${desiredTone}*
`;

    if (onProgress) onProgress('Conversion completed!');

    return simulatedBlog;

  } catch (error) {
    console.error('Blog conversion error:', error);
    throw new Error('Failed to convert video to blog');
  }
};
