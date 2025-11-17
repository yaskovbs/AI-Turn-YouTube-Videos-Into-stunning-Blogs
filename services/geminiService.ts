import { GoogleGenAI, Modality, Type } from '@google/genai';
import { getYouTubeVideoId } from '../utils/youtube';
import { decode, decodeAudioData, createPcmBlob } from '../utils/file';

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
  youtubeUrl,
) {
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
  youtubeUrl,
  targetAudience, // New parameter
  desiredTone,    // New parameter
) => {
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
    if (error.status === 400) throw new Error('Invalid request to Gemini API. Please check your prompt.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Gemini API internal server error. Please try again later.');
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const generateImage = async (
  request,
) => {
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

    const base64ImageBytes = response.generatedImages[0]?.image.imageBytes;
    if (!base64ImageBytes) {
      throw new Error('Image generation failed: No image bytes returned.');
    }

    return {
      imageUrl: `data:image/png;base64,${base64ImageBytes}`,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    if (error.status === 400) throw new Error('Invalid request for image generation. Please check your prompt.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Image generation service internal server error. Please try again later.');
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const editImage = async (
  request,
) => {
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
    if (error.status === 400) throw new Error('Invalid request for image editing. Please check your prompt or image data.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Image editing service internal server error. Please try again later.');
    throw new Error(`Failed to edit image: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const generateVideo = async (
  request,
) => {
  let ai = new GoogleGenAI({ apiKey: getApiKey() }); // Re-initialize for up-to-date API key
  const model = 'veo-3.1-fast-generate-preview';

  // Fix: Directly access window.aistudio without explicit casting, relying on global.d.ts type declaration.
  if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
    await window.aistudio.openSelectKey();
    ai = new GoogleGenAI({ apiKey: getApiKey() }); // Re-initialize after selection
  }

  try {
    let operation = await ai.models.generateVideos({
      model: model,
      prompt: request.prompt,
      image: request.image,
      config: {
        numberOfVideos: 1,
        resolution: request.resolution,
        aspectRatio: request.aspectRatio,
        lastFrame: request.lastFrame, // lastFrame should be inside config
      },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Poll every 10 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error('Video generation failed: No video URI returned.');
    }

    return {
      videoUrl: `${downloadLink}&key=${getApiKey()}`, // Append API key for direct download
    };
  } catch (error) {
    console.error('Error generating video:', error);
    // Fix: Directly access window.aistudio without explicit casting, relying on global.d.ts type declaration.
    if (error instanceof Error && error.message.includes('Requested entity was not found.') && window.aistudio) {
      await window.aistudio.openSelectKey(); // Prompt for key if not found
      throw new Error('API key not found or invalid. Please select your API key again.');
    }
    if (error.status === 400) throw new Error('Invalid request for video generation. Please check your prompt, images, or config.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Video generation service internal server error. Please try again later.');
    throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const analyzeVideo = async (
  request,
  thumbnailBase64,
) => {
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
    if (error.status === 400) throw new Error('Invalid request for video analysis. Please check your prompt or video data.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Video analysis service internal server error. Please try again later.');
    throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const sendMessageToChatbot = async (
  history,
  newMessage,
  userLocation,
) => {
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

    const modelResponseText = response.text;
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
    if (error.status === 400) throw new Error('Invalid chat message or request to Gemini API.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Chatbot service internal server error. Please try again later.');
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const startLiveAudioSession = async (
  onMessageCallback,
  onErrorCallback,
  onCloseCallback,
  onOpenCallback,
  systemInstruction,
) => {
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
  request,
) => {
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
    if (error.status === 400) throw new Error('Invalid request for speech generation. Please check your text input.');
    if (error.status === 401) throw new Error('Unauthorized: Invalid API key. Please check your API key.');
    if (error.status === 403) throw new Error('Forbidden: API key lacks necessary permissions or access. Check billing.');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again after some time.');
    if (error.status >= 500) throw new Error('Speech generation service internal server error. Please try again later.');
    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`);
  }
};
