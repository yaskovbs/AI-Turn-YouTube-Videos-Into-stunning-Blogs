import React, { useEffect } from 'react';

const Privacy = ({ showToast }) => {
  useEffect(() => {
    // Push AdSense ads when component mounts - removed explicit push
  }, []);

  return React.createElement(
    'div',
    { className: 'flex flex-col items-center p-4 w-full max-w-4xl mx-auto text-center' },
    React.createElement(
      'h2',
      { className: 'text-3xl font-bold text-blue-400 mb-6' },
      'מדיניות פרטיות',
    ),
    React.createElement(
      'p',
      { className: 'text-lg text-gray-300 mb-8' },
      'מדיניות פרטיות זו מתארת כיצד AI Studio אוסף, משתמש וחושף את המידע האישי שלכם בעת השימוש בשירותים שלנו.',
    ),

    React.createElement(
      'div',
      { className: 'w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl text-left prose prose-invert' },
      React.createElement(
        'h3',
        null,
        '1. איסוף מידע',
      ),
      React.createElement(
        'p',
        null,
        'אנו אוספים מספר סוגי מידע למטרות שונות כדי לספק ולשפר את השירות שלנו אליכם.',
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'נתוני שימוש:'),
          ' אנו עשויים גם לאסוף מידע על אופן הגישה והשימוש בשירות ("נתוני שימוש"). נתוני שימוש אלה עשויים לכלול מידע כגון כתובת פרוטוקול האינטרנט של המחשב שלכם (למשל, כתובת IP), סוג הדפדפן, גרסת הדפדפן, דפי השירות שלנו שבהם אתם מבקרים, השעה והתאריך של ביקורכם, משך הזמן שהייתם בדפים אלה, מזהי מכשיר ייחודיים ונתונים אבחוניים אחרים.',
        ),
        React.createElement(
          'li',
          null,
          React.createElement('strong', null, 'מידע אישי:'),
          ' בעת השימוש בשירותים מסוימים, אנו עשויים לבקש מכם לספק לנו מידע המאפשר זיהוי אישי מסוים שניתן להשתמש בו כדי ליצור איתכם קשר או לזהות אתכם ("נתונים אישיים"). מידע המאפשר זיהוי אישי עשוי לכלול, אך אינו מוגבל ל: כתובת דוא"ל, שם פרטי ושם משפחה.',
        ),
      ),

      React.createElement(
        'h3',
        null,
        '2. שימוש במידע',
      ),
      React.createElement(
        'p',
        null,
        'AI Studio משתמש בנתונים שנאספו למטרות שונות:',
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'כדי לספק ולתחזק את השירות שלנו.',
        ),
        React.createElement(
          'li',
          null,
          'כדי להודיע לכם על שינויים בשירות שלנו.',
        ),
        React.createElement(
          'li',
          null,
          'כדי לאפשר לכם להשתתף בתכונות אינטראקטיביות של השירות שלנו כאשר אתם בוחרים לעשות זאת.',
        ),
        React.createElement(
          'li',
          null,
          'כדי לספק תמיכת לקוחות.',
        ),
        React.createElement(
          'li',
          null,
          'כדי לספק ניתוח או מידע רב ערך כדי שנוכל לשפר את השירות.',
        ),
        React.createElement(
          'li',
          null,
          'כדי לפקח על השימוש בשירות.',
        ),
        React.createElement(
          'li',
          null,
          'כדי לזהות, למנוע ולטפל בבעיות טכניות.',
        ),
      ),

      React.createElement(
        'h3',
        null,
        '3. גילוי מידע לצד שלישי',
      ),
      React.createElement(
        'p',
        null,
        'איננו מוכרים, סוחרים או מעבירים בדרך אחרת לצדדים חיצוניים את המידע המאפשר זיהוי אישי שלכם. זה אינו כולל צדדים שלישיים מהימנים המסייעים לנו בהפעלת אתר האינטרנט שלנו, בניהול העסק שלנו או במתן שירות לכם, כל עוד צדדים אלה מסכימים לשמור על מידע זה בסודיות. אנו עשויים גם לשחרר את המידע שלכם כאשר אנו מאמינים שהשחרור מתאים לצורך ציות לחוק, אכיפת מדיניות האתר שלנו, או הגנה על זכויותינו או על זכויות אחרים, רכושם או בטיחותם.',
      ),

      React.createElement(
        'h3',
        null,
        '4. אבטחת מידע',
      ),
      React.createElement(
        'p',
        null,
        'אבטחת המידע שלכם חשובה לנו, אך זכרו ששום שיטת שידור באינטרנט, או שיטת אחסון אלקטרונית אינה מאובטחת ב-100%. בעוד אנו שואפים להשתמש באמצעים מקובלים מסחרית להגנת המידע האישי שלכם, איננו יכולים להבטיח את אבטחתו המוחלטת.',
      ),

      React.createElement(
        'h3',
        null,
        '5. שירותים של צד שלישי (AdSense)',
      ),
      React.createElement(
        'p',
        null,
        'אנו עשויים להשתמש בשירותי פרסום של צד שלישי כמו Google AdSense כדי להציג מודעות באתר שלנו. שירותים אלה עשויים להשתמש בקובצי Cookie כדי להציג מודעות בהתבסס על הביקורים הקודמים שלכם באתר זה ובאתרים אחרים. השימוש של Google בקובץ ה-Cookie של DART מאפשר לו ולהשותפים שלו להציג מודעות למשתמשים שלנו בהתבסס על הביקור שלהם באתרים שלכם ו/או באתרים אחרים באינטרנט. משתמשים יכולים לבטל את השימוש בקובץ ה-Cookie של DART על ידי ביקור במדיניות הפרטיות של רשת המודעות והתוכן של Google.',
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
        'data-ad-slot': 'YOUR_AD_SLOT_ID_PRIVACY_1',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }),
    ),
  );
};

export default Privacy;
