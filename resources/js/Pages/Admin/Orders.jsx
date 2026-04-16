import { router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import { compactDate, currency } from '../../utils';

export default function Orders({ orders, filters, statusCounts }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const updateFilters = (next) => {
        router.get('/admin/orders', { ...filters, ...next }, { preserveState: true });
    };

    return (
        <AdminLayout
            title="Order Management"
            active="Orders"
            topbarRight={<span className="topbar-info">{orders.total} total orders</span>}
        >
            <div className="status-tabs">
                {Object.entries(statusCounts).map(([label, count]) => (
                    <button
                        key={label}
                        className={`status-tab ${(!filters.status && label === 'All Orders') || filters.status === label ? 'active' : ''}`}
                        onClick={() => updateFilters({ status: label === 'All Orders' ? '' : label })}
                    >
                        {label} <span className="tab-count">{count}</span>
                    </button>
                ))}
            </div>

            <div className="table-toolbar">
                <div className="toolbar-left">
                    <input
                        className="search-input"
                        defaultValue={filters.search}
                        placeholder="Search order ID or customer…"
                        onKeyDown={(event) =>
                            event.key === 'Enter' && updateFilters({ search: event.currentTarget.value })
                        }
                    />
                    <select className="filter-select" value={filters.payment} onChange={(e) => updateFilters({ payment: e.target.value })}>
                        <option value="">All Payment Methods</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="GCash / Maya">GCash / Maya</option>
                    </select>
                </div>
                <span className="box-tag">
                    Showing {orders.from ?? 0}–{orders.to ?? 0} of {orders.total}
                </span>
            </div>

            <div className="orders-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Books</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Update Status</th>
                            <th>Date</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.map((order) => (
                            <tr key={order.id}>
                                <td className="order-id">#{order.order_number}</td>
                                <td>
                                    <div className="customer-name">{order.shipping_name}</div>
                                    <div className="customer-email">{order.shipping_email}</div>
                                </td>
                                <td>{order.items.length} books</td>
                                <td className="amount">{currency(order.total)}</td>
                                <td>
                                    <small>{order.payment_method}</small>
                                </td>
                                <td>
                                    <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                                </td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={order.status}
                                        onChange={(event) =>
                                            router.patch(`/admin/orders/${order.id}`, { status: event.target.value })
                                        }
                                    >
                                        {['Pending', 'Paid', 'Shipped', 'Completed'].map((status) => (
                                            <option key={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <small>{compactDate(order.created_at)}</small>
                                </td>
                                <td>
                                    <button className="action-btn btn-edit" onClick={() => setSelectedOrder(order)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={orders.links} />

            <div className={`modal-overlay ${selectedOrder ? 'open' : ''}`}>
                {selectedOrder ? (
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Order Details</h2>
                            <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="order-detail-grid">
                                <div className="detail-section">
                                    <h3>Order Info</h3>
                                    <div className="detail-row">
                                        <span>Order Number</span>
                                        <span>#{selectedOrder.order_number}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Status</span>
                                        <span>{selectedOrder.status}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Payment</span>
                                        <span>{selectedOrder.payment_method}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Date</span>
                                        <span>{compactDate(selectedOrder.created_at)}</span>
                                    </div>
                                </div>
                                <div className="detail-section">
                                    <h3>Shipping</h3>
                                    <div className="detail-row">
                                        <span>Name</span>
                                        <span>{selectedOrder.shipping_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Email</span>
                                        <span>{selectedOrder.shipping_email}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Phone</span>
                                        <span>{selectedOrder.shipping_phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Address</span>
                                        <span>{selectedOrder.shipping_address}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-section">
                                <h3>Items</h3>
                                {selectedOrder.items.map((item) => (
                                    <div className="order-item-row" key={item.id}>
                                        <div className="oi-cover" style={{ background: 'var(--parchment-dark)' }}>
                                            {item.cover_emoji}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="oi-title">{item.product_title}</div>
                                            <div className="oi-author">{item.product_author}</div>
                                        </div>
                                        <div className="oi-qty">Qty: {item.quantity}</div>
                                        <div className="amount">{currency(item.line_total)}</div>
                                    </div>
                                ))}
                                <div className="order-total-summary">
                                    <div className="grand-total">Total: {currency(selectedOrder.total)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </AdminLayout>
    );
}
