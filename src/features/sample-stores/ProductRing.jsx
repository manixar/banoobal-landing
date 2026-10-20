import { useEffect, useRef, useState } from 'react';
import { BRAND } from './stores.config';

const base = import.meta.env.BASE_URL;

// وقتی سکشن وارد صفحه شد، یک‌بار انیمیشن ورود را فعال می‌کند
function useInView(ref) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || inView) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, inView]);

    return inView;
}

export default function ProductRing() {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef);

    return (
        <section
            ref={sectionRef}
            className={`ss-ring${inView ? ' is-visible' : ''}`}
            aria-labelledby="ss-ring-title"
        >
            <h2 id="ss-ring-title" className="ss-ring__title">
                {BRAND.ringTitle}
            </h2>
            <p className="ss-ring__text">{BRAND.ringText}</p>

            <div className="ss-ring__circle">
                {/* حلقه‌ی محصولات که آرام می‌چرخد */}
                <picture className="ss-ring__spin" aria-hidden="true">
                    <source srcSet={`${base}productring/productring.webp`} type="image/webp" />
                    <img
                        src={`${base}productring/productring.png`}
                        alt=""
                        width="900"
                        height="900"
                        loading="lazy"
                        decoding="async"
                    />
                </picture>

                {/* دکمه وسط حلقه */}
                <div className="ss-ring__center">
                    <a
                        className="ss-ring__btn"
                        href={BRAND.ctaUrl}
                    >
                        {BRAND.ringButton}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M19 12H5M11 18l-6-6 6-6" />
                        </svg>
                    </a>
                    <span className="ss-ring__badge">{BRAND.ringBadge}</span>
                </div>
            </div>
        </section>
    );
}
