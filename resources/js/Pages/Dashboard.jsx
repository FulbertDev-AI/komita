// resources/js/Pages/Dashboard.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { pageTransition, listContainer, listItem } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import {
    RocketLaunchIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    PlusIcon,
    DocumentTextIcon,
    ClipboardDocumentIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { t } = useTranslation();
    const { auth, challenges = [], events = [], joinedEvents = [], stats = {} } = usePage().props;
    const user = auth.user;
    const role = user.role || 'student';

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const copyLink = (code) => {
        const url = `${window.location.origin}/events/${code}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success(t('dashboard.professor.linkCopied'));
        });
    };

    const getStatusBadge = (status) => {
        const map = {
            active: 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400',
            completed: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400',
            failed: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400',
        };
        return map[status] || map.active;
    };

    const getStatusLabel = (status) => {
        const map = {
            active: t('challenge.status.active'),
            completed: t('challenge.status.completed'),
            failed: t('challenge.status.failed'),
        };
        return map[status] || map.active;
    };

    // Professor view
    if (role === 'professor') {
        const profStatCards = [
            { label: t('dashboard.professor.activeEvents'), value: stats.activeEvents ?? 0, icon: CalendarDaysIcon },
            { label: t('dashboard.professor.totalSubmissions'), value: stats.totalSubmissions ?? 0, icon: DocumentTextIcon },
        ];

        return (
            <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Dashboard' }]}>
                <Head title={t('nav.dashboard')} />
                <motion.div
                    initial={pageTransition.initial}
                    animate={pageTransition.animate}
                    transition={pageTransition.transition}
                    className="py-8 lg:py-12"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {t('dashboard.greeting', { name: user.name })}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                                    {t('dashboard.date', { date: dateStr })}
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                size="md"
                                className="self-start"
                                onClick={() => router.visit(route('events.create'))}
                            >
                                <PlusIcon className="h-4 w-4" />
                                {t('dashboard.professor.createEvent')}
                            </Button>
                        </div>

                        <motion.div variants={listContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-10">
                            {profStatCards.map((stat) => (
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

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('dashboard.professor.myEvents')}
                        </h2>

                        {events.length > 0 ? (
                            <motion.div variants={listContainer} initial="hidden" animate="show" className="space-y-4">
                                {events.map((event) => (
                                    <motion.div key={event.id} variants={listItem}>
                                        <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">{event.title}</h3>
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {t('dashboard.professor.deadline', {
                                                            date: new Date(event.deadline).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                                                        })}
                                                    </span>
                                                    <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full">
                                                        {t('dashboard.professor.submissions', { count: event.submissions_count ?? 0 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Button variant="ghost" size="sm" onClick={() => copyLink(event.code)}>
                                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                                    {t('dashboard.professor.copyLink')}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(route('events.show', event.code))}
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                    Voir evenement
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <Card className="text-center py-16">
                                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 mx-auto mb-5">
                                    <CalendarDaysIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.professor.empty.title')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{t('dashboard.professor.empty.subtitle')}</p>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => router.visit(route('events.create'))}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    {t('dashboard.professor.createEvent')}
                                </Button>
                            </Card>
                        )}
                    </div>
                </motion.div>
            </AppLayout>
        );
    }

    // Student view (default)
    const studentStatCards = [
        { label: t('dashboard.student.activeChallenges'), value: stats.activeChallenges ?? 0, icon: RocketLaunchIcon },
        { label: t('dashboard.student.validatedDays'), value: stats.validatedDays ?? 0, icon: CalendarDaysIcon },
        { label: t('dashboard.student.successRate'), value: `${stats.successRate ?? 0}%`, icon: ChartBarIcon },
    ];

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Dashboard' }]}>
            <Head title={t('nav.dashboard')} />
            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('dashboard.greeting', { name: user.name })}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {t('dashboard.date', { date: dateStr })}
                        </p>
                    </div>

                    <motion.div variants={listContainer} initial="hidden" animate="show" className="grid sm:grid-cols-3 gap-4 lg:gap-6 mb-10">
                        {studentStatCards.map((stat) => (
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

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('dashboard.student.myChallenges')}
                        </h2>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => router.visit(route('challenges.create'))}
                        >
                            <PlusIcon className="h-4 w-4" />
                            {t('challenge.create.title')}
                        </Button>
                    </div>

                    {challenges.length > 0 ? (
                        <motion.div variants={listContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {challenges.map((challenge) => {
                                const progress = challenge.duration > 0
                                    ? Math.round((challenge.validated_days / challenge.duration) * 100)
                                    : 0;
                                return (
                                    <motion.div key={challenge.id} variants={listItem}>
                                        <Card hover className="flex flex-col h-full">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{challenge.title}</h3>
                                                <span className={`inline-flex items-center text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex-shrink-0 ml-3 ${getStatusBadge(challenge.status)}`}>
                                                    {getStatusLabel(challenge.status)}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                                    <span>{t('dashboard.student.progress', { current: challenge.validated_days, total: challenge.duration })}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full mb-2"
                                                    onClick={() => router.visit(route('challenges.show', challenge.id))}
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                    Voir challenge
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => router.visit(route('challenges.report', challenge.id))}
                                                >
                                                    <DocumentTextIcon className="h-4 w-4" />
                                                    {t('dashboard.student.submitReport')}
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <Card className="text-center py-16">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 mx-auto mb-5">
                                <RocketLaunchIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.student.empty.title')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{t('dashboard.student.empty.subtitle')}</p>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => router.visit(route('challenges.create'))}
                            >
                                <PlusIcon className="h-4 w-4" />
                                {t('dashboard.student.empty.cta')}
                            </Button>
                        </Card>
                    )}

                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Mes evenements demarres
                        </h2>
                        {joinedEvents.length > 0 ? (
                            <div className="space-y-3">
                                {joinedEvents.map((event) => (
                                    <Card key={event.id} className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Demarre le {event.started_at ? new Date(event.started_at).toLocaleString('fr-FR') : '-'}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => router.visit(route('events.show', event.code))}>
                                            Voir evenement
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aucun evenement demarre pour lequel vous etes accepte.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
