// Ensure html2pdf.js is loaded, e.g., via script tag in index.html
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1]; // Remove data:mime/type;base64, prefix
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1]; // Remove data:mime/type;base64, prefix
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const decode = (base64) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encode = (bytes) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data,
  ctx,
  sampleRate,
  numChannels,
) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


// Function to extract a thumbnail from a video file
export const getVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      video.currentTime = 1; // Seek to 1 second

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(video.src);
          resolve(canvas.toDataURL('image/jpeg')); // Resolve with base64 data URL
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(video.src);
      reject(new Error(`Failed to load video: ${e}`));
    };
  });
};


// Simple markdown to HTML conversion (for headings, bold, lists, code blocks)
export const formatMarkdownToHtml = (markdown) => {
  let html = markdown;

  // Code blocks first to prevent inner markdown from being processed
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const languageClass = lang ? `language-${lang}` : '';
    return `<pre><code class="${languageClass}">${code}</code></pre>`;
  });
  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Ordered lists - process before paragraphs
  html = html.replace(/^\s*(\d+)\. (.*)$/gm, '<li>$2</li>');
  const olListRegex = /(<li>.*?<\/li>(?:\n<li>.*?<\/li>)*)/g;
  html = html.replace(olListRegex, '<ol class="list-decimal list-inside pl-5">$1</ol>');

  // Unordered lists - process before paragraphs
  html = html.replace(/^\s*[-*+] (.*)$/gm, '<li>$1</li>');
  const ulListRegex = /(<li>.*?<\/li>(?:\n<li>.*?<\/li>)*)/g;
  html = html.replace(ulListRegex, '<ul class="list-disc list-inside pl-5">$1</ul>');

  // Paragraphs (wrap lines that are not already within block-level tags or empty)
  html = html.split('\n').map(line => {
    // Check if line contains any block-level HTML tags or is empty
    const isBlockOrEmpty = line.trim() === '' || line.match(/<h[1-6]>|<ul|<ol|<li|<p>|<div|<img|<video|<audio|<pre|<code/i);
    return isBlockOrEmpty ? line : `<p>${line}</p>`;
  }).join('\n');

  // Clean up multiple empty paragraphs or paragraphs around block elements
  html = html.replace(/<\/p>\s*<p>/g, '\n'); // Reduce consecutive <p> tags
  html = html.replace(/<p><(h[1-6]|ul|ol|div|img|video|audio|pre|code)/gi, '<$1'); // Remove <p> before block tags
  html = html.replace(/(h[1-6]|ul|ol|div|img|video|audio|pre|code)><\/p>/gi, '$1>'); // Remove <p> after block tags
  html = html.replace(/<p>\s*<\/p>/g, ''); // Remove any remaining empty paragraphs

  return html;
};

// Function to generate PDF from HTML content
export const generatePdfFromHtml = async (element, filename) => {
  // Fix: Access html2pdf directly from window as it's a globally loaded script
  // The global.d.ts file now correctly declares window.html2pdf.
  const html2pdf = window.html2pdf;
  if (!html2pdf) {
    alert('PDF generation library not loaded. Please ensure html2pdf.js is included.');
    console.error('html2pdf.js is not loaded.');
    return;
  }

  const options = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  try {
    // Fix: Cast window.html2pdf to its expected function type
    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Failed to generate PDF: ${error.message || error}`);
  }
};
