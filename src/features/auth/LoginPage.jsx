import { useEffect, useState } from 'react';
import './login.css';
import { normalizeMobile, toEnglishDigits } from './phone';
import { sendOtp, verifyOtp, DASHBOARD_URL } from './authApi';
import { BRAND } from '../sample-stores/stores.config';

const BRAND_NAME = 'بانوشاپ';
const HERO_IMAGE = `${import.meta.env.BASE_URL}auth/login-banner.png`;
const LOGO_IMAGE = `${import.meta.env.BASE_URL}auth/login-logo-mark.webp`;

/* ---------- آیکون‌ها ---------- */
const icon = {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true',
};
const BagIcon = (p) => (
    <svg {...icon} {...p}>
        <path d="M6 7h12l1 13H5z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
);
const HeadsetIcon = (p) => (
    <svg {...icon} {...p}>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </svg>
);
const UserIcon = (p) => (
    <svg {...icon} {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
);
const ArrowLeftIcon = (p) => (
    <svg {...icon} {...p}>
        <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
);
const ShieldIcon = (p) => (
    <svg {...icon} {...p}>
        <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

/* ---------- صفحه ---------- */
export default function LoginPage() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [step, setStep] = useState('mobile'); // 'mobile' | 'otp' | 'done'
    const [mobile, setMobile] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const isRegister = mode === 'register';

    // شمارش معکوس برای «ارسال دوباره‌ی کد»
    useEffect(() => {
        if (step !== 'otp' || secondsLeft <= 0) return;
        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [step, secondsLeft]);

    // مرحله‌ی ۱: ارسال کد
    const handleSendCode = async (e) => {
        e?.preventDefault();
        setError('');

        const normalized = normalizeMobile(mobile);
        if (!normalized) {
            setError('شماره موبایل معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹');
            return;
        }
        if (isRegister && (!firstName.trim() || !lastName.trim())) {
            setError('نام و نام خانوادگی را وارد کنید.');
            return;
        }

        setLoading(true);
        try {
            const res = await sendOtp({ mobile: normalized, mode, firstName, lastName });
            setMobile(normalized);
            setCode('');
            setStep('otp');
            setSecondsLeft(res.expiresIn ?? 120);
        } catch (err) {
            setError(err.message || 'ارسال کد با خطا روبه‌رو شد.');
        } finally {
            setLoading(false);
        }
    };

    // مرحله‌ی ۲: تأیید کد
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        if (code.length !== 6) {
            setError('کد ۶ رقمی را کامل وارد کنید.');
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp({ mobile, code, mode, firstName, lastName });
            setStep('done');
            // انتقال به پیشخوان پاناپی (replace: دکمه‌ی Back دوباره به فرم کد برنمی‌گردد)
            window.location.replace(res.redirectUrl || DASHBOARD_URL);
        } catch (err) {
            setError(err.message || 'تأیید کد با خطا روبه‌رو شد.');
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(isRegister ? 'login' : 'register');
        setError('');
    };

    const editMobile = () => {
        setStep('mobile');
        setCode('');
        setError('');
    };

    const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());
    const timer = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

    return (
        <div className="lg-root">
            <header className="lg-header">
                <a href="#/" className="lg-brand" aria-label={`بازگشت به صفحه‌ی اصلی ${BRAND_NAME}`}>
                    <span className="lg-brand__icon"><BagIcon width={16} height={16} /></span>
                    {BRAND_NAME}
                </a>
                <a href={`tel:${BRAND.supportPhone}`} className="lg-support">
                    <HeadsetIcon width={16} height={16} />
                    پشتیبانی
                </a>
            </header>

            <main className="lg-main">
                <section className="lg-form-side">
                    <div className="lg-card">
                        {/* لوگوی بانوبال بالای فرم */}
                        <img
                            className="lg-logo"
                            src={LOGO_IMAGE}
                            alt="بانوبال"
                            width="88"
                            height="67"
                        />

                        <span className="lg-eyebrow">
                            {isRegister ? 'ساخت حساب کاربری' : 'ورود به حساب کاربری'}
                        </span>
                        <h1 className="lg-title">
                            به فروشگاه‌ساز {BRAND_NAME} خوش آمدید
                        </h1>
                        <p className="lg-subtitle">
                            {step === 'otp'
                                ? `کد ۶ رقمی ارسال‌شده به ${mobile} را وارد کنید.`
                                : isRegister
                                    ? 'برای ساخت فروشگاه، اطلاعات خود را وارد کنید.'
                                    : 'برای ادامه، وارد حساب کاربری خود شوید.'}
                        </p>

                        {step === 'done' ? (
                            <p className="lg-success" role="status">
                                ورود با موفقیت انجام شد. در حال انتقال به پیشخوان…
                            </p>
                        ) : step === 'mobile' ? (
                            <form className="lg-form" onSubmit={handleSendCode} noValidate>
                                {isRegister && (
                                    <div className="lg-row">
                                        <label className="lg-field">
                                            <span className="lg-label">نام</span>
                                            <input
                                                className="lg-input"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                autoComplete="given-name"
                                                maxLength={255}
                                            />
                                        </label>
                                        <label className="lg-field">
                                            <span className="lg-label">نام خانوادگی</span>
                                            <input
                                                className="lg-input"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                autoComplete="family-name"
                                                maxLength={255}
                                            />
                                        </label>
                                    </div>
                                )}

                                <label className="lg-field">
                                    <span className="lg-label">شماره موبایل</span>
                                    <span className="lg-input-wrap">
                                        <UserIcon className="lg-input-icon" />
                                        <input
                                            className="lg-input lg-input--icon"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            placeholder="شماره موبایل خود را وارد کنید"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            aria-invalid={!!error}
                                            autoFocus
                                        />
                                    </span>
                                </label>

                                {error && <p className="lg-error" role="alert">{error}</p>}

                                <button className="lg-btn" type="submit" disabled={loading}>
                                    {loading ? 'در حال ارسال…' : isRegister ? 'دریافت کد و ثبت‌نام' : 'ورود به حساب'}
                                    {!loading && <ArrowLeftIcon />}
                                </button>

                                <p className="lg-switch">
                                    {isRegister ? 'حساب کاربری دارید؟' : 'حساب کاربری ندارید؟'}{' '}
                                    <button type="button" className="lg-link" onClick={switchMode}>
                                        {isRegister ? 'وارد شوید' : 'ثبت‌نام کنید'}
                                    </button>
                                </p>
                            </form>
                        ) : (
                            <form className="lg-form" onSubmit={handleVerify} noValidate>
                                <label className="lg-field">
                                    <span className="lg-label">کد تأیید</span>
                                    <input
                                        className="lg-input lg-input--code"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        dir="ltr"
                                        maxLength={6}
                                        placeholder="------"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(toEnglishDigits(e.target.value).replace(/\D/g, '').slice(0, 6))
                                        }
                                        aria-invalid={!!error}
                                        autoFocus
                                    />
                                </label>

                                {error && <p className="lg-error" role="alert">{error}</p>}

                                <button className="lg-btn" type="submit" disabled={loading}>
                                    {loading ? 'در حال بررسی…' : 'تأیید و ادامه'}
                                    {!loading && <ArrowLeftIcon />}
                                </button>

                                <div className="lg-otp-actions">
                                    <button type="button" className="lg-link" onClick={editMobile}>
                                        ویرایش شماره
                                    </button>
                                    {secondsLeft > 0 ? (
                                        <span className="lg-timer">ارسال دوباره تا {timer}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            className="lg-link"
                                            onClick={handleSendCode}
                                            disabled={loading}
                                        >
                                            ارسال دوباره‌ی کد
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}

                        <div className="lg-trust">
                            <p>
                                <ShieldIcon width={15} height={15} />
                                اطلاعات شما نزد ما محفوظ است.
                            </p>
                            <p className="lg-terms">
                                ورود شما به معنی پذیرش <a href="#/">قوانین</a> و{' '}
                                <a href="#/">حریم خصوصی</a> {BRAND_NAME} است.
                            </p>
                        </div>
                    </div>
                </section>

                <aside className="lg-hero" aria-hidden="true">
                    <img src={HERO_IMAGE} alt="" />
                </aside>
            </main>

            <footer className="lg-footer">
                <span>© {year} {BRAND_NAME}. همه حقوق محفوظ است.</span>
                <nav className="lg-footer__links">
                    <a href="#/">شرایط استفاده</a>
                    <a href="#/">حریم خصوصی</a>
                </nav>
            </footer>
        </div>
    );
}
