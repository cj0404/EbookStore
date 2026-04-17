import { Head, Link, router, usePage } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';

const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '📚' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout({ title, active, children, topbarRight }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={title} />
            <div className="admin-shell">
                <FlashMessage />
                <aside className="admin-sidebar">
                    <div className="sidebar-logo">
                        <Link href="/">
                            <span>Dusty</span>Pages
                        </Link>
                        <div className="admin-badge">Admin Panel</div>
                    </div>
                    <nav className="sidebar-nav">
                        <div className="nav-section-label">Main</div>
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`sidebar-link ${active === link.label ? 'active' : ''}`}
                            >
                                <span className="link-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        <div className="nav-section-label">Store</div>
                        <Link href="/" className="sidebar-link">
                            <span className="link-icon">🏪</span>View Store
                        </Link>
                        <button className="sidebar-link button-link" onClick={() => router.post('/logout')}>
                            <span className="link-icon">🚪</span>Sign Out
                        </button>
                    </nav>
                    <div className="sidebar-footer">
                        <div className="sidebar-user">
                            <div className="user-avatar">A</div>
                            <div className="user-info">
                                <div className="user-name">{auth?.user?.name}</div>
                                <div className="user-role">Super Admin</div>
                            </div>
                        </div>
                    </div>
                </aside>
                <div className="admin-main">
                    <div className="admin-topbar">
                        <div className="topbar-title">{title}</div>
                            <div className="topbar-actions">
                                {topbarRight}
                            </div>
                    </div>
                    <div className="admin-content">{children}</div>
                    <footer className="admin-footer">DustyPages Admin Panel</footer>
                </div>
            </div>
        </>
    );
}
