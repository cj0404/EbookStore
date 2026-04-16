import { Link } from '@inertiajs/react';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Home({ featuredProducts, categories }) {
    return (
        <StoreLayout title="DustyPages">
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-ornament" />
                <div className="hero-content">
                    <span className="hero-tag">Rare & Beloved eBooks</span>
                    <h1 className="hero-title">
                        Where Old Stories Find <em>New Readers</em>
                    </h1>
                    <p className="hero-desc">
                        Step into a curated collection of timeless literature, rare manuscripts, 
                        and beloved classics — delivered instantly to your device in beautifully formatted eBook editions.
                    </p>
                    <div className="hero-btns">
                        <Link href="/products" className="btn-primary">
                            Shop Now
                        </Link>
                        <Link href="/products?category=Classic%20Literature" className="btn-outline">
                            Explore Classics
                        </Link>
                    </div>
                </div>
                <div className="hero-books">
                    {[
                        ['Great Expectations', '#5c2e0a'],
                        ['Jane Eyre', '#2a1a4a'],
                        ['Moby Dick', '#1a3a2a'],
                    ].map(([title, color]) => (
                        <div key={title} className="book-spine" style={{ background: color, height: '360px' }}>
                            <span>{title}</span>
                        </div>
                    ))}
                </div>
                
            </section>

            <div className="ornamental-divider">✦ ✦ ✦</div>

            <section className="featured">
                <div className="section-header">
                    <h2>Featured Titles</h2>
                    <div className="section-rule" />
                    <p>Hand-picked from our deepest shelves, dusted off just for you.</p>
                </div>
                <div className="products-grid four-col">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <section className="categories">
                <div className="section-header">
                    <h2>Category Highlights</h2>
                    <div className="section-rule" />
                    <p>Browse the shelves by literary mood and tradition</p>
                </div>
                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.category}
                            href={`/products?category=${encodeURIComponent(category.category)}`}
                            className="cat-card"
                        >
                            <span className="cat-icon">📚</span>
                            <h3>{category.category}</h3>
                            <p>{category.total} books available</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="cta-section">
                <div className="section-header">
                    <h2>Start Your Collection</h2>
                    <div className="section-rule" />
                    <p>Build a library of enduring voices, one restored classic at a time.</p>
                </div>
                <div className="action-row">
                    <Link href="/products" className="btn-primary">
                        Shop Now
                    </Link>
                </div>
            </section>
        </StoreLayout>
    );
}
