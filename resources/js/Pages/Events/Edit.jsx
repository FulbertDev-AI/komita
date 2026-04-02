import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function EditEvent() {
    const { event = {} } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        title: event.title || '',
        instructions: event.instructions || '',
        deadline: event.deadline || '',
        schedule_type: event.schedule_type || 'single_day',
        event_day: event.event_day || '',
        period_start: event.period_start || '',
        period_end: event.period_end || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('events.update', event.code), {
            onSuccess: () => toast.success('Evenement mis a jour.'),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Home', href: route('home') }, { label: 'Evenement', href: route('events.show', event.code) }, { label: 'Modifier' }]}>
            <Head title="Modifier evenement" />

            <motion.div
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                transition={pageTransition.transition}
                className="py-8 lg:py-12"
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Modifier evenement</h1>
                    </div>

                    <Card>
                        <form onSubmit={submit} className="space-y-6">
                            <Input
                                id="title"
                                type="text"
                                label="Titre"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                            />

                            <Input
                                id="instructions"
                                type="textarea"
                                label="Consignes"
                                value={data.instructions}
                                onChange={(e) => setData('instructions', e.target.value)}
                                error={errors.instructions}
                            />

                            <Input
                                id="deadline"
                                type="datetime-local"
                                label="Date limite de candidature"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                                error={errors.deadline}
                                step="1"
                            />

                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Format
                                <select
                                    className="mt-1.5 w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white"
                                    value={data.schedule_type}
                                    onChange={(e) => setData('schedule_type', e.target.value)}
                                >
                                    <option value="single_day">Une seule journee</option>
                                    <option value="multi_day">Plusieurs jours (bootcamp)</option>
                                </select>
                            </label>

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
                                        label="Debut"
                                        value={data.period_start}
                                        onChange={(e) => setData('period_start', e.target.value)}
                                        error={errors.period_start}
                                    />
                                    <Input
                                        id="period_end"
                                        type="date"
                                        label="Fin"
                                        value={data.period_end}
                                        onChange={(e) => setData('period_end', e.target.value)}
                                        error={errors.period_end}
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <Button variant="outline" size="md" onClick={() => router.visit(route('events.show', event.code))}>
                                    Annuler
                                </Button>
                                <Button type="submit" variant="primary" size="md" loading={processing} disabled={processing}>
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </motion.div>
        </AppLayout>
    );
}
