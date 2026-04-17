import { Head, Link, router, usePage } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';

export default function StoreLayout({ title, children, authPage = false }) {
    const { auth, cartCount } = usePage().props;
    const user = auth?.user;

    const logout = (event) => {
        event.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head title={title} />
            <div className={authPage ? 'auth-shell' : 'store-shell'}>
                {authPage ? <div className="page-bg" /> : null}
                <FlashMessage />
                <nav className={`site-nav ${authPage ? 'auth-nav' : ''}`}>
                    <Link href="/" className="nav-logo">
                        <span>Dusty</span>Pages
                    </Link>
                    <div className="nav-links">
                        {!authPage ? <Link href="/products">Browse</Link> : null}
                        {!authPage && user?.is_admin ? <Link href="/admin/dashboard">Admin</Link> : null}
            {user ? (
    <>
                {!authPage && !user?.is_admin ? <Link href="/checkout">Checkout</Link> : null}
                {!authPage && !user?.is_admin ? <Link href="/wishlist">Wishlist</Link> : null}
                {!authPage ? <Link href="/my-orders">Orders</Link> : null}

        <span className="user-nametag">Hi, {user.name.split(' ')[0]}!</span>
        <button
            type="button"
            className="logout-link"

                                    onClick={(e) => {
                                        e.preventDefault();
                                        try {
                                            if (router && router.post) {
                                                router.post('/logout');
                                                return;
                                            }
                                        } catch (err) {
                                            // fall through to fetch fallback
                                        }

                                        const cookie = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='));
                                        if (cookie) {
                                            const token = decodeURIComponent(cookie.split('=')[1]);
                                            fetch('/logout', {
                                                method: 'POST',
                                                credentials: 'same-origin',
                                                headers: {
                                                    'X-XSRF-TOKEN': token,
                                                    'Content-Type': 'application/json',
                                                },
                                            })
                                                .then(() => (window.location.href = '/'))
                                                .catch(() => (window.location.href = '/'));
                                        } else {
                                            window.location.href = '/';
                                        }
                                    }}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    onClick={(e) => {
                                        if (router && router.visit) {
                                            e.preventDefault();
                                            router.visit('/login');
                                        }
                                    }}
                                >
                                    Sign In
                                </a>
                                <a
                                    href="/register"
                                    onClick={(e) => {
                                        if (router && router.visit) {
                                            e.preventDefault();
                                            router.visit('/register');
                                        }
                                    }}
                                >
                                    Register
                                </a>
                            </>
                        )}

                        {!authPage && !user?.is_admin ? (
                            <Link href="/cart" className="nav-cart">
                                🛒 Cart ({cartCount ?? 0})
                            </Link>
                        ) : null}

                    </div>
                </nav>
                <div className="site-content">
                    {children}

                    {!authPage ? (
                        <footer className="site-footer">
                            <Link href="/">
                                <span style={{ color: 'var(--parchment)', fontStyle: 'normal' }}>Dusty</span>Pages
                            </Link>
                            <span>© 2024 DustyPages · All rights reserved</span>
                        </footer>
                    ) : (
                        <footer className="auth-footer">
                            © 2024 DustyPages · All rights reserved · A sanctuary for timeless literature
                        </footer>
                    )}
                </div>
            </div>
        </>
    );
}
