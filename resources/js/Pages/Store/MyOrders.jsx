import StoreLayout from '../../Layouts/StoreLayout';
import Pagination from '../../Components/Pagination';
import { compactDate, currency } from '../../utils';

export default function MyOrders({ orders }) {
    return (
        <StoreLayout title="My Orders">
            <div className="page-header">
                <h1>My Orders</h1>
            </div>

            <div className="listing-area">
                <div className="table-toolbar">
                    <span className="box-tag">
                        Showing {orders.from ?? 0}–{orders.to ?? 0} of {orders.total}
                    </span>
                </div>

                <div className="orders-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Items</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id}>
                                        <td className="order-id">#{order.order_number}</td>
                                        <td>
                                            <span className={`status-pill ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <small>{compactDate(order.created_at)}</small>
                                        </td>
                                        <td className="amount">{currency(order.total)}</td>
                                        <td>
                                            <small>{order.payment_method}</small>
                                        </td>
                                        <td>{order.items.length} books</td>
                                        <td>
                                            <button className="action-btn btn-edit">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={orders.links} />
            </div>
        </StoreLayout>
    );
}

