import React, { useEffect } from 'react';

const Terms = ({ showToast }) => {
  useEffect(() => {
    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'תנאי שימוש',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-8' },
      'ברוכים הבאים ל-AI Studio. השימוש בשירותים שלנו כפוף לתנאי השימוש הבאים. אנא קראו אותם בעיון.',
    ),

    React.createElement(
      'div',
      { className: 'w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl text-left prose prose-invert' },
      React.createElement(
        'h3',
        null,
        '1. קבלת התנאים',
      ),
      React.createElement(
        'p',
        null,
        'על ידי גישה או שימוש בשירותים שלנו, אתם מסכימים להיות כפופים לתנאי שימוש אלה ולכל המדיניות וההנחיות המשולבות בהם על ידי הפניה. אם אינכם מסכימים לכל התנאים, אינכם רשאים להשתמש בשירותים.',
      ),

      React.createElement(
        'h3',
        null,
        '2. שינויים בתנאים',
      ),
      React.createElement(
        'p',
        null,
        'אנו שומרים לעצמנו את הזכות, לפי שיקול דעתנו הבלעדי, לשנות או להחליף תנאים אלה בכל עת. אם השינוי מהותי, אנו נעשה מאמצים סבירים לספק הודעה של 30 יום לפני כניסת תנאים חדשים לתוקף. מה מהווה שינוי מהותי ייקבע לפי שיקול דעתנו הבלעדי.',
      ),

      React.createElement(
        'h3',
        null,
        '3. שימוש בשירותים',
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'זכאות:'),
          ' אתם רשאים להשתמש בשירותים רק אם אתם יכולים לכרות חוזה מחייב עם AI Studio ורק בהתאם לתנאים אלה ולכל החוקים, הכללים והתקנות המקומיים, המדינתיים, הלאומיים והבינלאומיים הרלוונטיים.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'התנהגות אסורה:'),
          ' אינכם רשאים להשתמש בשירותים לכל מטרה בלתי חוקית או בלתי מורשית. אתם מסכימים לציית לכל החוקים, הכללים והתקנות החלים על השימוש שלכם בשירותים.',
        ),
      ),

      React.createElement(
        'h3',
        null,
        '4. קניין רוחני',
      ),
      React.createElement(
        'p',
        null,
        'השירותים והתוכן המקורי שלהם (למעט תוכן המסופק על ידי משתמשים), התכונות והפונקציונליות הם ויישארו רכוש בלעדי של AI Studio והמורשים שלה. השירותים מוגנים על ידי זכויות יוצרים, סימני מסחר וחוקים אחרים של ישראל ומדינות זרות. סימני המסחר והלבוש המסחריים שלנו אסורים לשימוש בקשר לכל מוצר או שירות ללא הסכמה מוקדמת ובכתב של AI Studio.',
      ),

      React.createElement(
        'h3',
        null,
        '5. סיום',
      ),
      React.createElement(
        'p',
        null,
        'אנו עשויים לסיים או להשעות את הגישה שלכם לשירותים שלנו באופן מיידי, ללא הודעה מוקדמת או אחריות, מכל סיבה שהיא, לרבות, ללא הגבלה, אם תפרו את התנאים. כל הוראות התנאים אשר מטבען אמורות לשרוד סיום ישרדו סיום, לרבות, ללא הגבלה, הוראות בעלות, ויתור על אחריות, שיפוי והגבלות אחריות.',
      ),

      React.createElement(
        'p',
        { className: 'mt-8 text-sm text-gray-500 text-center' },
        'עודכן לאחרונה: ',
        new Date().toLocaleDateString('he-IL'),
      ),
    ),

    React.createElement(
      'div',
      { className: 'adsbygoogle my-8 text-center', style: { minHeight: '100px' } },
      React.createElement('ins', {
        className: 'adsbygoogle',
        style: { display: 'block' },
        'data-ad-client': 'ca-pub-9953179201685717',
        'data-ad-slot': 'YOUR_AD_SLOT_ID_TERMS_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default Terms;
