import { Link, router, usePage } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';
import { currency } from '../../utils';

export default function Cart({ items, item_count, subtotal, total }) {

    const { auth } = usePage().props;
    const user = auth?.user;

    if (user?.is_admin) {
        return (
            <StoreLayout title="Cart">
                <div className="empty-cart">
                    <span className="empty-icon">👨‍💼</span>
                    <h2>Admin Access Restricted</h2>
                    <p>Administrators cannot use shopping cart features. Visit <Link href="/admin/dashboard">Admin Dashboard</Link>.</p>
                </div>
            </StoreLayout>
        );
    }

    const updateQuantity = (productSlug, quantity) => {
        router.patch(`/cart/${productSlug}`, { quantity }, { preserveScroll: true });
    };


    const removeItem = (productSlug) => {
        router.delete(`/cart/${productSlug}`, { preserveScroll: true });
    };

    return (
        <StoreLayout title="My Cart">
            <div className="page-header">
                <h1>My Cart</h1>
                <div className="breadcrumb">
                    <Link href="/">Home</Link> → Cart
                </div>
            </div>

            <div className="cart-layout">
                <div className="cart-items-section">
                    <h2>{item_count} Items in Your Basket</h2>
                    {items.length ? (
                        items.map(({ product, quantity, line_total }) => (
                            <div className="cart-item" key={product.id}>
                                <div
                                    className={`item-cover ${product.cover_class}`}
                                    style={{ background: product.cover_gradient }}
                                >
                                    {product.cover_emoji}
                                </div>
                                <div className="item-info">
                                    <div className="item-genre">{product.genre}</div>
                                    <div className="item-title">{product.title}</div>
                                    <div className="item-author">{product.author}</div>
                                    <span className="item-format">{product.formats.join(' · ')}</span>
                                </div>
                                <div className="item-controls">
                                    <span className="item-price">{currency(line_total)}</span>
                                    <div className="qty-control">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(product.slug, Math.max(1, quantity - 1))}
                                        >
                                            −
                                        </button>
                                        <input
                                            className="qty-input"
                                            type="number"
                                            value={quantity}
                                            onChange={(event) => updateQuantity(product.slug, Number(event.target.value))}
                                        />
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(product.slug, quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeItem(product.slug)}>
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart">
                            <span className="empty-icon">🛒</span>
                            <h2>Your cart is empty</h2>
                            <p>Browse the shelves and add a few beloved classics.</p>
                            <Link href="/products" className="btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>

                <aside className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal ({item_count} items)</span>
                        <span>{currency(subtotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Discount</span>
                        <span style={{ color: '#2a7a2a' }}>−₱0</span>
                    </div>
                    <div className="summary-row">
                        <span>Digital Delivery</span>
                        <span style={{ color: '#2a7a2a' }}>FREE</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{currency(total)}</span>
                    </div>
                    <div className="promo-row">
                        <input className="promo-input" type="text" placeholder="Promo code…" />
                        <button className="promo-btn">Apply</button>
                    </div>
                    <Link href={auth?.user ? '/checkout' : '/login'} className="checkout-btn">
                        Proceed to Checkout →
                    </Link>
                    <Link href="/products" className="continue-btn" style={{marginTop: '12px', textAlign: 'center'}}>
                        ← Continue Shopping
                    </Link>
                    {!auth?.user ? <p className="secure-note">Sign in is required before checkout.</p> : null}
                </aside>
            </div>
        </StoreLayout>
    );
}
