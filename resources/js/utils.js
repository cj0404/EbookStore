export const currency = (value) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(
        Number(value),
    );

export const ratingStars = (value) => {
    const full = Math.round(Number(value));
    return `${'★'.repeat(full)}${'☆'.repeat(Math.max(0, 5 - full))}`;
};

export const compactDate = (value) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
