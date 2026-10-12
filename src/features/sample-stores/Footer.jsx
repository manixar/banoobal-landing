import { BRAND, ENAMAD } from './stores.config';

const enamadHref = `https://trustseal.enamad.ir/?id=${ENAMAD.id}&Code=${ENAMAD.code}`;
const enamadDemoSrc = `${import.meta.env.BASE_URL}${ENAMAD.demoImage}`;
const enamadSrc = ENAMAD.demo
    ? enamadDemoSrc
    : `https://trustseal.enamad.ir/logo.aspx?id=${ENAMAD.id}&Code=${ENAMAD.code}`;

function handleEnamadError(e) {
    if (!e.currentTarget.src.endsWith(ENAMAD.demoImage)) {
        e.currentTarget.src = enamadDemoSrc;
    }
}

const iconProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
};

const PhoneIcon = () => (
    <svg {...iconProps}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
);

const MailIcon = () => (
    <svg {...iconProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
    </svg>
);

// آیکون‌های ساده و عمومی (دوربین و ارسال)
const SOCIAL_ICONS = {
    instagram: (
        <svg {...iconProps}>
            <path d="M14.5 4h-5L7.5 6.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-3.5z" />
            <circle cx="12" cy="13" r="3.5" />
        </svg>
    ),
    telegram: (
        <svg {...iconProps}>
            <path d="m22 2-7 20-4-9-9-4z" />
            <path d="M22 2 11 13" />
        </svg>
    ),
};

const socials = (BRAND.socials || []).filter((s) => s.href);

export default function Footer() {
    const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());

    return (
        <footer className="ss-footer">
            <div className="ss-footer__inner">
                {/* ارتباط با ما */}
                <div className="ss-footer__col">
                    <h3 className="ss-footer__heading">{BRAND.footerContactTitle}</h3>
                    <ul className="ss-footer__contact">
                        <li>
                            <PhoneIcon />
                            <span>تلفن پشتیبانی:</span>
                            <a href={`tel:${BRAND.supportPhone}`} dir="ltr">
                                {BRAND.supportPhoneLabel}
                            </a>
                        </li>
                        <li>
                            <MailIcon />
                            <span>ایمیل پشتیبانی:</span>
                            <a href={`mailto:${BRAND.supportEmail}`} dir="ltr">
                                {BRAND.supportEmail}
                            </a>
                        </li>
                    </ul>

                    {socials.length > 0 && (
                        <div className="ss-footer__socials">
                            {socials.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                >
                                    {SOCIAL_ICONS[s.name]}
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* درباره بانوبال */}
                <div className="ss-footer__col">
                    <div className="ss-footer__logo">
                        <span className="ss-footer__logo-mark">
                            <img
                                src={`${import.meta.env.BASE_URL}black-icon.png`}
                                alt=""
                                width="28"
                                height="28"
                            />
                        </span>
                        <h3 className="ss-footer__heading">{BRAND.footerAboutTitle}</h3>
                    </div>
                    {BRAND.footerAboutLines.map((line) => (
                        <p className="ss-footer__about" key={line}>
                            {line}
                        </p>
                    ))}
                </div>

                {/* نماد اعتماد */}
                <div className="ss-footer__col">
                    <h3 className="ss-footer__heading">{BRAND.enamadTitle}</h3>
                    <div className="ss-footer__trust">
                        <a
                            href={enamadHref}
                            target="_blank"
                            referrerPolicy="origin"
                            rel="noopener"
                            aria-label="نماد اعتماد الکترونیکی"
                        >
                            <img
                                src={enamadSrc}
                                referrerPolicy="origin"
                                alt="نماد اعتماد الکترونیکی"
                                code={ENAMAD.code}
                                onError={handleEnamadError}
                                width="96"
                                height="104"
                                style={{ cursor: 'pointer' }}
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div className="ss-footer__bottom">
                © {year} — تمامی حقوق برای {BRAND.pageTitle} محفوظ است.
            </div>
        </footer>
    );
}
