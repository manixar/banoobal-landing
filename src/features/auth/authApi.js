const API_BASE = import.meta.env.DEV ? '' : 'https://api.paanapay.com';
const SOURCE = 'banoobal';

// آدرس پاناپی؛ بعد از ورود، توکن به صفحه‌ی /Auth/callback آن داده می‌شود
// (لوکال: پروژه‌ی paanapay-web روی پورت 3000)
export const PANAPAY_URL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://paanapay.com';

async function request(path, body, token) {
    let res;
    try {
        res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
    } catch {
        throw new Error('اتصال به سرور برقرار نشد. اینترنت خود را بررسی کنید.');
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
        //  { message, errors: { field: ['…'] } }
        const fieldError = json.errors && Object.values(json.errors)[0]?.[0];
        const message =
            fieldError ||
            json.message ||
            (res.status === 429
                ? 'تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.'
                : 'خطایی رخ داد. دوباره تلاش کنید.');
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    return json.data ?? {};
}

// ۱) ارسال کد تأیید
export async function sendOtp({ mobile }) {
    const data = await request('/api/store/auth/send-otp', { mobile });
    return { expiresIn: data.expires_in ?? 120 };
}

// ۲) تأیید کد
export async function verifyOtp({ mobile, code }) {
    const data = await request('/api/store/auth/verify-otp', { mobile, code, source: SOURCE });
    return {
        token: data.token,
        user: data.user,
        needsUserInfo: Boolean(data.needs_user_info),
        needsStoreInfo: Boolean(data.needs_store_info),
    };
}


// کاربر جدید بعد از تایید کد هنوز توکن نداره؛ بک‌اند او را از روی mobile می‌شناسد
export async function completeUserInfo({ token, mobile, firstName, lastName }) {
    const data = await request(
        '/api/store/auth/complete-user-info',
        { mobile, first_name: firstName.trim(), last_name: lastName.trim() },
        token
    );
    return {
        token: data.token,
        needsStoreInfo: Boolean(data.needs_store_info),
    };
}