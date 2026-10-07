import { ExternalLinkIcon } from './icons';

export default function StoreCard({ store }) {
    const host = new URL(store.url).host;
    const src = `${import.meta.env.BASE_URL}${store.preview}`;

    return (
        <a
            className="ss-card"
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`ورود به فروشگاه ${store.name} در تب جدید`}
        >
            <div className="ss-card__frame">
                <div className="ss-card__bar">
          <span className="ss-card__dots">
            <i />
            <i />
            <i />
          </span>
                    <span className="ss-card__host" dir="ltr">
            {host}
          </span>
                </div>
                <img className="ss-card__img" src={src} alt={store.name} loading="lazy" />
            </div>

            <div className="ss-card__meta">
                <div className="ss-card__text">
                    <strong>{store.name}</strong>
                    <span>{store.category}</span>
                </div>
                <ExternalLinkIcon width={18} height={18} />
            </div>
        </a>
    );
}