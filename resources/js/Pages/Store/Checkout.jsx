import { useForm } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';
import { currency } from '../../utils';


export default function Checkout({ items, subtotal, total, user }) {
    const pageUser = user;

    if (pageUser?.is_admin) {
        return (
            <StoreLayout title="Checkout">
                <div className="empty-cart">
                    <span className="empty-icon">👨‍💼</span>
                    <h2>Admin Access Restricted</h2>
                    <p>Administrators cannot checkout. Visit <Link href="/admin/dashboard">Admin Dashboard</Link>.</p>
                </div>
            </StoreLayout>
        );
    }

    const [firstName = '', ...rest] = (pageUser?.name || '').split(' ');


    const { data, setData, post, processing, errors } = useForm({
        first_name: firstName,
        last_name: rest.join(' '),
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: 'Manila',
        province: 'Metro Manila',
        zip: '1000',
        country: 'Philippines',
        delivery_notes: '',
        payment_method: 'cod',
    });

    return (
        <StoreLayout title="Checkout">
            <div className="page-header">
                <h1>Checkout</h1>
                <div className="breadcrumb">Home → Cart → Checkout</div>
            </div>

            <div className="checkout-steps">
                <div className="step done">
                    <span className="step-num">✓</span>Cart
                </div>
                <div className="step active">
                    <span className="step-num">2</span>Shipping & Payment
                </div>
                <div className="step">
                    <span className="step-num">3</span>Confirmation
                </div>
            </div>

            <form className="checkout-layout" onSubmit={(event) => event.preventDefault()}>
                <div>
                    <div className="form-section">
                        <h2>Shipping Information</h2>
                        <div className="form-grid">
                            {[
                                ['first_name', 'First Name *'],
                                ['last_name', 'Last Name *'],
                                ['email', 'Email Address *', true],
                                ['phone', 'Phone Number *', true],
                                ['address', 'Street Address *', true],
                                ['city', 'City *'],
                                ['province', 'Province *'],
                                ['zip', 'ZIP Code *'],
                                ['country', 'Country'],
                            ].map(([field, label, full]) => (
                                <div key={field} className={`form-group ${full ? 'full' : ''}`}>
                                    <label>{label}</label>
                                    <input value={data[field]} onChange={(event) => setData(field, event.target.value)} />
                                    {errors[field] ? <small className="error-text">{errors[field]}</small> : null}
                                </div>
                            ))}
                            <div className="form-group full">
                                <label>Delivery Notes (optional)</label>
                                <textarea
                                    value={data.delivery_notes}
                                    onChange={(event) => setData('delivery_notes', event.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Payment Method</h2>
                        <div className="payment-methods">
                            {[
                                ['cod', '💵', 'Cash on Delivery', 'Pay when your order is delivered to your doorstep'],
                                ['bank', '🏦', 'Bank Transfer', 'Transfer via BDO, BPI, Metrobank · simulation only'],
                                ['gcash', '📱', 'GCash / Maya', 'Digital wallet simulation, no real charge'],
                            ].map(([value, icon, title, caption]) => (
                                <label
                                    key={value}
                                    className={`payment-option ${data.payment_method === value ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        checked={data.payment_method === value}
                                        onChange={() => setData('payment_method', value)}
                                    />
                                    <span className="payment-icon">{icon}</span>
                                    <div className="payment-label">
                                        <strong>{title}</strong>
                                        <span>{caption}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="order-summary checkout-summary">
                    <div className="summary-box">
                        <h2>Order Summary</h2>
                        {items.map(({ product, quantity, line_total }) => (
                            <div className="order-item" key={product.id}>
                                <div
                                    className="oi-cover"
                                    style={{ background: product.cover_gradient }}
                                >
                                    {product.cover_emoji}
                                </div>
                                <div className="oi-info">
                                    <div className="oi-title">{product.title}</div>
                                    <div className="oi-author">{product.author}</div>
                                    <div className="oi-qty">Qty: {quantity}</div>
                                </div>
                                <span className="oi-price">{currency(line_total)}</span>
                            </div>
                        ))}
                        <div className="total-rows">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>{currency(subtotal)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping Fee</span>
                                <span style={{ color: '#2a7a2a' }}>FREE</span>
                            </div>
                            <div className="total-row">
                                <span>Tax</span>
                                <span>₱0</span>
                            </div>
                            <div className="total-row grand">
                                <span>Total</span>
                                <span>{currency(total)}</span>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="place-btn" disabled={processing} onClick={() => post('/checkout')}>
                        Place Order →
                    </button>
                    <p className="secure-note">🔒 Your data is encrypted and secure</p>
                </aside>
            </form>
        </StoreLayout>
    );
}
