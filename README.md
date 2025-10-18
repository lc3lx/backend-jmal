# Backend - موقع بيع حسابات البث

Backend API مبني على Node.js و Express.js لموقع بيع حسابات خدمات البث المباشر.

## 🏗️ البنية

```
backend/
├── config/           # إعدادات قاعدة البيانات
├── middlewares/      # Middleware functions
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── uploads/         # الملفات المرفوعة
└── server.js        # نقطة البداية
```

## 📦 Models

### Product Model

```javascript
{
  title: String,           // اسم الباقة
  slug: String,
  description: String,     // وصف الباقة (جديد)
  duration: String,        // مدة الاشتراك (جديد)
  sold: Number,
  price: Number,
  stock: Number,           // عدد الحسابات المتوفرة (جديد)
  imageCover: String,
  category: ObjectId,
  timestamps: true
}
```

### Order Model

```javascript
{
  user: ObjectId,
  product: ObjectId,           // منتج واحد فقط (تم التبسيط)
  price: Number,
  totalOrderPrice: Number,
  paymentMethodType: String,   // cash or card
  isPaid: Boolean,
  paidAt: Date,
  accountEmail: String,        // بريد الحساب (جديد)
  accountPassword: String,     // كلمة المرور (جديد)
  accountDetails: String,      // تفاصيل إضافية (جديد)
  isDelivered: Boolean,
  deliveredAt: Date,
  timestamps: true
}
```

### Category Model

```javascript
{
  name: String,
  slug: String,
  image: String,
  timestamps: true
}
```

### User Model

```javascript
{
  name: String,
  slug: String,
  email: String,
  phone: String,
  profileImg: String,
  password: String,
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  role: String, // user, manager, admin
  active: Boolean,
  timestamps: true
}
```

### Coupon Model

```javascript
{
  name: String,
  expire: Date,
  discount: Number,
  timestamps: true
}
```

## 🚀 API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - تسجيل مستخدم جديد
- `POST /api/v1/auth/login` - تسجيل الدخول
- `POST /api/v1/auth/forgotPassword` - نسيت كلمة المرور
- `POST /api/v1/auth/verifyResetCode` - التحقق من كود إعادة التعيين
- `PUT /api/v1/auth/resetPassword` - إعادة تعيين كلمة المرور

### Products

- `GET /api/v1/products` - الحصول على جميع المنتجات
- `GET /api/v1/products/:id` - الحصول على منتج محدد
- `POST /api/v1/products` - إضافة منتج جديد (Admin)
- `PUT /api/v1/products/:id` - تعديل منتج (Admin)
- `DELETE /api/v1/products/:id` - حذف منتج (Admin)

### Categories

- `GET /api/v1/categories` - الحصول على جميع التصنيفات
- `GET /api/v1/categories/:id` - الحصول على تصنيف محدد
- `POST /api/v1/categories` - إضافة تصنيف (Admin)
- `PUT /api/v1/categories/:id` - تعديل تصنيف (Admin)
- `DELETE /api/v1/categories/:id` - حذف تصنيف (Admin)

### Orders

- `POST /api/v1/orders` - إنشاء طلب جديد (User)
- `GET /api/v1/orders` - الحصول على جميع الطلبات
- `GET /api/v1/orders/:id` - الحصول على طلب محدد
- `PUT /api/v1/orders/:id/pay` - تحديث حالة الدفع (Admin)
- `PUT /api/v1/orders/:id/account` - إضافة معلومات الحساب (Admin)

### Users

- `GET /api/v1/users` - الحصول على جميع المستخدمين (Admin)
- `GET /api/v1/users/:id` - الحصول على مستخدم محدد (Admin)
- `POST /api/v1/users` - إضافة مستخدم (Admin)
- `PUT /api/v1/users/:id` - تعديل مستخدم (Admin)
- `DELETE /api/v1/users/:id` - حذف مستخدم (Admin)
- `GET /api/v1/users/getMe` - الحصول على بيانات المستخدم الحالي
- `PUT /api/v1/users/updateMe` - تحديث بيانات المستخدم الحالي
- `PUT /api/v1/users/changeMyPassword` - تغيير كلمة المرور

### Coupons

- `GET /api/v1/coupons` - الحصول على جميع الكوبونات (Admin)
- `GET /api/v1/coupons/:id` - الحصول على كوبون محدد (Admin)
- `POST /api/v1/coupons` - إضافة كوبون (Admin)
- `PUT /api/v1/coupons/:id` - تعديل كوبون (Admin)
- `DELETE /api/v1/coupons/:id` - حذف كوبون (Admin)

### Homepage Images

- `GET /api/v1/homepage-images` - الحصول على صور الصفحة الرئيسية
- `POST /api/v1/homepage-images` - إضافة صورة (Admin)
- `DELETE /api/v1/homepage-images/:id` - حذف صورة (Admin)

## 🔐 المصادقة

يستخدم المشروع JWT للمصادقة. يتم إرسال التوكن في Header:

```
Authorization: Bearer <token>
```

## 🛡️ الصلاحيات

### User

- تصفح المنتجات والتصنيفات
- إنشاء طلبات
- عرض طلباته الشخصية
- تعديل بياناته الشخصية

### Admin/Manager

- جميع صلاحيات المستخدم
- إدارة المنتجات والتصنيفات
- إدارة الطلبات وإضافة معلومات الحسابات
- إدارة المستخدمين
- إدارة الكوبونات

## 📝 ملاحظات التطوير

### تم إزالة:

- ❌ Cart Model & Routes
- ❌ Review Model & Routes
- ❌ Wishlist من User Model
- ❌ Addresses من User Model
- ❌ PayPal integration (يمكن إضافته لاحقاً)

### تم إضافة:

- ✅ حقول للمنتج: description, duration, stock
- ✅ حقول للطلب: accountEmail, accountPassword, accountDetails
- ✅ نظام شراء مباشر بدون سلة

## 🚀 التشغيل

1. تثبيت الحزم:

```bash
npm install
```

2. إنشاء ملف `config.env`:

```env
NODE_ENV=development
PORT=8000
BASE_URL=http://localhost:8000
DB_URI=mongodb://localhost:27017/streaming-accounts
JWT_SECRET=your-secret-key
JWT_EXPIRE_TIME=90d
```

3. تشغيل السيرفر:

```bash
npm start:dev
```

## 📦 الحزم المستخدمة

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - تشفير كلمات المرور
- jsonwebtoken - المصادقة
- express-validator - التحقق من البيانات
- multer - رفع الملفات
- sharp - معالجة الصور
- dotenv - متغيرات البيئة
- cors - Cross-origin resource sharing
- morgan - HTTP request logger
- compression - Response compression
- hpp - HTTP Parameter Pollution protection
- express-rate-limit - Rate limiting

## 🔧 Middleware

- `errorMiddleware.js` - معالجة الأخطاء
- `uploadImageMiddleware.js` - رفع الصور
- `validatorMiddleware.js` - التحقق من البيانات

## 📁 Uploads Structure

```
uploads/
├── categories/    # صور التصنيفات
├── products/      # صور المنتجات
├── users/         # صور المستخدمين
├── brands/        # صور البراندات
└── homepage/      # صور الصفحة الرئيسية
```

---

**ملاحظة**: تأكد من إعداد MongoDB قبل تشغيل المشروع.
