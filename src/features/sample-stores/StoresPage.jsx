import { useLayoutEffect, useRef, useState } from 'react';
import './sample-stores.css';
import PromoBanner from './PromoBanner';
import StoresCarousel from './StoresCarousel';
import StoreCard from './StoreCard';
import { ChevronLeftIcon } from './icons';
import { BRAND, STORES } from './stores.config';

const DESKTOP_MIN_WIDTH = 768;

// عرض خود کامپوننت را می‌سنجد، نه عرض کل صفحه
function useIsDesktop(ref) {
    const [isDesktop, setIsDesktop] = useState(false);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = (width) => setIsDesktop(width >= DESKTOP_MIN_WIDTH);
        update(el.getBoundingClientRect().width);

        const observer = new ResizeObserver(([entry]) =>
            update(entry.contentRect.width)
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);

    return isDesktop;
}

export default function StoresPage({ onBack = () => window.history.back() }) {
    const rootRef = useRef(null);
    const isDesktop = useIsDesktop(rootRef);

    return (
        <div className="ss-root" ref={rootRef}>
            {/* نوار بالا */}
            <header className="ss-topbar">
                <button
                    type="button"
                    className="ss-back"
                    onClick={onBack}
                    aria-label="بازگشت"
                >
                    <img
                        src={`${import.meta.env.BASE_URL}black-icon.png`}
                        alt=""
                        className="ss-back__img"
                        width="24"
                        height="24"
                    />
                </button>
                <h1 className="ss-topbar__title">{BRAND.pageTitle}</h1>
            </header>

            <main className="ss-main">
                {/* بنر: عکس موبایل یا دسکتاپ بر اساس عرض صفحه */}
                <PromoBanner isDesktop={isDesktop} />

                {/* باکس معرفی بنفش حبابی */}
                <section className="ss-intro">
                    <span className="ss-intro__tag">{BRAND.promoTag}</span>
                    <h2 className="ss-intro__title">{BRAND.storesTitle}</h2>
                    <p className="ss-intro__text">{BRAND.storesText}</p>
                </section>

                {isDesktop ? (
                    /* دسکتاپ: همه‌ی فروشگاه‌ها در یک گرید */
                    <div className="ss-grid">
                        {STORES.map((store) => (
                            <StoreCard key={store.url} store={store} />
                        ))}
                    </div>
                ) : (
                    /* موبایل: کاروسل + لیست */
                    <>
                        <StoresCarousel stores={STORES} />

                        <section className="ss-section">
                            <h2 className="ss-section__title">{BRAND.allStoresTitle}</h2>
                            <ul className="ss-list">
                                {STORES.map((store) => (
                                    <li key={store.url}>
                                        <a
                                            className="ss-row"
                                            href={store.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                className="ss-row__img"
                                                src={`${import.meta.env.BASE_URL}${store.preview}`}
                                                alt=""
                                                loading="lazy"
                                            />
                                            <span className="ss-row__text">
                        <strong>{store.name}</strong>
                        <span>{store.category}</span>
                      </span>
                                            <ChevronLeftIcon className="ss-row__arrow" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}

                <section className="ss-cta">
                    <h2>{BRAND.ctaTitle}</h2>
                    <p>{BRAND.ctaText}</p>
                    <div className="ss-cta-btn">
                    <a href={BRAND.ctaUrl} target="_blank" rel="noopener noreferrer">
                        {BRAND.ctaLabel}
                    </a>
                    <a href={BRAND.ctaUrl} target="_blank" rel="noopener noreferrer">
                        {BRAND.ctaBack}
                    </a>
                    </div>
                </section>
            </main>
        </div>
    );
}