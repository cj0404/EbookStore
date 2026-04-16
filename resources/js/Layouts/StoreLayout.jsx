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
                                {!authPage ? <Link href="/checkout">Checkout</Link> : null}
                                <a href="/logout" onClick={logout}>
                                    Sign Out
                                </a>
                            </>
                        ) : (
                            <>
                                <Link href="/login">Sign In</Link>
                                <Link href="/register">Register</Link>
                            </>
                        )}
                        {!authPage ? (
                            <Link href="/cart" className="nav-cart">
                                🛒 Cart ({cartCount ?? 0})
                            </Link>
                        ) : null}
                    </div>
                </nav>
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
        </>
    );
}
