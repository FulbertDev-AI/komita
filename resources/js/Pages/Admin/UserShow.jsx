import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function AdminUserShow() {
    const { userDetails, userStats, history = [], challenges = [], events = [], notifications = [] } = usePage().props;
    const form = useForm({
        name: userDetails.name || '',
        email: userDetails.email || '',
        role: userDetails.role || 'student',
    });

    const save = (e) => {
        e.preventDefault();
        form.patch(route('admin.users.update', userDetails.id), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Admin', href: route('admin.panel') }, { label: userDetails.name }]}>
            <Head title={`Admin - ${userDetails.name}`} />
            <div className="py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fiche utilisateur</h1>
                        <form onSubmit={save} className="grid md:grid-cols-3 gap-4">
                            <Input id="name" label="Nom" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} error={form.errors.name} />
                            <Input id="email" label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} error={form.errors.email} />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Role
                                <select className="mt-1.5 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm" value={form.data.role} onChange={(e) => form.setData('role', e.target.value)}>
                                    <option value="student">student</option>
                                    <option value="professor">professor</option>
                                    <option value="admin">admin</option>
                                </select>
                            </label>
                            <div className="md:col-span-3 flex justify-end">
                                <Button type="submit" size="sm" loading={form.processing} disabled={form.processing}>Enregistrer</Button>
                            </div>
                        </form>
                    </Card>

                    <div className="grid md:grid-cols-5 gap-4">
                        {Object.entries(userStats || {}).map(([k, v]) => (
                            <Card key={k}>
                                <p className="text-xs uppercase text-gray-500 dark:text-gray-400">{k}</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{v}</p>
                            </Card>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Challenges ({challenges.length})</h2>
                            <div className="space-y-2">
                                {challenges.map((c) => (
                                    <a key={c.id} href={route('challenges.show', c.id)} className="block rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.title}</p>
                                    </a>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Evenements ({events.length})</h2>
                            <div className="space-y-2">
                                {events.map((e) => (
                                    <a key={e.id} href={route('events.show', e.code)} className="block rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.title}</p>
                                    </a>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Historique d'activite</h2>
                        <div className="space-y-2">
                            {history.map((h, idx) => (
                                <div key={idx} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                    <p className="text-sm text-gray-900 dark:text-white">{h.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(h.at).toLocaleString('fr-FR')}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notifications utilisateur</h2>
                        <div className="space-y-2">
                            {notifications.map((n) => (
                                <div key={n.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(n.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

