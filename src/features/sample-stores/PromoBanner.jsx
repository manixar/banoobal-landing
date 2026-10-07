import { ChevronLeftIcon } from "./icons";
import { BRAND } from "./stores.config";

export default function PromoBanner({ isDesktop = false }) {
    const file =
        isDesktop && BRAND.bannerDesktop ? BRAND.bannerDesktop : BRAND.bannerMobile;

    if (file) {
        return (
            <a
                className="ss-banner"
                href={BRAND.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "block",
                    width: "calc(100% - 32px)",
                    maxWidth: "100%",
                    margin: isDesktop ? "24px 24px 0" : "16px",
                    overflow: "hidden",
                    borderRadius: isDesktop ? 32 : 24,
                    lineHeight: 0,
                }}
            >
                <img
                    src={`${import.meta.env.BASE_URL}${file}`}
                    alt={BRAND.bannerAlt}
                    style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                    }}
                />
            </a>
        );
    }

    return (
        <section className="ss-promo">
            <div className="ss-promo__text">
                <h2 className="ss-promo__title">
                    {BRAND.promoTitleStart} <em>{BRAND.promoTitleHighlight}</em>{" "}
                    {BRAND.promoTitleEnd}
                </h2>
                <p className="ss-promo__desc">{BRAND.promoText}</p>
            </div>
            <div className="ss-promo__actions">
                <span className="ss-promo__tag">{BRAND.promoTag}</span>
                <a
                    className="ss-promo__btn"
                    href={BRAND.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {BRAND.promoButton}
                    <ChevronLeftIcon width={14} height={14} />
                </a>
            </div>
        </section>
    );
}