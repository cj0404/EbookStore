import { Link, useForm, usePage, router } from '@inertiajs/react';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';
import { currency, ratingStars } from '../../utils';



export default function ProductDetails({ product, relatedProducts }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = !!user?.is_admin;

    const { data, setData, post, processing, errors } = useForm({ quantity: 1 });

    const addToCart = (event) => {
        event.preventDefault();
        console.log('Adding product ID:', product.id, 'quantity:', data.quantity);
        post(`/cart/${product.id}`, {
            onSuccess: () => {
                router.visit('/cart');
            },
            onError: (errors) => {
                console.error('Add to cart error:', errors);
            },
        });
    };

    const errorMessage = Object.values(errors || {}).flat().join(', ') || null;


    return (
        <StoreLayout title={product.title}>
            <div className="breadcrumb-bar">
                <Link href="/">Home</Link> → <Link href="/products">Browse</Link> → {product.title}
            </div>

            <div className="product-section">
                <div className="cover-area">
                    {product.image ? (
                        <div className="book-cover-image">
                            {product.badge ? <span className="cover-badge">{product.badge}</span> : null}
                            <img src={`/images/${product.image}`} alt={product.title} />
                        </div>
                    ) : (
                        <div className={`book-cover ${product.cover_class}`} style={{ background: product.cover_gradient }}>
                            {product.badge ? <span className="cover-badge">{product.badge}</span> : null}
                            {product.cover_emoji}
                        </div>
                    )}
                    <div className="cover-thumbnails">
                        {[product.cover_emoji, '📚', '🏛️'].map((icon, index) => (
                            <div
                                key={`${icon}-${index}`}
                                className={`thumb ${index === 0 ? 'active' : ''}`}
                                style={{ background: product.cover_gradient }}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <div className="genre-tag">
                        {product.genre} · {product.category}
                    </div>
                    <h1 className="product-title">{product.title}</h1>
                    <div className="product-author">by {product.author}</div>
                    <div className="rating-row">
                        <span className="stars">{ratingStars(product.rating)}</span>
                        <span className="rating-count">
                            {product.rating} · {product.review_count.toLocaleString()} reviews
                        </span>
                    </div>
                    <div className="divider-rule" />
                    <div className="price-row">
                        <span className="price-main">{currency(product.price)}</span>
                        {product.original_price ? <span className="price-original">{currency(product.original_price)}</span> : null}
                        {product.original_price ? <span className="price-tag">Sale</span> : null}
                    </div>
                    <div className={`stock-status ${product.stock <= 5 ? 'low' : ''}`}>
                        {product.stock > 0 ? `✓ In Stock — ${product.stock} available` : 'Out of stock'}
                    </div>

                    <div className="meta-grid">
                        <div className="meta-item">
                            <label>Format</label>
                            <span>{product.formats.join(', ')}</span>
                        </div>
                        <div className="meta-item">
                            <label>Pages</label>
                            <span>{product.pages} pages</span>
                        </div>
                        <div className="meta-item">
                            <label>Language</label>
                            <span>{product.language}</span>
                        </div>
                        <div className="meta-item">
                            <label>Published</label>
                            <span>{product.published_label}</span>
                        </div>
                    </div>

                    { !isAdmin ? (
                        <form onSubmit={addToCart}>
                        <div className="qty-row">
                            <label>Quantity:</label>
                            <div className="qty-control">
                                <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                >
                                    −
                                </button>
                                <input
                                    className="qty-input"
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={data.quantity}
                                    onChange={(event) => setData('quantity', Number(event.target.value))}
                                />
                                <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => setData('quantity', Math.min(product.stock, data.quantity + 1))}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                            <div className="btn-row">
                                <button className="btn-primary" disabled={processing || product.stock < 1}>
                                    Add to Cart
                                </button>
                                {errorMessage && (
                                    <div className="error-message" style={{ color: 'var(--error)', fontSize: '14px', margin: '8px 0', padding: '8px', background: 'var(--light-red)', borderRadius: '4px' }}>
                                        {errorMessage}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.post(`/products/${product.slug}/wishlist`);
                                    }}
                                >
                                    ♡ Wishlist
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ margin: '16px 0', padding: '12px', background: 'var(--cream)', borderRadius: 6 }}>
                            <strong>Admin view — actions disabled.</strong>
                        </div>
                    )}

                    <div className="divider-rule" />
                    <div className="description">
                        <h3>About this Book</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>

            <div className="tabs-section">
                <div className="tab-list">
                    <button className="tab-btn active">Synopsis</button>
                    <button className="tab-btn">Book Details</button>
                    <button className="tab-btn">Reviews ({product.review_count.toLocaleString()})</button>
                </div>
                <div className="tab-content active">
                    <p>{product.description}</p>
                </div>
            </div>

            <div className="related">
                <h2>You May Also Enjoy</h2>
                <div className="related-grid">
                    {relatedProducts.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </StoreLayout>
    );
}
