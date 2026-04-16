import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { compactDate, currency } from '../../utils';

export default function Dashboard({ stats, monthlySales, lowStockProducts, recentOrders }) {
    const maxSale = Math.max(...monthlySales.map((month) => month.value), 1);

    return (
        <AdminLayout
            title="Dashboard Overview"
            active="Dashboard"
            topbarRight={
                <>
                    <span className="topbar-date">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                    <Link href="/admin/products" className="topbar-btn">
                        + Add Book
                    </Link>
                </>
            }
        >
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-label">Total Sales</div>
                    <div className="stat-value">{currency(stats.sales)}</div>
                    <div className="stat-change">Live seeded store total</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon">📦</div>
                    <div className="stat-label">Total Orders</div>
                    <div className="stat-value">{stats.orders}</div>
                    <div className="stat-change">All recorded orders</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">👥</div>
                    <div className="stat-label">Total Customers</div>
                    <div className="stat-value">{stats.customers}</div>
                    <div className="stat-change">Registered readers</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon">📚</div>
                    <div className="stat-label">Books Available</div>
                    <div className="stat-value">{stats.products}</div>
                    <div className="stat-change down">⚠ {lowStockProducts.length} low stock alerts</div>
                </div>
            </div>

            <div className="content-row">
                <div className="chart-box">
                    <div className="box-header">
                        <h3>Monthly Sales</h3>
                        <span className="box-tag">Year 2024</span>
                    </div>
                    <div className="chart-bars">
                        {monthlySales.map((month) => (
                            <div className="chart-col" key={month.label}>
                                <div className="bar" style={{ height: `${(month.value / maxSale) * 100}%` }} />
                                <div className="bar-label">{month.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-box">
                    <div className="box-header">
                        <h3>⚠ Low Stock Alerts</h3>
                    </div>
                    {lowStockProducts.map((product) => (
                        <div className="alert-item" key={product.id}>
                            <div className={`alert-dot ${product.stock <= 2 ? 'red' : 'yellow'}`} />
                            <div className="alert-info">
                                <div className="alert-title">{product.title}</div>
                                <div className="alert-sub">{product.author}</div>
                            </div>
                            <span className={`alert-stock ${product.stock <= 2 ? 'critical' : 'warn'}`}>
                                {product.stock} left
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="orders-box">
                <div className="box-header">
                    <h3>Recent Orders</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="order-id">#{order.order_number}</td>
                                <td>{order.shipping_name}</td>
                                <td>
                                    <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                                </td>
                                <td>{currency(order.total)}</td>
                                <td>{compactDate(order.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
