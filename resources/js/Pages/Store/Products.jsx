import { Link, router } from '@inertiajs/react';
import Pagination from '../../Components/Pagination';
import ProductCard from '../../Components/ProductCard';
import StoreLayout from '../../Layouts/StoreLayout';

export default function Products({ products, filters, categories }) {
    const updateFilter = (next) => {
        router.get('/products', { ...filters, ...next }, { preserveState: true });
    };

    return (
        <StoreLayout title="Browse Books">
            <div className="page-header">
                <h1>The Full Collection</h1>
                <div className="breadcrumb">
                    <Link href="/">Home</Link> → Browse Books
                </div>
            </div>

            <div className="main-content">
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h3>Search</h3>
                        <div className="search-box">
                            <input
                                type="text"
                                defaultValue={filters.search}
                                placeholder="Title, author, keyword…"
                                onKeyDown={(event) =>
                                    event.key === 'Enter' && updateFilter({ search: event.currentTarget.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Genres</h3>
                        <ul className="filter-list">
                            <li
                                className={!filters.category ? 'active' : ''}
                                onClick={() => updateFilter({ category: '' })}
                            >
                                All Books <span className="filter-count">{products.total}</span>
                            </li>
                            {categories.map((category) => (
                                <li
                                    key={category.category}
                                    className={filters.category === category.category ? 'active' : ''}
                                    onClick={() => updateFilter({ category: category.category })}
                                >
                                    {category.category}
                                    <span className="filter-count">{category.total}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="listing-area">
                    <div className="listing-toolbar">
                        <span className="results-count">
                            Showing {products.from ?? 0}–{products.to ?? 0} of {products.total} books
                        </span>
                        <div className="sort-wrap">
                            <label>Sort by:</label>
                            <select value={filters.sort} onChange={(event) => updateFilter({ sort: event.target.value })}>
                                <option value="featured">Featured</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                                <option value="top_rated">Top Rated</option>
                            </select>
                        </div>
                    </div>

                    <div className="products-grid three-col">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <Pagination links={products.links} />
                </main>
            </div>
        </StoreLayout>
    );
}
