// resources/js/Pages/Events/Create.jsx
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function CreateEvent() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        instructions: '',
        deadline: '',
        schedule_type: 'single_day',
        event_day: '',
        period_start: '',
        period_end: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            onSuccess: () => toast.success(t('success.eventCreated')),
        });
    };

    const cancel = () => {
        router.visit(route('dashboard'));
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Dashboard', href: route('dashboard') }, { label: 'Creer evenement' }]}>
            <Head title={t('event.create.title')} />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('event.create.title')}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {t('event.create.subtitle')}
                        </p>
                    </div>

                    <Card>
                        <div className="space-y-6">
                            <Input
                                id="title"
                                type="text"
                                label={t('event.create.name')}
                                placeholder={t('event.create.namePlaceholder')}
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                            />

                            <Input
                                id="instructions"
                                type="textarea"
                                label={t('event.create.instructions')}
                                placeholder={t('event.create.instructionsPlaceholder')}
                                value={data.instructions}
                                onChange={(e) => setData('instructions', e.target.value)}
                                error={errors.instructions}
                            />

                            <Input
                                id="deadline"
                                type="datetime-local"
                                label={t('event.create.deadline')}
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                                error={errors.deadline}
                                step="1"
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Format de programme
                                    <select
                                        className="mt-1.5 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white"
                                        value={data.schedule_type}
                                        onChange={(e) => setData('schedule_type', e.target.value)}
                                    >
                                        <option value="single_day">Une seule journee</option>
                                        <option value="multi_day">Plusieurs jours (bootcamp)</option>
                                    </select>
                                </label>
                            </div>

                            {data.schedule_type === 'single_day' ? (
                                <Input
                                    id="event_day"
                                    type="date"
                                    label="Jour de l'evenement"
                                    value={data.event_day}
                                    onChange={(e) => setData('event_day', e.target.value)}
                                    error={errors.event_day}
                                />
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        id="period_start"
                                        type="date"
                                        label="Debut du bootcamp"
                                        value={data.period_start}
                                        onChange={(e) => setData('period_start', e.target.value)}
                                        error={errors.period_start}
                                    />
                                    <Input
                                        id="period_end"
                                        type="date"
                                        label="Fin du bootcamp"
                                        value={data.period_end}
                                        onChange={(e) => setData('period_end', e.target.value)}
                                        error={errors.period_end}
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <Button variant="outline" size="md" onClick={cancel}>
                                    {t('event.create.cancel')}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="md"
                                    loading={processing}
                                    disabled={processing}
                                    onClick={submit}
                                >
                                    {t('event.create.submit')}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </AppLayout>
    );
}
