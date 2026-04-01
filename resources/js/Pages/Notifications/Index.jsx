import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

export default function NotificationsIndex() {
    const { notifications = [], following = [] } = usePage().props;

    const markRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const unfollow = (userId) => {
        router.delete(route('users.unfollow', userId), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Notifications' }]}>
            <Head title="Notifications" />
            <div className="py-8 lg:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h1>

                    <Card className="mb-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                            Etudiants suivis
                        </h2>
                        {following.length > 0 ? (
                            <div className="space-y-2">
                                {following.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => unfollow(u.id)}>
                                            Ne plus suivre
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Vous ne suivez aucun etudiant.</p>
                        )}
                    </Card>

                    <div className="space-y-3">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <Card key={n.id} className={`${n.read_at ? 'opacity-70' : ''}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                            {n.message && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{n.message}</p>
                                            )}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(n.created_at).toLocaleString('fr-FR')}
                                            </p>
                                            {n.url && (
                                                <a href={n.url} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-2 inline-block">
                                                    Ouvrir
                                                </a>
                                            )}
                                        </div>
                                        {!n.read_at && (
                                            <Button variant="outline" size="sm" onClick={() => markRead(n.id)}>
                                                Marquer lu
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aucune notification.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
