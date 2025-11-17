import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Toast visible for 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return isVisible ? React.createElement(
    'div',
    { className: `fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300` },
    message
  ) : null;
};

export default Toast;
