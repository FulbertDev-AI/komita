import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { pageTransition, listContainer, listItem } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import {
    UsersIcon,
    RocketLaunchIcon,
    CalendarDaysIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

export default function AdminPanel() {
    const { t } = useTranslation();
    const { stats = {}, users = [], events = [], challenges = [] } = usePage().props;

    const statCards = [
        { label: t('admin.totalUsers'), value: stats.totalUsers ?? 0, icon: UsersIcon },
        { label: t('admin.activeChallenges'), value: stats.activeChallenges ?? 0, icon: RocketLaunchIcon },
        { label: t('admin.activeEvents'), value: stats.activeEvents ?? 0, icon: CalendarDaysIcon },
    ];

    const updateRole = (userId, role) => {
        router.patch(route('admin.users.role', userId), { role }, { preserveScroll: true });
    };

    const toggleBlock = (user) => {
        router.patch(route('admin.users.block', user.id), {}, { preserveScroll: true });
    };

    const deleteUser = (user) => {
        router.delete(route('admin.users.delete', user.id), { preserveScroll: true });
    };

    const deleteEvent = (eventId) => {
        router.delete(route('admin.events.delete', eventId), { preserveScroll: true });
    };

    const deleteChallenge = (challengeId) => {
        router.delete(route('admin.challenges.delete', challengeId), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Admin' }]}>
            <Head title={t('admin.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('admin.title')}
                        </h1>
                    </div>

                    <motion.div variants={listContainer} initial="hidden" animate="show" className="grid sm:grid-cols-3 gap-4 lg:gap-6 mb-10">
                        {statCards.map((stat) => (
                            <motion.div key={stat.label} variants={listItem}>
                                <Card className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex-shrink-0">
                                        <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="grid gap-6">
                        <Card className="overflow-hidden p-0">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Utilisateurs</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-slate-700">
                                            <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-3">Nom</th>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-3">Email</th>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-3">Role</th>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-3.5 text-sm text-gray-900 dark:text-white">{user.name}</td>
                                                <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                                <td className="px-6 py-3.5">
                                                    <select
                                                        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs"
                                                        value={user.role}
                                                        onChange={(e) => updateRole(user.id, e.target.value)}
                                                    >
                                                        <option value="student">student</option>
                                                        <option value="professor">professor</option>
                                                        <option value="admin">admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => router.visit(route('admin.users.show', user.id))}>
                                                            Details
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => toggleBlock(user)}>
                                                            {user.blocked_at ? 'Debloquer' : 'Bloquer'}
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => deleteUser(user)}>
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Evenements recents</h2>
                                <div className="space-y-3">
                                    {events.map((event) => (
                                        <div key={event.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {event.user?.name || 'Prof'} • {event.submissions_count} soumissions
                                            </p>
                                            <div className="mt-2 flex justify-end">
                                                <Button variant="outline" size="sm" onClick={() => deleteEvent(event.id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Challenges recents</h2>
                                <div className="space-y-3">
                                    {challenges.map((challenge) => (
                                        <div key={challenge.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{challenge.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {challenge.user?.name || 'Utilisateur'} • {challenge.reports_count} rapports
                                            </p>
                                            <div className="mt-2 flex justify-end">
                                                <Button variant="outline" size="sm" onClick={() => deleteChallenge(challenge.id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
