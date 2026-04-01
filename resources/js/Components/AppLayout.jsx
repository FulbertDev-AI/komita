// resources/js/Components/AppLayout.jsx
import Navbar from '@/Components/Navbar';
import Toast from '@/Components/Toast';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function AppLayout({ children, breadcrumbs = [] }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <Toast />
            <Navbar />
            <main className="pt-16 lg:pt-18">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <Breadcrumbs items={breadcrumbs} />
                </div>
                {children}
            </main>
        </div>
    );
}
