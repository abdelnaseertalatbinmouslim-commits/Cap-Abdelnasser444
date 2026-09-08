// رابط Realtime Database الخاص بك
const DB_URL = "https://abodaa-default-rtdb.firebaseio.com";

// مفتاح التخزين المحلي للجلسة
const SESSION_KEY = "cap_student_session";

// دالة تسجيل الدخول للطلاب القدامى والجدد
export async function loginStudent(phone, pin) {
  try {
    const response = await fetch(`${DB_URL}/students.json`);
    if (!response.ok) throw new Error("فشل الاتصال بقاعدة البيانات");
    
    const students = await response.json();
    if (!students) {
      throw new Error("لا توجد بيانات مسجلة حالياً");
    }

    let foundStudent = null;
    
    // البحث عن الطالب برقم الهاتف داخل الـ Realtime Database
    for (const key in students) {
      const student = students[key];
      if (student.phone === phone) {
        // نأخذ الـ key الخاص بـ Firebase كـ id أو key إضافي ليتوافق مع student.js
        foundStudent = { id: key, key: key, ...student };
        break;
      }
    }

    if (!foundStudent) {
      throw new Error("رقم الهاتف غير مسجل في المنصة");
    }

    // التحقق من الـ PIN
    if (String(foundStudent.pin) !== String(pin)) {
      throw new Error("كلمة المرور (PIN) غير صحيحة");
    }

    // حفظ الجلسة محلياً
    localStorage.setItem(SESSION_KEY, JSON.stringify(foundStudent));
    return foundStudent;

  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

// دالة تسجيل طالب جديد
export async function registerStudent(payload) {
  try {
    const cleanPayload = {};
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        cleanPayload[key] = payload[key];
      }
    });

    const response = await fetch(`${DB_URL}/students.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanPayload),
    });

    if (!response.ok) {
      throw new Error("فشل تسجيل الحساب، يجب المحاولة لاحقاً");
    }

    const result = await response.json();
    return { success: true, id: result.name, message: "تم إنشاء الحساب بنجاح" };

  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
}

// دالة التحقق من جلسة الطالب (تستخدمها student.js)
export function requireStudent() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return JSON.parse(session);
}

// دالة جلب بيانات الطالب الحالي
export function getStudent() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// دالة تسجيل الخروج
export function logoutStudent() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}
