import { useEffect, useRef, useState } from 'react';
import StoreCard from './StoreCard';

export default function StoresCarousel({ stores }) {
    const trackRef = useRef(null);
    const activeRef = useRef(0);
    const [active, setActive] = useState(0);

    const last = stores.length - 1;

    // تشخیص کارت وسط با IntersectionObserver (مستقل از جهت RTL/LTR)
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const slides = Array.from(track.children);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        const index = slides.indexOf(entry.target);
                        activeRef.current = index;
                        setActive(index);
                    }
                });
            },
            { root: track, threshold: [0.6] }
        );

        slides.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, [stores.length]);

    const goTo = (index) => {
        const next = Math.max(0, Math.min(last, index));
        activeRef.current = next;
        setActive(next);
        trackRef.current?.children[next]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    };

    // صفحه RTL است: کارت قبلی سمت راست و کارت بعدی سمت چپ
    const goPrev = () => goTo(activeRef.current - 1);
    const goNext = () => goTo(activeRef.current + 1);

    return (
        <div className="ss-carousel">
            <button
                type="button"
                className="ss-arrow ss-arrow--prev"
                onClick={goPrev}
                disabled={active === 0}
                aria-label="فروشگاه قبلی"
            />


            <button
                type="button"
                className="ss-arrow ss-arrow--next"
                onClick={goNext}
                disabled={active === last}
                aria-label="فروشگاه بعدی"
            />

            <div className="ss-track" ref={trackRef}>
                {stores.map((store) => (
                    <div className="ss-slide" key={store.url}>
                        <StoreCard store={store} />
                    </div>
                ))}
            </div>

            <div className="ss-pager" role="tablist" aria-label="انتخاب فروشگاه">
                {stores.map((store, i) => (
                    <button
                        key={store.url}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        aria-label={store.name}
                        className={`ss-pager__dot${i === active ? ' is-active' : ''}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        </div>
    );
}