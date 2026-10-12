import { useEffect, useRef, useState } from 'react';
import StoreCard from './StoreCard';

const AUTOPLAY_MS = 3000;

export default function StoresCarousel({ stores }) {
    const trackRef = useRef(null);
    const activeRef = useRef(0);
    const perViewRef = useRef(1);
    const [active, setActive] = useState(0);
    const [perView, setPerView] = useState(1);
    const [paused, setPaused] = useState(false);

    const maxIndex = Math.max(0, stores.length - perView);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const update = () => {
            const slide = track.children[0];
            if (!slide) return;
            const count = Math.max(1, Math.floor(track.clientWidth / slide.offsetWidth + 0.05));
            perViewRef.current = count;
            setPerView(count);
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(track);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const slides = Array.from(track.children);

        const observer = new IntersectionObserver(
            (entries) => {
                if (perViewRef.current > 1) return;
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

    const scrollToSlide = (index) => {
        const track = trackRef.current;
        const slide = track?.children[index];
        if (!slide) return;
        const t = track.getBoundingClientRect();
        const s = slide.getBoundingClientRect();
        const delta =
            perViewRef.current > 1
                ? s.right - t.right // دسکتاپ (RTL): لبه‌ی راست کارت به لبه‌ی راست اسلایدر
                : s.left + s.width / 2 - (t.left + t.width / 2); // موبایل: کارت وسط
        track.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const goTo = (index) => {
        const next = Math.max(0, Math.min(maxIndex, index));
        activeRef.current = next;
        setActive(next);
        scrollToSlide(next);
    };

    // حلقه‌ای: بعد از آخری برمی‌گردد به اولی
    const goNext = () => goTo(activeRef.current >= maxIndex ? 0 : activeRef.current + 1);
    const goPrev = () => goTo(activeRef.current <= 0 ? maxIndex : activeRef.current - 1);

    // ۴) حرکت خودکار هر ۳ ثانیه
    useEffect(() => {
        if (paused || maxIndex === 0) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = setInterval(goNext, AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [paused, active, maxIndex]);

    return (
        <div
            className="ss-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
        >
            <button type="button" className="ss-arrow ss-arrow--prev" onClick={goPrev} aria-label="فروشگاه قبلی" />
            <button type="button" className="ss-arrow ss-arrow--next" onClick={goNext} aria-label="فروشگاه بعدی" />

            <div className="ss-track" ref={trackRef}>
                {stores.map((store) => (
                    <div className="ss-slide" key={store.url}>
                        <StoreCard store={store} />
                    </div>
                ))}
            </div>

            <div className="ss-pager" role="tablist" aria-label="انتخاب فروشگاه">
                {stores.slice(0, maxIndex + 1).map((store, i) => (
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