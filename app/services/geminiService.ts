import { GoogleGenAI, Modality, Type } from '@google/genai';
import { getYouTubeVideoId } from '../utils/youtube';
import { decode, decodeAudioData, createPcmBlob } from '../utils/file';

// TypeScript type definitions
interface YouTubeVideoInfo {
  title: string;
  thumbnail: string;
  embedUrl: string;
}

interface BlogRequest {
  youtubeUrl: string;
  targetAudience: string;
  desiredTone: string;
}

interface BlogResponse {
  blogContent: string;
  videoTitle: string;
  videoThumbnail: string;
  videoEmbedUrl: string;
  groundingUrls: Array<{ uri?: string; title: string }>;
}

interface ImageRequest {
  prompt: string;
  aspectRatio: string;
}

interface ImageResponse {
  imageUrl: string;
}

interface VideoRequest {
  prompt?: string;
  image?: string;
  resolution?: string;
  aspectRatio?: string;
  lastFrame?: string;
}

interface VideoResponse {
  videoUrl: string;
}

interface EditImageRequest {
  imageBytes: string;
  mimeType: string;
  prompt: string;
}

interface EditImageResponse {
  editedImageUrl: string;
}

interface AnalyzeVideoRequest {
  analysisPrompt: string;
}

interface AnalyzeVideoResponse {
  analysisResult: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  groundingUrls?: Array<{ uri?: string; title: string }>;
}

interface ChatRequest {
  history: ChatMessage[];
  newMessage: string;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface ChatResponse {
  newMessage: ChatMessage;
  fullResponse: string;
}

interface LiveAudioCallbacks {
  onMessageCallback: (message: any) => void;
  onErrorCallback: (error: any) => void;
  onCloseCallback: () => void;
  onOpenCallback: () => Promise<MediaStream>;
  systemInstruction: string;
}

interface SpeechRequest {
  text: string;
}

interface SpeechResponse {
  audioBuffer: AudioBuffer;
}

const getApiKey = () => {
  // First try to get from localStorage (user's custom key)
  const localStorageKey = localStorage.getItem('gemini_api_key');
  if (localStorageKey && localStorageKey.trim()) {
    return localStorageKey.trim();
  }

  // Fallback to environment variable
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined. Please add your API key in the API Key Management section.');
  }
  return apiKey;
};

