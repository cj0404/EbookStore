import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className={`flash-banner ${flash.error ? 'error' : 'success'}`}>
            {flash.error || flash.success}
        </div>
    );
}
