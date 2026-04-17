import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import { currency } from '../../utils';

const emptyProduct = {
    title: '',
    author: '',
    genre: '',
    category: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    badge: '',
    cover_emoji: '📘',
    cover_class: 'b1',
    cover_gradient: 'linear-gradient(135deg,#5c2e0a,#8b4513)',
    pages: 320,
    language: 'English',
    published_label: 'Restored Edition',
    formats: ['ePub', 'PDF', 'MOBI'],
    is_active: true,
};

export default function Products({ products, filters, genres }) {
    const [editing, setEditing] = useState(null);
    const [open, setOpen] = useState(false);
    const form = useForm(emptyProduct);

    const submit = () => {
        // If a file is included, use router to let Inertia send multipart form data
        const hasFile = !!form.data.image_file;

        if (editing) {
            if (hasFile) {
                const payload = { ...form.data };
                // include method override so server treats this as a PATCH
                payload._method = 'PATCH';
                // router.post will convert File objects into FormData
                router.post(`/admin/products/${editing.id}`, payload, { onSuccess: () => setOpen(false) });
                return;
            }

            form.patch(`/admin/products/${editing.id}`, { onSuccess: () => setOpen(false) });
            return;
        }

        if (hasFile) {
            router.post('/admin/products', { ...form.data }, { onSuccess: () => setOpen(false) });
            return;
        }

        form.post('/admin/products', { onSuccess: () => setOpen(false) });
    };

    const openModal = (product = null) => {
        setEditing(product);
        const nextData = product ? { ...product, is_active: !!product.is_active } : emptyProduct;
        Object.entries(nextData).forEach(([key, value]) => form.setData(key, value));
        setOpen(true);
    };

    const updateFilters = (next) => {
        router.get('/admin/products', { ...filters, ...next }, { preserveState: true });
    };

    return (
        <AdminLayout
            title="Product Management"
            active="Products"
            topbarRight={
                <button className="topbar-btn" onClick={() => openModal()}>
                    + Add New Book
                </button>
            }
        >
            <div className="table-toolbar">
                <div className="toolbar-left">
                    <input
                        className="search-input"
                        placeholder="Search title or author…"
                        defaultValue={filters.search}
                        onKeyDown={(event) =>
                            event.key === 'Enter' && updateFilters({ search: event.currentTarget.value })
                        }
                    />
                    <select className="filter-select" value={filters.genre} onChange={(e) => updateFilters({ genre: e.target.value })}>
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                    <select className="filter-select" value={filters.status} onChange={(e) => updateFilters({ status: e.target.value })}>
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <span className="box-tag">{products.total} books total</span>
            </div>

            <div className="products-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Book</th>
                            <th>Genre</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-cell">
                                        <div
                                            className="product-thumb"
                                            style={{ background: product.cover_gradient }}
                                        >
                                            {product.cover_emoji}
                                        </div>
                                        <div>
                                            <div className="product-title">{product.title}</div>
                                            <div className="product-author">{product.author}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="genre-badge">{product.genre}</span>
                                </td>
                                <td className="price-cell">{currency(product.price)}</td>
                                <td className={`stock-cell ${product.stock <= 5 ? 'low' : 'ok'}`}>{product.stock}</td>
                                <td>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={product.is_active}
                                            onChange={() => router.patch(`/admin/products/${product.id}/availability`)}
                                        />
                                        <span className="toggle-slider" />
                                    </label>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="action-btn btn-edit" onClick={() => openModal(product)}>
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn btn-delete"
                                            onClick={() => router.delete(`/admin/products/${product.id}`)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={products.links} />

            <div className={`modal-overlay ${open ? 'open' : ''}`}>
                <div className="modal">
                    <div className="modal-header">
                        <h2>{editing ? 'Edit Book' : 'Add New Book'}</h2>
                        <button className="modal-close" onClick={() => setOpen(false)}>
                            ×
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="modal-grid">
                            {[
                                ['title', 'Title'],
                                ['author', 'Author'],
                                ['genre', 'Genre'],
                                ['category', 'Category'],
                                ['price', 'Price'],
                                ['original_price', 'Original Price'],
                                ['stock', 'Stock'],
                                ['cover_emoji', 'Cover Emoji'],
                                ['pages', 'Pages'],
                                ['language', 'Language'],
                                ['published_label', 'Published Label'],
                                ['badge', 'Badge'],
                            ].map(([field, label]) => (
                                <div className="form-group" key={field}>
                                    <label>{label}</label>
                                    <input value={form.data[field]} onChange={(e) => form.setData(field, e.target.value)} />
                                </div>
                            ))}
                            <div className="form-group full">
                                <label>Description</label>
                                <textarea
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="form-group full">
                                <label>Formats (comma-separated)</label>
                                <input
                                    value={form.data.formats.join(', ')}
                                    onChange={(e) =>
                                        form.setData(
                                            'formats',
                                            e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                                        )
                                    }
                                />
                            </div>
                            <div className="form-group full">
                                <label>Cover Gradient</label>
                                <input
                                    value={form.data.cover_gradient}
                                    onChange={(e) => form.setData('cover_gradient', e.target.value)}
                                />
                            </div>

                            <div className="form-group full">
                                <label>Cover Image</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.[0] ?? null;
                                            form.setData('image_file', file);
                                            form.setData('image', file ? file.name : '');
                                        }}
                                    />
                                    <input
                                        value={form.data.image || ''}
                                        onChange={(e) => form.setData('image', e.target.value)}
                                        placeholder="book.jpg (will be uploaded when selected)"
                                    />
                                    <button
                                        type="button"
                                        className="button-link"
                                        onClick={async () => {
                                            try {
                                                const res = await fetch('/admin/products/images');
                                                const json = await res.json();
                                                if (!json.images || json.images.length === 0) {
                                                    alert('No images available in public/images');
                                                    return;
                                                }
                                                const list = json.images.map((f, i) => `${i + 1}. ${f}`).join('\n');
                                                const input = window.prompt('Available images (type number to select):\n\n' + list + '\n\nNumber:');
                                                if (!input) return;
                                                const idx = parseInt(input, 10) - 1;
                                                if (Number.isNaN(idx) || idx < 0 || idx >= json.images.length) {
                                                    alert('Invalid selection');
                                                    return;
                                                }
                                                form.setData('image', json.images[idx]);
                                            } catch (err) {
                                                alert('Could not load images');
                                            }
                                        }}
                                    >
                                        Browse server
                                    </button>
                                </div>
                                {form.data.image ? <div style={{ marginTop: 8, fontSize: 13 }}>Selected: {form.data.image}</div> : null}
                            </div>

                        </div>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData('is_active', e.target.checked)}
                            />
                            Active / available in store
                        </label>
                    </div>
                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                        <button className="btn-save" onClick={submit} disabled={form.processing}>
                            Save Book
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
