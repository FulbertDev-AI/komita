import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import GuestLayout from '@/Components/GuestLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import CountdownTimer from '@/Components/CountdownTimer';
import FileUpload from '@/Components/FileUpload';
import useCountdown from '@/hooks/useCountdown';
import {
    CalendarDaysIcon,
    ClockIcon,
    DocumentTextIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';

export default function ShowEvent() {
    const { t } = useTranslation();
    const { auth, event = {} } = usePage().props;
    const user = auth?.user;

    const deadline = event.deadline || new Date().toISOString();
    const { isExpired } = useCountdown(deadline);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        file: null,
    });
    const hasSubmitted = Boolean(event.my_submission);
    const canCancel = event.my_submission?.status === 'pending';
    const canManage = Boolean(event.can_manage);
    const submissions = event.submissions || [];
    const isStarted = Boolean(event.is_started);
    const myStatus = event.my_submission?.status || null;
    const isAccepted = myStatus === 'accepted';
    const elements = event.elements || [];
    const [reviewingId, setReviewingId] = useState(null);
    const elementForm = useForm({
        title: '',
        content: '',
        files: [],
        publish_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isExpired || !user) return;
        post(route('events.submit', event.code), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('success.submissionSent'));
                reset();
            },
        });
    };

    const cancelSubmission = () => {
        router.delete(route('events.submission.cancel', event.code), {
            preserveScroll: true,
            onSuccess: () => toast.success('Soumission annulee.'),
        });
    };

    const reviewSubmission = (submissionId, decision) => {
        setReviewingId(submissionId);
        router.patch(route('events.submissions.review', { event: event.code, submission: submissionId }), {
            decision,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(
                decision === 'accepted'
                    ? 'Soumission acceptee.'
                    : decision === 'removed'
                        ? 'Participant retire.'
                        : 'Soumission declinee.',
            ),
            onFinish: () => setReviewingId(null),
        });
    };

    const startEvent = () => {
        router.patch(route('events.start', event.code), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Evenement demarre.'),
        });
    };

    const publishElement = (e) => {
        e.preventDefault();
        elementForm.post(route('events.elements.store', event.code), {
            preserveScroll: true,
            onSuccess: () => {
                elementForm.reset();
                toast.success('Element publie.');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title={event.title || t('nav.events')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="min-h-screen pt-24 pb-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer" onClick={() => router.visit(user ? route('home') : '/')}>Home</span>
                        <span className="mx-1">/</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium">Evenement</span>
                    </div>

                    <Card className="mb-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex-shrink-0">
                                <CalendarDaysIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{event.title}</h1>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('event.show.deadline')}:</span>
                                    <CountdownTimer deadline={deadline} />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        ({new Date(deadline).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })})
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('event.show.instructions')}</h2>
                            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{event.instructions}</p>
                            </div>
                        </div>
                    </Card>

                    {!user ? (
                        <Card className="text-center py-12">
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 mx-auto mb-4">
                                <LockClosedIcon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-base font-medium text-gray-900 dark:text-white mb-1">{t('event.show.loginRequired')}</p>
                            <div className="mt-5">
                                <Link href={route('login')} className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200">
                                    {t('event.show.loginButton')}
                                </Link>
                            </div>
                        </Card>
                    ) : canManage ? (
                        <Card>
                            <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-5">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Pilotage de l'evenement</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Candidatures jusqu'au {new Date(deadline).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {event.schedule_type === 'multi_day'
                                        ? `Bootcamp: du ${event.period_start || '-'} au ${event.period_end || '-'}`
                                        : `Jour de l'evenement: ${event.event_day || '-'}`}
                                </p>
                                {!isStarted ? (
                                    <div className="mt-3">
                                        <Button variant="primary" size="sm" disabled={!event.can_start} onClick={startEvent}>Demarrer l'evenement</Button>
                                        {!event.can_start && (
                                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">Le demarrage est possible apres la fin de la periode de candidature.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-2">Evenement demarre.</p>
                                )}
                            </div>

                            {isStarted && (
                                <div className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Publier un element du programme</h3>
                                    <form onSubmit={publishElement} className="space-y-3">
                                        <Input id="element_title" type="text" value={elementForm.data.title} onChange={(e) => elementForm.setData('title', e.target.value)} error={elementForm.errors.title} placeholder="Titre de l'element" />
                                        <Input id="element_content" type="textarea" value={elementForm.data.content} onChange={(e) => elementForm.setData('content', e.target.value)} error={elementForm.errors.content} placeholder="Details, liens, consignes..." />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fichiers joints (max 10 par element)</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => elementForm.setData('files', Array.from(e.target.files || []).slice(0, 10))}
                                                className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
                                            />
                                            {elementForm.errors.files && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{elementForm.errors.files}</p>}
                                            {elementForm.errors['files.0'] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{elementForm.errors['files.0']}</p>}
                                        </div>
                                        <Input id="publish_date" type="date" value={elementForm.data.publish_date} onChange={(e) => elementForm.setData('publish_date', e.target.value)} error={elementForm.errors.publish_date} />
                                        <div className="flex justify-end">
                                            <Button type="submit" size="sm" loading={elementForm.processing} disabled={elementForm.processing}>Publier</Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Soumissions recues</h2>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{submissions.length} total</span>
                            </div>

                            {submissions.length > 0 ? (
                                <div className="space-y-3">
                                    {submissions.map((submission) => (
                                        <div key={submission.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                                <div>
                                                    {submission.user?.id ? (
                                                        <Link href={route('users.show', submission.user.id)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                            {submission.user?.name || 'Utilisateur'}
                                                        </Link>
                                                    ) : (
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{submission.user?.name || 'Utilisateur'}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{submission.user?.email || 'Email non disponible'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-300">{submission.status || 'pending'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('fr-FR') : ''}</p>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.content}</p>

                                            {submission.file_url && (
                                                <div className="mt-3">
                                                    <a href={submission.file_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                        Ouvrir le fichier joint
                                                    </a>
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-center justify-end gap-2">
                                                {submission.status === 'accepted' ? (
                                                    <Button variant="outline" size="sm" disabled={reviewingId === submission.id} onClick={() => reviewSubmission(submission.id, 'removed')}>Retirer</Button>
                                                ) : (
                                                    <>
                                                        <Button variant="outline" size="sm" disabled={reviewingId === submission.id || submission.status !== 'pending'} onClick={() => reviewSubmission(submission.id, 'declined')}>Decliner</Button>
                                                        <Button variant="primary" size="sm" disabled={reviewingId === submission.id || submission.status !== 'pending'} onClick={() => reviewSubmission(submission.id, 'accepted')}>Accepter</Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Aucune soumission pour le moment.</p>
                            )}
                        </Card>
                    ) : isStarted ? (
                        isAccepted ? (
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contenu de l'evenement</h2>
                                {elements.length > 0 ? (
                                    <div className="space-y-3">
                                        {elements.map((el) => (
                                            <div key={el.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{el.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{el.publish_date || 'Date non precisee'} - {el.author || 'Professeur'}</p>
                                                {el.content && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{el.content}</p>}
                                                {el.file_url && (
                                                    <a href={el.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                        Ouvrir le fichier joint {el.file_mime ? `(${el.file_mime})` : ''}
                                                    </a>
                                                )}
                                                {(el.files || []).length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {el.files.map((f) => (
                                                            <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                                Ouvrir: {f.name || 'fichier'} {f.mime ? `(${f.mime})` : ''}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Le programme n'a pas encore ete publie.</p>
                                )}
                            </Card>
                        ) : (
                            <Card className="text-center py-12">
                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
                                    <LockClosedIcon className="h-7 w-7 text-slate-500 dark:text-slate-300" />
                                </div>
                                <p className="text-base font-medium text-gray-900 dark:text-white mb-1">Cet evenement est en cours et reserve aux candidats acceptes.</p>
                            </Card>
                        )
                    ) : hasSubmitted ? (
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Votre soumission</h2>
                            <div className={`rounded-xl border px-4 py-3 mb-6 ${
                                myStatus === 'accepted'
                                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30'
                                    : myStatus === 'declined'
                                        ? 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30'
                                        : 'border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/30'
                            }`}>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {myStatus === 'accepted'
                                        ? 'Votre candidature a ete acceptee.'
                                        : myStatus === 'declined'
                                            ? 'Votre candidature a ete declinee.'
                                            : myStatus === 'removed'
                                                ? 'Votre acces a ete retire par le professeur.'
                                                : 'Votre soumission est en cours d evaluation.'}
                                </p>
                                {event.my_submission?.submitted_at && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Envoyee le {new Date(event.my_submission.submitted_at).toLocaleString('fr-FR')}</p>
                                )}
                            </div>
                            {canCancel && (
                                <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <Button variant="outline" size="md" onClick={cancelSubmission}>Annuler</Button>
                                </div>
                            )}
                        </Card>
                    ) : isExpired ? (
                        <Card className="text-center py-12">
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 mx-auto mb-4">
                                <LockClosedIcon className="h-7 w-7 text-red-500 dark:text-red-400" />
                            </div>
                            <p className="text-base font-medium text-gray-900 dark:text-white mb-1">Les candidatures sont cloturees. En attente du demarrage de l evenement.</p>
                        </Card>
                    ) : (
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">{t('event.show.content')}</h2>

                            <div className="space-y-6">
                                <Input id="content" type="textarea" placeholder={t('event.show.contentPlaceholder')} value={data.content} onChange={(e) => setData('content', e.target.value)} error={errors.content} className="min-h-[160px]" />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('event.show.file')}</label>
                                    <FileUpload onFileSelect={(file) => setData('file', file)} error={errors.file} />
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <Button variant="primary" size="md" loading={processing} disabled={processing} onClick={submit}>
                                        <DocumentTextIcon className="h-4 w-4" />
                                        {t('event.show.submit')}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </motion.div>
        </GuestLayout>
    );
}
