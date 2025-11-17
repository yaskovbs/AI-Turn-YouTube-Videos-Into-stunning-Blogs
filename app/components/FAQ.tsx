import React, { useEffect } from 'react';

const FAQ = ({ showToast }) => {
  useEffect(() => {
    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  const faqs = [
    {
      question: 'איך עובד מחולל הבלוגים מיוטיוב?',
      answer:
        'אתם מזינים קישור לסרטון יוטיוב, וה-AI שלנו מנתח את תוכן הסרטון (כותרת, תיאור ובאמצעות חיפוש מידע רלוונטי ב-Google) כדי ליצור מאמר בלוג מקיף ומרתק תוך שניות.',
    },
    {
      question: 'האם אני יכול לערוך את התמונות והסרטונים שנוצרו?',
      answer:
        'כן, מחולל התמונות והוידאו מאפשר לכם ליצור תוכן חדש לחלוטין. בנוסף, יש לנו עורך תמונות AI שמאפשר לכם לשנות ולשפר תמונות קיימות באמצעות פרומפטים טקסטואליים.',
    },
    {
      question: 'האם השיחות עם העוזר הקולי מתועדות?',
      answer:
        'העוזר הקולי שלנו מספק תמלול בזמן אמת של השיחות, כך שתוכלו לעקוב אחר מה שנאמר. היסטוריית התמלול מוצגת בממשק האפליקציה.',
    },
    {
      question: 'האם המידע ב-AI Studio עדכני?',
      answer:
        'כן, עבור משימות מסוימות, כמו יצירת בלוגים וצ’אט בוט, אנו משלבים את כלי Google Search Grounding ו-Google Maps Grounding. זה מאפשר ל-AI גישה למידע עדכני ואמין מהאינטרנט ופרטי מיקום רלוונטיים.',
    },
    {
      question: 'האם יש אפשרות לשלב API Key פרטי שלי?',
      answer:
        'כן, עבור תכונות מסוימות כמו יצירת וידאו ב-Veo, תוכלו לבחור להשתמש במפתח API משלכם. אנו מספקים הנחיות מפורטות בדף "מפתח API" כיצד לעשות זאת בצורה מאובטחת (מומלץ באמצעות בק-אנד).',
    },
  ];

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'שאלות נפוצות',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-8' },
      'מצאו תשובות לשאלות נפוצות בנוגע לשימוש ב-AI Studio.',
    ),

    React.createElement(
      'div',
      { className: 'w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl text-left' },
      faqs.map((faq, index) =>
        React.createElement(
          'div',
          { key: index, className: 'mb-6' },
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-blue-300 mb-2' },
            faq.question,
          ),
          React.createElement(
            'p',
            { className: 'text-gray-300' },
            faq.answer,
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
        'data-ad-slot': 'YOUR_AD_SLOT_ID_FAQ_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),

    React.createElement(
      'p',
      { className: 'text-md text-gray-400 mt-8' },
      'יש לכם שאלות נוספות? צרו איתנו קשר דרך עמוד "צור קשר".',
    ),
  );
};

export default FAQ;
