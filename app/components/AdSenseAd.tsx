import React, { useEffect, useRef } from 'react';

interface AdSenseAdProps {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Initialize AdSense
const initializeAdSense = () => {
  try {
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle.push({});
    }
  } catch (err) {
    console.error('AdSense error:', err);
  }
};

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  slot,
  format = 'auto',
  style = {},
  className = '',
  responsive = true
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Check if AdSense script is loaded
    const checkAdSenseLoaded = () => {
      if (window.adsbygoogle) {
        initializeAdSense();
      } else {
        // Retry after a short delay
        setTimeout(checkAdSenseLoaded, 100);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkAdSenseLoaded, 100);
  }, []);

  if (!slot) {
    return null;
  }

  const adStyle = responsive ? {
    display: 'block',
    ...style
  } : {
    display: 'inline-block',
    width: '300px',
    height: '250px',
    ...style
  };

  return (
    <div className={`adsense-ad ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={localStorage.getItem('adsense_client_id') || ''}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Predefined ad components for common formats
export const HeaderBannerAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const headerSlot = localStorage.getItem('adsense_slots')
    ? JSON.parse(localStorage.getItem('adsense_slots') || '{}').header_banner
    : '';

  return headerSlot ? (
    <AdSenseAd
      slot={headerSlot}
      format="horizontal"
      style={{ width: '728px', height: '90px' }}
      className={`mx-auto ${className}`}
      responsive={false}
    />
  ) : null;
};

export const SidebarSquareAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const sidebarSlot = localStorage.getItem('adsense_slots')
    ? JSON.parse(localStorage.getItem('adsense_slots') || '{}').sidebar_square
    : '';

  return sidebarSlot ? (
    <AdSenseAd
      slot={sidebarSlot}
      format="rectangle"
      style={{ width: '300px', height: '250px' }}
      className={className}
      responsive={false}
    />
  ) : null;
};

export const ContentBannerAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const contentSlot = localStorage.getItem('adsense_slots')
    ? JSON.parse(localStorage.getItem('adsense_slots') || '{}').content_banner
    : '';

  return contentSlot ? (
    <AdSenseAd
      slot={contentSlot}
      format="horizontal"
      style={{ width: '468px', height: '60px' }}
      className={`mx-auto my-4 ${className}`}
      responsive={false}
    />
  ) : null;
};

export const MobileBannerAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mobileSlot = localStorage.getItem('adsense_slots')
    ? JSON.parse(localStorage.getItem('adsense_slots') || '{}').mobile_banner
    : '';

  return mobileSlot ? (
    <AdSenseAd
      slot={mobileSlot}
      format="horizontal"
      style={{ width: '320px', height: '50px' }}
      className={`mx-auto ${className}`}
      responsive={false}
    />
  ) : null;
};

export const AutoAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  const autoSlot = localStorage.getItem('adsense_slots')
    ? JSON.parse(localStorage.getItem('adsense_slots') || '{}').auto
    : '';

  return autoSlot ? (
    <AdSenseAd
      slot={autoSlot}
      format="auto"
      style={{ width: '100%', minHeight: '50px' }}
      className={className}
      responsive={true}
    />
  ) : null;
};

export default AdSenseAd;
