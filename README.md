# Cap Abdelnaseer | المنصة التعليمية

إعادة بناء كاملة من الصفر مع الحفاظ على بيانات Firebase القديمة. لا يستخدم Firebase Authentication؛ دخول الطلاب يعمل برقم الهاتف + PIN عبر API Server-side، مع توافق `pin` و`password` و`pinHash`.

## الصفحات
- index.html
- login.html / register.html
- dashboard.html / files.html / videos.html / quiz.html
- results.html / notifications.html / profile.html / support.html
- admin-login.html / admin.html

## Backend
Vercel Serverless API داخل `/api` ويستخدم Firebase Admin SDK من الخادم فقط. هذا يمنع وضع Service Account أو Telegram token في Frontend.

### متغيرات البيئة المطلوبة
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `SESSION_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Firebase
Database URL: `https://abodaa-default-rtdb.firebaseio.com`
المشروع: `abodaa`

`firebase-rules.json` يضع القاعدة الافتراضية المغلقة. طبّق Rules مناسبة لبيئتك بعد نشر الـ API؛ لا تفتح `/students` للعموم.

## حسابات الإدارة المبدئية
> كلمات المرور المبدئية موجودة فقط في ملف تسليم آمن منفصل عند الحاجة؛ لا يتم عرضها داخل الواجهة أو إرسالها إلى Telegram.

الحساب الأول: `owner@capabdelnaseer.local` — صلاحيات كاملة.
الحساب الثاني: `content@capabdelnaseer.local` — إدارة المحتوى، بدون إجراءات المدير الرئيسي.

## شرط قناة WhatsApp
واجهة الدخول والتسجيل تطلب فتح قناة WhatsApp ثم تأكيد الانضمام. التحقق الآلي من عضوية WhatsApp Channel غير متاح عبر Firebase وحده، لذلك التأكيد في النسخة الحالية UX gate وليس إثباتًا تقنيًا من WhatsApp.

## الصورة
ضع الصورة الأصلية باسم `1783950091830.jpg` بجوار ملفات HTML أو في الجذر حسب مسار النشر. لم تكن الصورة الأصلية مرفقة في حزمة المصادر الحالية، لذلك لم يتم استبدالها بصورة أخرى.

## تشغيل محلي
1. `npm install`
2. انسخ `.env.example` إلى `.env.local` وأكمل القيم.
3. `npx vercel dev`

## ملاحظة
الـ PIN القديم plaintext مدعوم للتوافق، لكن يفضل لاحقًا ترحيله إلى `pinHash` بدون حذف الحسابات القديمة.
