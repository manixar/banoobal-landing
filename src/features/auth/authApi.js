
const API_BASE = import.meta.env.DEV ? '' : 'https://api.paanapay.com';
const SOURCE = 'banoobal';

// مقصد بعد از ورود موفق
export const DASHBOARD_URL = 'https://paanapay.com/panel/dashboard';

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
        redirectUrl: data.redirect_url,
    };
}

// ۳) تکمیل اطلاعات کاربر جدید

export async function completeUserInfo({ token, firstName, lastName }) {
    const data = await request(
        '/api/store/auth/complete-user-info',
        { first_name: firstName.trim(), last_name: lastName.trim() },
        token
    );
    return { redirectUrl: data.redirect_url };
}
