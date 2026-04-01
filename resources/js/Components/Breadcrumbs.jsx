import { Link } from '@inertiajs/react';

export default function Breadcrumbs({ items = [] }) {
    if (!items.length) return null;

    return (
        <nav className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            <ol className="flex items-center gap-1.5 flex-wrap">
                {items.map((item, idx) => (
                    <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
                        {idx > 0 && <span>/</span>}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-gray-700 dark:hover:text-gray-200">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