// Helper to simulate fetching video title and thumbnail
async function fetchYouTubeVideoDetails(
  youtubeUrl: string,
): Promise<YouTubeVideoInfo> {
  const videoId = getYouTubeVideoId(youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Simulate API call to YouTube Data API (not actually implemented, just mock data)
  const mockTitles = [
    'Exploring the Depths of Ocean Life',
    'Beginner\'s Guide to React Hooks',
    'Delicious Vegan Recipes for Every Day',
    'The History of Ancient Civilizations',
    'Mastering Digital Photography Basics',
  ];
  const mockTitle =
    mockTitles[Math.floor(Math.random() * mockTitles.length)] ||
    `Blog Post for Video ID: ${videoId}`;

  return {
    title: mockTitle,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

export const generateBlogPost = async (
  youtubeUrl: string,
  targetAudience: string,
  desiredTone: string,
): Promise<BlogResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-flash'; // Using the appropriate model for text generation

  try {
    const videoDetails = await fetchYouTubeVideoDetails(youtubeUrl);

    // Enhanced prompt to capture tone and nuances more effectively
    let prompt = `Based on a YouTube video with the title "${videoDetails.title}", generate a high-quality, engaging blog post.
    Assume the role of analyzing the video's script and tone. Capture the main ideas, key insights, and subtle nuances present in the video's narrative style.
    The blog post should introduce the topic, provide compelling insights or information derived from the video's content and its presentation, and conclude with a call to action or summary that reflects the video's overall message.
    Make it detailed enough to be insightful but concise for a blog format, ensuring it aligns with the video's original tone.
    The blog should be around 500-700 words.`;

    if (targetAudience.trim()) {
      prompt += ` The target audience for this blog post is: ${targetAudience.trim()}.`;
    }
    if (desiredTone.trim()) {
      prompt += ` The desired tone for this blog post is: ${desiredTone.trim()}.`;
    }


    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }], // Use Google Search grounding for up-to-date info
        temperature: 0.7,
        topK: 64,
        topP: 0.95,
      },
    });

    const blogContent = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = [];

    if (groundingChunks) {
      for (const chunk of groundingChunks) {
        if (chunk.web) {
          groundingUrls.push({ uri: chunk.web.uri, title: chunk.web.title || 'Web Result' });
        }
      }
    }

    if (!blogContent) {
      throw new Error('Gemini API returned an empty response.');
    }

    return {
      blogContent: blogContent,
      videoTitle: videoDetails.title,
      videoThumbnail: videoDetails.thumbnail,
      videoEmbedUrl: videoDetails.embedUrl,
      groundingUrls,
    };
  } catch (error) {
    console.error('Error generating blog post:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid request to Gemini API. Please check your prompt.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Gemini API internal server error. Please try again later.');
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const generateImage = async (
  request: ImageRequest,
): Promise<ImageResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'imagen-4.0-generate-001';

  try {
    const response = await ai.models.generateImages({
      model: model,
      prompt: request.prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: request.aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0 || !response.generatedImages[0] || !response.generatedImages[0].image) {
      throw new Error('Image generation failed: No images generated.');
    }
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
      throw new Error('Image generation failed: No image bytes returned.');
    }

    return {
      imageUrl: `data:image/png;base64,${base64ImageBytes}`,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid request for image generation. Please check your prompt.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Image generation service internal server error. Please try again later.');
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const editImage = async (
  request: EditImageRequest,
): Promise<EditImageResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: request.imageBytes,
              mimeType: request.mimeType,
            },
          },
          {
            text: request.prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const editedImagePart = response.candidates?.[0]?.content?.parts?.[0];
    if (!editedImagePart?.inlineData?.data) {
      throw new Error('Image editing failed: No image data returned.');
    }

    return {
      editedImageUrl: `data:${editedImagePart.inlineData.mimeType};base64,${editedImagePart.inlineData.data}`,
    };
  } catch (error) {
    console.error('Error editing image:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid request for image editing. Please check your prompt or image data.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Image editing service internal server error. Please try again later.');
    throw new Error(`Failed to edit image: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const generateVideo = async (
  request: any,
): Promise<{ videoUrl: string }> => {
  // @ts-ignore - FFmpeg types might not be available
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');

  const ffmpeg = new FFmpeg();

  try {
    // Load FFmpeg with direct URLs
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    // Parse resolution and aspect ratio
    const { width, height, frameRate } = parseResolution(request.resolution || '720p');
    const aspectRatio = request.aspectRatio || '16:9';

    // Create video duration based on content complexity
    const duration = Math.max(10, Math.min(30, estimateVideoDuration(request))); // 10-30 seconds

    // Generate advanced video content
    const videoFilters = await generateVideoFilters(ffmpeg, request, width, height, duration);

    const outputFileName = `output-${Date.now()}.mp4`;

    // Build FFmpeg command with advanced processing
    const ffmpegCommand = [
      '-f', 'lavfi',
      '-i', `color=c=#1a1a1a:s=${width}x${height}:d=${duration}`,
      '-vf', videoFilters,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-r', frameRate.toString(),
      '-movflags', '+faststart',
      '-y',
      outputFileName
    ];

    await ffmpeg.exec(ffmpegCommand);

    // Read the output file
    const data = await ffmpeg.readFile(outputFileName);

    // Create blob URL for the video
    const uint8Data = new Uint8Array(data as any);
    const videoBlob = new Blob([uint8Data], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
      videoUrl,
    };
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : String(error)}`);
  }
};

function parseResolution(resolution: string) {
  const resolutions: Record<string, { width: number; height: number; frameRate: number }> = {
    '720p': { width: 1280, height: 720, frameRate: 30 },
    '1080p': { width: 1920, height: 1080, frameRate: 30 },
    '480p': { width: 854, height: 480, frameRate: 25 },
    '1440p': { width: 2560, height: 1440, frameRate: 24 },
  };

  return resolutions[resolution] || resolutions['720p'];
}

function estimateVideoDuration(request: any): number {
  let duration = 10; // Base duration

  if (request.prompt && request.prompt.length > 50) duration += 5;
  if (request.image) duration += 5;
  if (request.lastFrame) duration += 5;

  return duration;
}

async function generateVideoFilters(ffmpeg: any, request: any, width: number, height: number, duration: number): Promise<string> {
  const filters = [];

  // Background generation
  const backgroundFilter = generateBackgroundFilter(request, width, height, duration);
  filters.push(backgroundFilter);

  // Add content layers
  if (request.image) {
    const imageFilter = await processImageInput(ffmpeg, request.image, width, height, duration);
    filters.push(imageFilter);
  }

  // Add text overlay with advanced typography
  if (request.prompt) {
    const textFilter = generateTextOverlay(request.prompt, width, height, duration);
    filters.push(textFilter);
  }

  // Add animation effects
  const animationFilters = generateAnimationEffects(width, height, duration);
  filters.push(...animationFilters);

  // Add particle effects
  const particleFilter = generateParticleEffects(width, height, duration);
  filters.push(particleFilter);

  // Combine all filters
  return filters.join(', ');
}

function generateBackgroundFilter(request: any, width: number, height: number, duration: number): string {
  // Dynamic background based on content
  const baseColor = request.prompt?.toLowerCase().includes('dark') ? '#000000' :
                   request.prompt?.toLowerCase().includes('bright') ? '#ffffff' :
                   request.prompt?.toLowerCase().includes('blue') ? '#001122' : '#1a1a1a';

  return `color=c=${baseColor}:s=${width}x${height}:d=${duration}`;
}

async function processImageInput(ffmpeg: any, imageData: any, width: number, height: number, duration: number): Promise<string> {
  // Handle image input (base64 data)
  if (imageData.imageBytes && imageData.mimeType) {
    // Create input image file
    const imageFileName = `input-${Date.now()}.png`;
    const imageBlob = new Blob([Buffer.from(imageData.imageBytes, 'base64')], { type: imageData.mimeType });
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageUint8Array = new Uint8Array(imageArrayBuffer);
    await ffmpeg.writeFile(imageFileName, imageUint8Array);

    // Generate image processing filter
    return `movie=${imageFileName}:loop=0,setpts=N/(FRAME_RATE*TB),scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1`;
  }

  return '';
}

function generateTextOverlay(text: string, width: number, height: number, duration: number): string {
  // Advanced text rendering with multiple styles
  const fontSize = Math.max(24, Math.min(80, width / 30));
  const words = text.split(' ');
  const lines = [];

  // Split text into lines to fit screen
  let currentLine = '';
  const maxCharsPerLine = Math.floor(width / (fontSize * 0.6));

  for (const word of words) {
    if ((currentLine + word).length > maxCharsPerLine) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  // Generate text drawtext filters
  const textFilters = lines.map((line, index) => {
    const yPos = height / 2 - ((lines.length - 1) * fontSize) / 2 + index * fontSize * 1.2;
    const startTime = Math.max(0, (duration - 5) * (index / lines.length));
    const endTime = duration;

    return `drawtext=fontsize=${fontSize}:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=${yPos}:text='${line.replace(/'/g, "'\\''")}':enable='between(t,${startTime},${endTime})',` +
           `drawtext=fontsize=${fontSize}:fontcolor=cyan:borderw=1:bordercolor=blue:x=(w-text_w)/2:y=${yPos}:text='${line.replace(/'/g, "'\\''")}':enable='between(t,${startTime},${endTime})'`;
  });

  return textFilters.join(',');
}

