import React from 'react';

const Sidebar = ({ isOpen, onClose, children }) => {
  return React.createElement(
    'div',
    {
      className: `fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-20`,
    },
    React.createElement(
      'div',
      { className: 'p-4' },
      React.createElement(
        'button',
        {
          onClick: onClose,
          className: 'absolute top-4 right-4 p-2 rounded-full hover:bg-gray-700',
        },
        'X'
      ),
      children
    )
  );
};

export default Sidebar;
