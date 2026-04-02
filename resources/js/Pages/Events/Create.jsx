import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '@/config/animations';
import AppLayout from '@/Components/AppLayout';
import Card from '@/Components/Card';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

const emptyProgramItem = () => ({
    day_label: '',
    title: '',
    content: '',
    publish_date: '',
    files: [],
});

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
        program_items: [emptyProgramItem()],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'), {
            forceFormData: true,
            onSuccess: () => toast.success(t('success.eventCreated')),
        });
    };

    const cancel = () => {
        router.visit(route('dashboard'));
    };

    const addProgramItem = () => {
        setData('program_items', [...(data.program_items || []), emptyProgramItem()]);
    };

    const removeProgramItem = (index) => {
        const next = [...(data.program_items || [])];
        next.splice(index, 1);
        setData('program_items', next.length > 0 ? next : [emptyProgramItem()]);
    };

    const updateProgramItem = (index, key, value) => {
        const next = [...(data.program_items || [])];
        next[index] = { ...next[index], [key]: value };
        setData('program_items', next);
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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

                            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Programme initial (flexible)
                                    </h2>
                                    <Button type="button" variant="outline" size="sm" onClick={addProgramItem}>
                                        Ajouter un jour/element
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    Vous pouvez preparer Jour 1, Jour 2, etc. Des fichiers (max 10) peuvent etre attaches a chaque element.
                                </p>

                                <div className="space-y-4">
                                    {(data.program_items || []).map((item, index) => (
                                        <div key={index} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 space-y-3">
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <Input
                                                    id={`program_day_label_${index}`}
                                                    type="text"
                                                    label="Jour"
                                                    placeholder="Ex: Jour 1"
                                                    value={item.day_label || ''}
                                                    onChange={(e) => updateProgramItem(index, 'day_label', e.target.value)}
                                                    error={errors[`program_items.${index}.day_label`]}
                                                />
                                                <Input
                                                    id={`program_publish_date_${index}`}
                                                    type="date"
                                                    label="Date de publication (optionnel)"
                                                    value={item.publish_date || ''}
                                                    onChange={(e) => updateProgramItem(index, 'publish_date', e.target.value)}
                                                    error={errors[`program_items.${index}.publish_date`]}
                                                />
                                            </div>

                                            <Input
                                                id={`program_title_${index}`}
                                                type="text"
                                                label="Titre"
                                                placeholder="Titre de l'element"
                                                value={item.title || ''}
                                                onChange={(e) => updateProgramItem(index, 'title', e.target.value)}
                                                error={errors[`program_items.${index}.title`]}
                                            />

                                            <Input
                                                id={`program_content_${index}`}
                                                type="textarea"
                                                label="Contenu"
                                                placeholder="Consignes, liens, ressources..."
                                                value={item.content || ''}
                                                onChange={(e) => updateProgramItem(index, 'content', e.target.value)}
                                                error={errors[`program_items.${index}.content`]}
                                            />

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                    Fichiers (max 10)
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => updateProgramItem(index, 'files', Array.from(e.target.files || []).slice(0, 10))}
                                                    className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
                                                />
                                                {errors[`program_items.${index}.files`] && (
                                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`program_items.${index}.files`]}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="button" variant="outline" size="sm" onClick={() => removeProgramItem(index)}>
                                                    Supprimer cet element
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
