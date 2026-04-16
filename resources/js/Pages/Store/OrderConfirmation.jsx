import { Link } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';
import { compactDate, currency } from '../../utils';

export default function OrderConfirmation({ order }) {
    return (
        <StoreLayout title="Order Confirmed">
            <div className="confirm-hero">
                <div className="checkmark">✓</div>
                <div className="confirm-tag">✦ Your order has been received ✦</div>
                <h1>Thank You, Reader!</h1>
                <p>Your books have been secured and are on their way. May they bring you many hours of joy.</p>
            </div>

            <div className="confirm-content">
                <div className="order-number-box">
                    <div>
                        <div className="label">Order Number</div>
                        <div className="value">#{order.order_number}</div>
                    </div>
                    <div>
                        <div className="label">Order Date</div>
                        <div className="value">{compactDate(order.created_at)}</div>
                    </div>
                    <div>
                        <div className="label">Estimated Delivery</div>
                        <div className="value">3 to 5 business days</div>
                    </div>
                    <span className="status-badge">⏳ {order.status}</span>
                </div>

                <div className="details-grid">
                    <div className="detail-box">
                        <h3>Shipping Address</h3>
                        <div className="detail-row">
                            <span>Name</span>
                            <span>{order.shipping_name}</span>
                        </div>
                        <div className="detail-row">
                            <span>Phone</span>
                            <span>{order.shipping_phone}</span>
                        </div>
                        <div className="detail-row">
                            <span>Address</span>
                            <span>{order.shipping_address}</span>
                        </div>
                        <div className="detail-row">
                            <span>City</span>
                            <span>
                                {order.shipping_city}, {order.shipping_province}
                            </span>
                        </div>
                    </div>

                    <div className="detail-box">
                        <h3>Payment Info</h3>
                        <div className="detail-row">
                            <span>Method</span>
                            <span>{order.payment_method}</span>
                        </div>
                        <div className="detail-row">
                            <span>Status</span>
                            <span style={{ color: '#8b3a1f', fontWeight: 700 }}>{order.payment_status}</span>
                        </div>
                        <div className="detail-row">
                            <span>Amount Due</span>
                            <span>{currency(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="order-items-box">
                    <h3>Books Ordered</h3>
                    {order.items.map((item) => (
                        <div className="conf-item" key={item.id}>
                            <div className="ci-cover" style={{ background: `var(--parchment-dark)` }}>
                                {item.cover_emoji}
                            </div>
                            <div className="ci-info">
                                <div className="ci-title">{item.product_title}</div>
                                <div className="ci-author">{item.product_author}</div>
                                <div className="ci-format">
                                    {item.formats.join(' · ')} · Qty: {item.quantity}
                                </div>
                            </div>
                            <span className="ci-price">{currency(item.line_total)}</span>
                        </div>
                    ))}
                    <div className="order-totals">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>{currency(order.subtotal)}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping Fee</span>
                            <span style={{ color: '#2a7a2a' }}>FREE</span>
                        </div>
                        <div className="total-row grand">
                            <span>Total</span>
                            <span>{currency(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="action-row">
                    <Link href="/products" className="btn-primary">
                        Continue Shopping
                    </Link>
                    <Link href="/" className="btn-outline">
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="closing-quote">
                <blockquote>"There is no friend as loyal as a book."</blockquote>
                <cite>— Ernest Hemingway</cite>
            </div>
        </StoreLayout>
    );
}
