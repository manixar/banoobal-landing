import { useEffect, useState } from 'react';

// #/login  →  '/login'
function getRoute() {
    return window.location.hash.replace(/^#/, '') || '/';
}

export default function useHashRoute() {
    const [route, setRoute] = useState(getRoute);

    useEffect(() => {
        const onChange = () => {
            setRoute(getRoute());
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', onChange);
        return () => window.removeEventListener('hashchange', onChange);
    }, []);

    return route;
}
