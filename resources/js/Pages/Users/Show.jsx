import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';

export default function UserShow() {
    const { profileUser = {}, challenges = [], events = [] } = usePage().props;

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Profil' }]}>
            <Head title={`Profil - ${profileUser.name || ''}`} />
            <div className="py-8 lg:py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {profileUser.first_name || ''} {profileUser.last_name || profileUser.name || ''}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {profileUser.role === 'student' ? 'Etudiant' : profileUser.role === 'professor' ? 'Professeur' : profileUser.role}
                            {profileUser.specialty ? ` en ${profileUser.specialty}` : ''}
                        </p>
                        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                            <p className="text-gray-700 dark:text-gray-300">Email: {profileUser.email || '-'}</p>
                            <p className="text-gray-700 dark:text-gray-300">Contact: {profileUser.contact_phone || '-'}</p>
                            <p className="text-gray-700 dark:text-gray-300">LinkedIn: {profileUser.social_linkedin ? <a className="text-indigo-600 dark:text-indigo-400" href={profileUser.social_linkedin} target="_blank" rel="noreferrer">Voir</a> : '-'}</p>
                            <p className="text-gray-700 dark:text-gray-300">GitHub: {profileUser.social_github ? <a className="text-indigo-600 dark:text-indigo-400" href={profileUser.social_github} target="_blank" rel="noreferrer">Voir</a> : '-'}</p>
                            <p className="text-gray-700 dark:text-gray-300">Instagram: {profileUser.social_instagram ? <a className="text-indigo-600 dark:text-indigo-400" href={profileUser.social_instagram} target="_blank" rel="noreferrer">Voir</a> : '-'}</p>
                        </div>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Challenges</h2>
                            <div className="space-y-2">
                                {challenges.map((c) => (
                                    <Link key={c.id} href={route('challenges.show', c.id)} className="block rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-sm text-gray-900 dark:text-white">
                                        {c.title}
                                    </Link>
                                ))}
                            </div>
                        </Card>
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Evenements</h2>
                            <div className="space-y-2">
                                {events.map((e) => (
                                    <Link key={e.id} href={route('events.show', e.code)} className="block rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-sm text-gray-900 dark:text-white">
                                        {e.title}
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

