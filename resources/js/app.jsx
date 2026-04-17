import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Try to read the server-rendered initial page payload directly from the DOM.
// This guards against a race where the client-side runtime initializes before
// Inertia's helper finds the payload, which can make `initialPage` null.
let initialPage;
try {
    const el = typeof document !== 'undefined' ? document.getElementById('app') : null;
    if (el) {
        let raw = el.getAttribute('data-page') || el.dataset.page;
        if (raw) {
            // Defensive: if the server output was HTML-escaped (e.g. contains &quot;),
            // convert HTML entities back to characters before parsing.
            if (raw.includes('&quot;') || raw.includes('&amp;')) {
                const txt = document.createElement('textarea');
                txt.innerHTML = raw;
                raw = txt.value;
            }

            initialPage = JSON.parse(raw);
        }
    }
} catch (e) {
    // swallow parse errors and let Inertia attempt its own lookup
}

const runCreateInertiaApp = () => {
    try {
        console.debug('Inertia: starting app, initialPage=', initialPage);
        const el = typeof document !== 'undefined' ? document.getElementById('app') : null;
        if (el) {
            console.debug('Inertia: #app element found, raw data-page attribute=', el.getAttribute('data-page'));
        }

        const inertiaOptions = {
            resolve: (name) => {
                const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

                return pages[`./Pages/${name}.jsx`];
            },
            setup({ el, App, props }) {
                createRoot(el).render(<App {...props} />);
            },
            progress: {
                color: '#b8860b',
            },
        };

        // Only attach the parsed initial page if we actually parsed one.
        if (initialPage) {
            inertiaOptions.page = initialPage;
        }

        createInertiaApp(inertiaOptions);
    } catch (err) {
        // Surface the error in the console so it's easier to debug client startup issues.
        console.error('Inertia: failed to initialize createInertiaApp', err);
        throw err;
    }
};

if (typeof document !== 'undefined' && document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runCreateInertiaApp);
} else {
    runCreateInertiaApp();
}