function generateAnimationEffects(width: number, height: number, duration: number): string[] {
  const effects = [];

  // Zoom effect
  effects.push(`zoompan=z='min(max(zoom,pzoom)+0.0015,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:x0=0:y0=0:s=${width}x${height}`);

  // Chroma key effects
  effects.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='0.8 + 0.2*sin(2*PI*t/${duration})'`);

  return effects;
}

function generateParticleEffects(width: number, height: number, duration: number): string {
  // Add subtle particle effects
  return `geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='0.9 + 0.1*random(0)'`;
}


export const analyzeVideo = async (
  request: AnalyzeVideoRequest,
  thumbnailBase64: string,
): Promise<AnalyzeVideoResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-pro'; // Use Pro for complex tasks like video understanding

  try {
    const prompt = `Analyze the provided video (represented by this keyframe) based on the following request: ${request.analysisPrompt}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming thumbnail is JPEG
                data: thumbnailBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
              },
            },
          ],
        },
      ],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for 2.5-pro
      },
    });

    const analysisResult = response.text;
    if (!analysisResult) {
      throw new Error('Video analysis failed: No text returned.');
    }

    return { analysisResult };
  } catch (error) {
    console.error('Error analyzing video:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid request for video analysis. Please check your prompt or video data.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Video analysis service internal server error. Please try again later.');
    throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const sendMessageToChatbot = async (
  history: ChatMessage[],
  newMessage: string,
  userLocation?: { latitude: number; longitude: number },
): Promise<ChatResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-flash';

  const contents = history.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  // Fix: Construct tools array correctly for both googleSearch and googleMaps as separate tool entries.
  // Explicitly type `tools` as `any[]` to allow for different tool types to be pushed.
  const tools: any[] = [{ googleSearch: {} }];
  if (userLocation) {
    tools.push({ googleMaps: {} });
  }

  const toolConfig = userLocation
    ? {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      }
    : undefined;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        tools: tools,
        toolConfig: toolConfig,
      },
    });

    const modelResponseText = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = [];

    if (groundingChunks) {
      for (const chunk of groundingChunks) {
        if (chunk.web) {
          groundingUrls.push({ uri: chunk.web.uri, title: chunk.web.title || 'Web Result' });
        } else if (chunk.maps) {
          // Fix: Only extract uri and title directly from chunk.maps.
          // The reviewSnippets are text-only according to SDK types and do not contain uri/title.
          if (chunk.maps.uri && chunk.maps.title) {
            groundingUrls.push({ uri: chunk.maps.uri, title: chunk.maps.title });
          }
        }
      }
    }

    return {
      newMessage: { role: 'model', content: modelResponseText, groundingUrls },
      fullResponse: modelResponseText,
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid chat message or request to Gemini API.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Chatbot service internal server error. Please try again later.');
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const startLiveAudioSession = async (
  onMessageCallback: LiveAudioCallbacks['onMessageCallback'],
  onErrorCallback: LiveAudioCallbacks['onErrorCallback'],
  onCloseCallback: LiveAudioCallbacks['onCloseCallback'],
  onOpenCallback: LiveAudioCallbacks['onOpenCallback'],
  systemInstruction: string,
): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-flash-native-audio-preview-09-2025';

  // Fix: Use Type enum for FunctionDeclaration parameters
  const controlLightFunctionDeclaration = {
    name: 'controlLight',
    parameters: {
      type: Type.OBJECT,
      description: 'Set the brightness and color temperature of a room light.',
      properties: {
        brightness: {
          type: Type.NUMBER,
          description:
            'Light level from 0 to 100. Zero is off and 100 is full brightness.',
        },
        colorTemperature: {
          type: Type.STRING,
          description:
            'Color temperature of the light fixture such as `daylight`, `cool` or `warm`.',
        },
      },
      required: ['brightness', 'colorTemperature'],
    },
  };

  const sessionPromise = ai.live.connect({
    model: model,
    callbacks: {
      onopen: async () => {
        console.debug('Live session opened');
        const stream = await onOpenCallback();
        // Corrected: Use standard AudioContext
        const inputAudioContext = new AudioContext({ sampleRate: 16000 });
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createPcmBlob(inputData);
          sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          });
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: onMessageCallback,
      onerror: onErrorCallback,
      onclose: onCloseCallback,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: systemInstruction,
      inputAudioTranscription: {}, // Enable transcription for user input audio.
      outputAudioTranscription: {}, // Enable transcription for model output audio.
      tools: [{ functionDeclarations: [controlLightFunctionDeclaration] }],
    },
  });

  return sessionPromise;
};


export const generateSpeech = async (
  request: SpeechRequest,
): Promise<SpeechResponse> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const model = 'gemini-2.5-flash-preview-tts';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: request.text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Or 'Puck', 'Charon', 'Fenrir'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('Speech generation failed: No audio data returned.');
    }

    // Corrected: Use standard AudioContext
    const outputAudioContext = new AudioContext({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    return { audioBuffer };
  } catch (error) {
    console.error('Error generating speech:', error);
    if ((error as any)?.status === 400) throw new Error('Invalid request for speech generation. Please check your text input.');
    if ((error as any)?.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if ((error as any)?.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if ((error as any)?.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if ((error as any)?.status >= 500) throw new Error('Speech generation service internal server error. Please try again later.');
    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`);
  }
};
