import React, { useEffect } from 'react';

const Contact = ({ showToast }) => {
  useEffect(() => {
    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'צור קשר',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-8' },
      'נשמח לשמוע מכם! אם יש לכם שאלות, הצעות, או שאתם זקוקים לתמיכה, אל תהססו ליצור איתנו קשר.',
    ),

    React.createElement(
      'div',
      { className: 'w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl text-left' },
      React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-2' },
          'דוא"ל',
        ),
        React.createElement(
          'p',
          { className: 'text-gray-300' },
          'לשאלות כלליות ותמיכה, שלחו לנו מייל לכתובת:',
          ' ',
          React.createElement(
            'a',
            { href: 'mailto:yaskovbs2502@gmail.com', className: 'text-blue-400 hover:underline' },
            'yaskovbs2502@gmail.com',
          ),
        ),
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          { className: 'text-xl font-bold text-blue-300 mb-2' },
          'טלפון',
        ),
        React.createElement(
          'p',
          { className: 'text-gray-300' },
          'ניתן ליצור איתנו קשר גם בטלפון:',
          ' ',
          React.createElement(
            'a',
            { href: 'tel:+972508181948', className: 'text-blue-400 hover:underline' },
            '050-818-1948',
          ),
        ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_CONTACT_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),

    React.createElement(
      'p',
      { className: 'text-md text-gray-400 mt-8' },
      'אנו משתדלים להשיב לכל הפניות בהקדם האפשרי.',
    ),
  );
};

export default Contact;
