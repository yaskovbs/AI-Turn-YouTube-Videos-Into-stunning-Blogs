import React from 'react';


const YouTubeEmbed = ({ videoId }) => {
  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return React.createElement(
    'div',
    { className: 'relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-xl mt-8' },
    React.createElement('iframe', {
      className: 'absolute top-0 left-0 w-full h-full',
      src: embedUrl,
      frameBorder: '0',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      allowFullScreen: true,
      title: 'Embedded YouTube Video',
    }),
  );
};

export default YouTubeEmbed;
