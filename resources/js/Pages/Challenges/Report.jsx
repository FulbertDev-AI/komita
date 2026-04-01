// resources/js/Pages/Challenges/Report.jsx
import { Head, usePage, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import CountdownTimer from '@/Components/CountdownTimer';
import FileUpload from '@/Components/FileUpload';
import { ClockIcon } from '@heroicons/react/24/outline';
import useCountdown from '@/hooks/useCountdown';

export default function ChallengeReport() {
    const { t } = useTranslation();
    const { challenge = {} } = usePage().props;
    const hasStarted = challenge.start_date
        ? new Date(challenge.start_date) <= new Date()
        : true;

    // Default deadline to 23:59 today
    const deadline = challenge.deadline || '23:59:00';
    const { isExpired } = useCountdown(deadline);

    const { data, setData, post, processing, errors } = useForm({
        content: challenge.today_report?.content || '',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isExpired || !hasStarted) return;
        post(route('challenges.report.submit', challenge.id), {
            onSuccess: () => toast.success(t('success.reportSubmitted')),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Challenge', href: route('challenges.show', challenge.id) }, { label: 'Rapport du jour' }]}>
            <Head title={t('challenge.report.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Challenge info header */}
                    <Card className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {challenge.title || t('challenge.report.title')}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {t('challenge.report.day', {
                                        current: challenge.current_day ?? 1,
                                        total: challenge.duration ?? 30,
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-gray-400" />
                                <CountdownTimer deadline={deadline} />
                            </div>
                        </div>
                    </Card>

                    {/* Report form */}
                    <Card>
                        <div className={`space-y-6 ${(isExpired || !hasStarted) ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {t('challenge.report.title')}
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('challenge.report.deadline')}
                                </p>
                                {challenge.today_report && (
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                                        Rapport du jour deja cree: vous pouvez le modifier jusqu a 23h59.
                                    </p>
                                )}
                            </div>

                            <Input
                                id="content"
                                type="textarea"
                                label={t('challenge.report.content')}
                                placeholder={t('challenge.report.contentPlaceholder')}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={errors.content}
                                className="min-h-[160px]"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {t('challenge.report.file')}
                                </label>
                                <FileUpload
                                    onFileSelect={(file) => setData('file', file)}
                                    error={errors.file}
                                />
                            </div>
                        </div>

                        {!hasStarted && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                                    Ce challenge commencera le {challenge.start_date}.
                                </p>
                            </div>
                        )}

                        {isExpired && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl">
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                    {t('challenge.expired')}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-200 dark:border-slate-700">
                            <Button
                                variant="primary"
                                size="md"
                                loading={processing}
                                disabled={processing || isExpired || !hasStarted}
                                onClick={submit}
                            >
                                {t('challenge.report.submit')}
                            </Button>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </AppLayout>
    );
}
