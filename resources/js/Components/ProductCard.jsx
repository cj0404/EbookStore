import { Link } from '@inertiajs/react';
import { currency, ratingStars } from '../utils';

export default function ProductCard({ product }) {
    return (
        <Link href={`/products/${product.slug}`} className="product-card">
            {product.badge ? <span className="card-badge">{product.badge}</span> : null}
            <div
                className={`card-img-placeholder ${product.cover_class}`}
                style={{ background: product.cover_gradient }}
            >
                <div className="card-overlay">
                    <span className="card-overlay-btn">View Book</span>
                </div>
                {product.cover_emoji}
            </div>
            <div className="card-body">
                <div className="card-genre">{product.genre}</div>
                <div className="card-title">{product.title}</div>
                <div className="card-author">{product.author}</div>
                <div className="card-footer">
                    <span className="card-price">{currency(product.price)}</span>
                    <span className="card-rating">{ratingStars(product.rating)}</span>
                </div>
            </div>
        </Link>
    );
}
