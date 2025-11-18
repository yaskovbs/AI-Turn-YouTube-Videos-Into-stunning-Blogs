import React, { useState, useEffect } from 'react';
import { AD_ICON } from '../constants';

interface AdSenseManagerProps {
  showToast: (message: string, type?: string) => void;
}

const AdSenseManager: React.FC<AdSenseManagerProps> = ({ showToast }) => {
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [adSlots, setAdSlots] = useState<{
    [key: string]: string;
  }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedClientId = localStorage.getItem('adsense_client_id') || '';
    const savedAdSlots = JSON.parse(localStorage.getItem('adsense_slots') || '{}');

    setAdsenseClientId(savedClientId);
    setAdSlots(savedAdSlots);
  }, []);

  // Save settings to localStorage when they change
  const saveSettings = () => {
    localStorage.setItem('adsense_client_id', adsenseClientId);
    localStorage.setItem('adsense_slots', JSON.stringify(adSlots));
    showToast('AdSense settings saved successfully!', 'success');
  };

  const addAdSlot = () => {
    const slotName = `slot_${Date.now()}`;
    setAdSlots(prev => ({
      ...prev,
      [slotName]: ''
    }));
  };

  const removeAdSlot = (slotName: string) => {
    setAdSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[slotName];
      return newSlots;
    });
  };

  const updateAdSlot = (slotName: string, slotId: string) => {
    setAdSlots(prev => ({
      ...prev,
      [slotName]: slotId
    }));
  };

  // Load AdSense script when client ID is set
  useEffect(() => {
    if (adsenseClientId && !isLoaded) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      setIsLoaded(true);
      showToast('AdSense script loaded!', 'success');
    }
  }, [adsenseClientId, isLoaded, showToast]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-green-600 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-xl">{AD_ICON}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AdSense Manager</h2>
          <p className="text-gray-400">Configure Google AdSense for your blogs</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Client ID Configuration */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">AdSense Client Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Publisher ID (ca-pub-xxxxxxxxxxxxxxxx)
              </label>
              <input
                type="text"
                value={adsenseClientId}
                onChange={(e) => setAdsenseClientId(e.target.value)}
                placeholder="ca-pub-1234567890123456"
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Your AdSense publisher ID from your AdSense account
              </p>
            </div>
          </div>
        </div>

        {/* Ad Slots Configuration */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">Ad Slots</h3>
            <button
              onClick={addAdSlot}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Add Ad Slot
            </button>
          </div>

          {Object.keys(adSlots).length === 0 ? (
            <p className="text-gray-400 text-center py-4">No ad slots configured yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(adSlots).map(([slotName, slotId]) => (
                <div key={slotName} className="flex items-center gap-3 bg-gray-600 p-3 rounded-md">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Slot Name: {slotName}
                    </label>
                    <input
                      type="text"
                      value={slotId}
                      onChange={(e) => updateAdSlot(slotName, e.target.value)}
                      placeholder="1234567890"
                      className="w-full px-3 py-2 bg-gray-500 border border-gray-400 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={() => removeAdSlot(slotName)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Examples */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Configuration Examples</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white">Common Ad Formats:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>header_banner:</strong> 728x90 - Leaderboard</li>
                <li><strong>sidebar_square:</strong> 300x250 - Medium Rectangle</li>
                <li><strong>content_banner:</strong> 468x60 - Banner</li>
                <li><strong>mobile_banner:</strong> 320x50 - Mobile Banner</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Save AdSense Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdSenseManager;
