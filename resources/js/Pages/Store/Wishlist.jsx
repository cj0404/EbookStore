import { router } from '@inertiajs/react';
import StoreLayout from '../../Layouts/StoreLayout';
import ProductCard from '../../Components/ProductCard';
import Pagination from '../../Components/Pagination';
import { Link } from '@inertiajs/react';
import { currency } from '../../utils';

import { Head } from '@inertiajs/react';

export default function Wishlist({ wishlists, cartCount }) {
    return (
        <>
            <Head title="Wishlist" />
            <StoreLayout title="Wishlist" cartCount={cartCount}>
                <div className="page-header">
                    <h1>My Wishlist</h1>
                    <span className="subtitle">{wishlists.total} items</span>
                </div>

{wishlists.data.length === 0 ? (
    <div className="empty-state">
        <span className="empty-icon">💫</span>
        <h3>Your wishlist is empty</h3>
        <p>Click the heart icon on any book to save it here.</p>
        <Link href="/products" className="btn-primary">
            Browse Books
        </Link>
    </div>
) : (

                    <div className="products-grid">
                        {wishlists.data.map(({ product, id }) => (
                            <div key={product.id} className="product-column">
                                <ProductCard product={product} viewOnly={true} />
                                <div className="product-actions">
                                    <button
                                        className="btn-wishlist active"
                                        onClick={() => router.post(`/products/${product.slug}/wishlist`)}
                                    >
                                        Remove ♥
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {wishlists.links && (
                    <Pagination links={wishlists.links} />
                )}
            </StoreLayout>
        </>
    );
}

