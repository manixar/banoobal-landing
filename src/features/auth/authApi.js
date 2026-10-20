// ⚠️ نسخه‌ی آزمایشی (mock): هنوز به سرور پاناپی وصل نیست.
// بعداً فقط بدنه‌ی این دو تابع با fetch واقعی عوض می‌شود و بقیه‌ی کد دست نمی‌خورد.

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// مقصد بعد از ورود موفق
export const DASHBOARD_URL = 'https://paanapay.com/panel/dashboard';

export async function sendOtp({ mobile }) {
    await wait(800);
    console.info('[mock] کد تأیید برای', mobile, 'ارسال شد. کد تست: 123456');
    return { ok: true, expiresIn: 120 }; // اعتبار کد به ثانیه
}

export async function verifyOtp({ mobile, code }) {
    await wait(800);
    if (code !== '123456') {
        throw new Error('کد وارد شده اشتباه است.');
    }
    // API واقعی باید یک لینک یک‌بارمصرف برگرداند که ورود را روی paanapay.com بسازد، مثلاً:
    //   https://paanapay.com/auth/callback?code=XYZ&next=/panel/dashboard
    // تا آن موقع مستقیم به پیشخوان می‌رویم (پاناپی هنوز ممکن است دوباره لاگین بخواهد).
    return { ok: true, mobile, redirectUrl: DASHBOARD_URL };
}
