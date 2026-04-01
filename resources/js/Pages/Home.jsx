import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, listContainer, listItem } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import {
    RocketLaunchIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowUpRightIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
    const { feed = {}, filters = {} } = usePage().props;
    const challenges = feed.challenges || [];
    const events = feed.events || [];
    const [q, setQ] = useState(filters.q || '');

    const getStatusBadge = (status) => {
        const map = {
            active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
            completed: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
            failed: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
        };
        return map[status] || map.active;
    };

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('home'), { q }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home' }]}>
            <Head title="Home" />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Home
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Challenges et evenements de la communaute
                        </p>

                        <form onSubmit={submitSearch} className="mt-5 flex gap-3">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="home_search"
                                    type="text"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Rechercher un challenge ou un evenement"
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" size="md">Rechercher</Button>
                        </form>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                        <div className="lg:col-span-3">
                            <Card className="p-0 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                    <RocketLaunchIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Challenges recents
                                    </h2>
                                </div>

                                <motion.div variants={listContainer} initial="hidden" animate="show" className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {challenges.length > 0 ? (
                                        challenges.map((challenge) => {
                                            const progress = challenge.duration > 0
                                                ? Math.round((challenge.validated_days / challenge.duration) * 100)
                                                : 0;

                                            return (
                                                <motion.div key={challenge.id} variants={listItem} className="px-6 py-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                {challenge.title}
                                                            </h3>
                                                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                                <UserCircleIcon className="h-4 w-4" />
                                                                {challenge.user?.id ? (
                                                                    <Link href={route('users.show', challenge.user.id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                                        {challenge.user?.name || 'Utilisateur'}
                                                                    </Link>
                                                                ) : (
                                                                    <span>{challenge.user?.name || 'Utilisateur'}</span>
                                                                )}
                                                                <span>•</span>
                                                                <span>{challenge.validated_days}/{challenge.duration} jours</span>
                                                            </div>
                                                        </div>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${getStatusBadge(challenge.status)}`}>
                                                            {challenge.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-600 dark:bg-indigo-400" style={{ width: `${Math.min(progress, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <Link href={route('challenges.show', challenge.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                            Voir details
                                                            <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    ) : (
                                        <div className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                                            Aucun challenge disponible pour le moment.
                                        </div>
                                    )}
                                </motion.div>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="p-0 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
                                    <CalendarDaysIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                        Evenements professeurs
                                    </h2>
                                </div>

                                <motion.div variants={listContainer} initial="hidden" animate="show" className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {events.length > 0 ? (
                                        events.map((event) => (
                                            <motion.div key={event.id} variants={listItem} className="px-6 py-4">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {event.title}
                                                </h3>
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Par {event.user?.id ? (
                                                        <Link href={route('users.show', event.user.id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                            {event.user?.name || 'Professeur'}
                                                        </Link>
                                                    ) : (event.user?.name || 'Professeur')} • {event.submissions_count} soumissions
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Date limite: {new Date(event.deadline).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${event.started_at ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'}`}>
                                                        {event.started_at ? 'Demarre' : 'Candidatures ouvertes'}
                                                    </span>
                                                </div>
                                                <div className="mt-3">
                                                    <Link href={route('events.show', event.code)} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                        Ouvrir l'evenement
                                                        <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                                            Aucun evenement disponible pour le moment.
                                        </div>
                                    )}
                                </motion.div>
                            </Card>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}

