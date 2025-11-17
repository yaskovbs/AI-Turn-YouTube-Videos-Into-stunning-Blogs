import { generateBlogPost } from './services/geminiService';
import { getYouTubeVideoId } from './utils/youtube';

export const createHandlers = (
  setYoutubeUrl: (value: string) => void,
  setTargetAudience: (value: string) => void,
  setDesiredTone: (value: string) => void,
  setBlogGenerationResponse: (value: any) => void,
  setIsLoading: (value: boolean) => void,
  setError: (value: string | null) => void,
  setToast: (value: any) => void,
  isLoggedIn: boolean,
  youtubeUrl: string,
  targetAudience: string,
  desiredTone: string,
  blogGenerationResponse: any,
  showToast: (message: string, type?: string) => void
) => {
  const handleGenerateBlog = async (e: any) => {
    e.preventDefault();
    setError(null);
    setBlogGenerationResponse(null);

    if (!isLoggedIn) {
      setError('Please log in to use the generator.');
      showToast('Please log in to use the generator.', 'error');
      return;
    }

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube video URL.');
      showToast('Please enter a YouTube video URL.', 'error');
      return;
    }

    if (!getYouTubeVideoId(youtubeUrl)) {
      setError('Please enter a valid YouTube video URL.');
      showToast('Please enter a valid YouTube video URL.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateBlogPost(youtubeUrl, targetAudience, desiredTone);
      setBlogGenerationResponse(response);
      showToast('Blog post generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to generate blog post: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBlog = () => {
    if (blogGenerationResponse?.blogContent) {
      const filename =
        (blogGenerationResponse.videoTitle || 'generated_blog_post')
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase() + '.txt';
      const element = document.createElement('a');
      const file = new Blob([blogGenerationResponse.blogContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast('Download started!', 'success');
    }
  };

  const handleDownloadPdf = () => {
    if (blogGenerationResponse?.blogContent) {
      const filename =
        (blogGenerationResponse.videoTitle || 'generated_blog_post')
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase() + '.pdf';
      const content = document.getElementById('blog-content-to-pdf');
      if (content) {
        import('./utils/file').then(({ generatePdfFromHtml }) => {
          generatePdfFromHtml(content, filename);
          showToast('PDF download started!', 'success');
        });
      } else {
        alert('Blog content not found for PDF generation.');
        showToast('Blog content not found for PDF generation.', 'error');
      }
    }
  };

  const handleCopyBlog = async () => {
    if (blogGenerationResponse?.blogContent) {
      try {
        await navigator.clipboard.writeText(blogGenerationResponse.blogContent);
        showToast('Blog content copied to clipboard!', 'success');
      } catch (err) {
        console.error('Failed to copy blog content:', err);
        showToast('Failed to copy blog content.', 'error');
      }
    }
  };

  const handleShareBlog = async () => {
    if (blogGenerationResponse?.blogContent && navigator.share) {
      try {
        await navigator.share({
          title: blogGenerationResponse.videoTitle || 'Generated Blog Post',
          text: blogGenerationResponse.blogContent,
          url: blogGenerationResponse.videoEmbedUrl || window.location.href,
        });
      } catch (err) {
        console.error('Failed to share blog content:', err);
        showToast('Failed to share blog content.', 'error');
      }
    } else {
      showToast('Web Share API is not supported in this browser.', 'error');
    }
  };

  return {
    handleGenerateBlog,
    handleDownloadBlog,
    handleDownloadPdf,
    handleCopyBlog,
    handleShareBlog,
  };
};

export const createShowToast = (setToast: (value: any) => void) => {
  const showToast = (message: string, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };
  const handleCloseToast = () => setToast(null);
  return { showToast, handleCloseToast };
};
