'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
    minimum: 0.1,
    easing: 'ease',
    speed: 300,
});

export function ProgressBar() {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.done();
    }, [pathname]);

    return null;
}
