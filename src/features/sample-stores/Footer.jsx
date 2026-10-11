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

export default function Footer() {
    const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());

    return (
        <footer className="ss-footer">
            <div className="ss-footer__inner">
                {/* معرفی برند */}
                <div className="ss-footer__brand">
                    <div className="ss-footer__logo">
                        <span className="ss-footer__logo-mark">
                            <img
                                src={`${import.meta.env.BASE_URL}favicon.png`}
                                alt=""
                                width="28"
                                height="28"
                            />
                        </span>
                        <strong>{BRAND.pageTitle}</strong>
                    </div>
                    <p className="ss-footer__about">{BRAND.footerAbout}</p>
                </div>

                {/* لینک‌ها */}
                <nav className="ss-footer__col" aria-label="لینک‌های فوتر">
                    <h3 className="ss-footer__heading">دسترسی سریع</h3>
                    <ul className="ss-footer__links">
                        {BRAND.footerLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* نماد اعتماد */}
                <div className="ss-footer__col">
                    <h3 className="ss-footer__heading">نماد اعتماد</h3>
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
                                height="96"
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
