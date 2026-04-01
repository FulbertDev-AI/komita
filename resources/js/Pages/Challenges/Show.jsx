import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageTransition, listContainer, listItem } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';

export default function ShowChallenge() {
    const { auth, challenge = {} } = usePage().props;
    const user = auth?.user;
    const canCorrect = user && ['professor', 'admin'].includes(user.role);
    const isOwner = user && challenge.owner?.id === user.id;
    const canFollow = user && user.role !== 'admin' && challenge.owner?.role === 'student' && !isOwner;

    const correctionForm = useForm({ content: '' });
    const commentForm = useForm({ content: '' });
    const replyForms = useForm({});

    const progress = challenge.duration > 0
        ? Math.round((challenge.validated_days / challenge.duration) * 100)
        : 0;

    const submitCorrection = (e) => {
        e.preventDefault();
        correctionForm.post(route('challenges.corrections.store', challenge.id), {
            preserveScroll: true,
            onSuccess: () => {
                correctionForm.reset();
                toast.success('Correction publiee.');
            },
        });
    };

    const submitComment = (e) => {
        e.preventDefault();
        commentForm.post(route('challenges.comments.store', challenge.id), {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset();
                toast.success('Commentaire ajoute.');
            },
        });
    };

    const submitReply = (e, correctionId) => {
        e.preventDefault();
        const content = replyForms.data[`reply_${correctionId}`] || '';
        replyForms.transform(() => ({ content })).post(
            route('challenges.corrections.reply', { challenge: challenge.id, correction: correctionId }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    replyForms.setData(`reply_${correctionId}`, '');
                    toast.success('Reponse envoyee.');
                },
            },
        );
    };

    const toggleFollow = () => {
        if (!challenge.owner?.id) return;
        if (challenge.is_following_owner) {
            router.delete(route('users.unfollow', challenge.owner.id), { preserveScroll: true });
        } else {
            router.post(route('users.follow', challenge.owner.id), { challenge_id: challenge.id }, { preserveScroll: true });
        }
    };

    const groupedReports = (challenge.latest_reports || []).reduce((acc, report) => {
        const key = report.report_date || new Date(report.submitted_at).toISOString().slice(0, 10);
        acc[key] = acc[key] || [];
        acc[key].push(report);
        return acc;
    }, {});

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Challenge' }]}>
            <Head title={challenge.title || 'Challenge'} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                            {challenge.title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Par {challenge.owner?.id ? (
                                <Link href={route('users.show', challenge.owner.id)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                    {challenge.owner?.name || 'Utilisateur'}
                                </Link>
                            ) : (challenge.owner?.name || 'Utilisateur')} - Statut: {challenge.status}
                        </p>
                        {canFollow && (
                            <div className="mt-2">
                                <Button variant="outline" size="sm" onClick={toggleFollow}>
                                    {challenge.is_following_owner ? 'Ne plus suivre cet etudiant' : 'Suivre cet etudiant'}
                                </Button>
                            </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Debut: {challenge.start_date}
                        </p>
                        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {challenge.description || 'Aucune description fournie.'}
                        </p>
                        <div className="mt-5">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                <span>{challenge.validated_days}/{challenge.duration} jours valides</span>
                                <span>{Math.min(progress, 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 dark:bg-indigo-400" style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Activite journaliere ({challenge.reports_count || 0})
                            </h2>
                        </div>
                        <div className="px-6 py-4">
                            {Object.keys(groupedReports).length > 0 ? (
                                <div className="space-y-5">
                                    {Object.entries(groupedReports).map(([day, reports]) => (
                                        <div key={day} className="relative pl-6">
                                            <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                            <div className="absolute left-[4px] top-5 bottom-0 w-px bg-gray-200 dark:bg-slate-700" />
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                {day}
                                            </p>
                                            <div className="mt-2 space-y-2">
                                                {reports.map((report) => (
                                                    <div key={report.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {report.author_id ? (
                                                                <Link href={route('users.show', report.author_id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                                    {report.author || 'Utilisateur'}
                                                                </Link>
                                                            ) : (report.author || 'Utilisateur')} - {new Date(report.submitted_at).toLocaleString('fr-FR')}
                                                        </div>
                                                        <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                            {report.content}
                                                        </p>
                                                        {report.file_url && (
                                                            <a href={report.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                                Ouvrir le fichier joint
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Aucun rapport publie pour ce challenge.
                                </p>
                            )}
                        </div>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                                Corrections professeurs
                            </h2>

                            {canCorrect && (
                                <form onSubmit={submitCorrection} className="mb-5">
                                    <Input
                                        id="correction_content"
                                        type="textarea"
                                        value={correctionForm.data.content}
                                        onChange={(e) => correctionForm.setData('content', e.target.value)}
                                        error={correctionForm.errors.content}
                                        placeholder="Ajouter une correction utile pour l'etudiant..."
                                        className="min-h-[110px]"
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <Button type="submit" size="sm" loading={correctionForm.processing} disabled={correctionForm.processing}>
                                            Publier la correction
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {(challenge.corrections || []).length > 0 ? (
                                    challenge.corrections.map((correction) => (
                                        <div key={correction.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {correction.professor_id ? (
                                                    <Link href={route('users.show', correction.professor_id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                        {correction.author || 'Professeur'}
                                                    </Link>
                                                ) : (correction.author || 'Professeur')} - {new Date(correction.created_at).toLocaleString('fr-FR')}
                                            </div>
                                            <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {correction.content}
                                            </p>

                                            {(correction.replies || []).length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {correction.replies.map((reply) => (
                                                        <div key={reply.id} className="rounded-lg bg-gray-50 dark:bg-slate-800 p-2.5">
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {reply.author_id ? (
                                                                    <Link href={route('users.show', reply.author_id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                                        {reply.author}
                                                                    </Link>
                                                                ) : reply.author} - {new Date(reply.created_at).toLocaleString('fr-FR')}
                                                            </p>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                                                                {reply.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {isOwner && (
                                                <form onSubmit={(e) => submitReply(e, correction.id)} className="mt-3">
                                                    <Input
                                                        id={`reply_${correction.id}`}
                                                        type="textarea"
                                                        value={replyForms.data[`reply_${correction.id}`] || ''}
                                                        onChange={(e) => replyForms.setData(`reply_${correction.id}`, e.target.value)}
                                                        placeholder="Repondre au professeur..."
                                                        className="min-h-[75px]"
                                                    />
                                                    <div className="mt-2 flex justify-end">
                                                        <Button type="submit" size="sm">Repondre</Button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Aucune correction pour le moment.
                                    </p>
                                )}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                                Commentaires
                            </h2>

                            {user && (
                                <form onSubmit={submitComment} className="mb-5">
                                    <Input
                                        id="comment_content"
                                        type="textarea"
                                        value={commentForm.data.content}
                                        onChange={(e) => commentForm.setData('content', e.target.value)}
                                        error={commentForm.errors.content}
                                        placeholder="Ecrire un commentaire sur ce challenge..."
                                        className="min-h-[90px]"
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <Button type="submit" size="sm" loading={commentForm.processing} disabled={commentForm.processing}>
                                            Commenter
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {(challenge.comments || []).length > 0 ? (
                                    challenge.comments.map((comment) => (
                                        <div key={comment.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {comment.author_id ? (
                                                    <Link href={route('users.show', comment.author_id)} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                                        {comment.author || 'Utilisateur'}
                                                    </Link>
                                                ) : (comment.author || 'Utilisateur')} ({comment.author_role || 'user'}) - {new Date(comment.created_at).toLocaleString('fr-FR')}
                                            </div>
                                            <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Aucun commentaire pour le moment.
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
