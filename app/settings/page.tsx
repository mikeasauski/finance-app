"use client";

import { useState } from "react";
import { Trash2, Download, Globe, Palette, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SettingsPage() {
    const { showToast } = useToast();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteType, setDeleteType] = useState<'all' | 'transactions' | 'cards' | null>(null);

    const handleExportData = () => {
        const data = {
            transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
            cards: JSON.parse(localStorage.getItem('finance_cards') || '[]'),
            accounts: JSON.parse(localStorage.getItem('finance_accounts') || '[]'),
            documents: JSON.parse(localStorage.getItem('finance_documents') || '[]'),
            user: JSON.parse(localStorage.getItem('finance_user_profile') || '{}'),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('success', t('backup_success'));
    };

    const handleDelete = () => {
        if (deleteConfirmation !== "DELETAR") {
            showToast('error', t('wrong_confirmation'));
            return;
        }

        if (deleteType === 'all') {
            localStorage.clear();
        } else if (deleteType === 'transactions') {
            localStorage.removeItem('finance_transactions');
        } else if (deleteType === 'cards') {
            localStorage.removeItem('finance_cards');
        }

        showToast('success', t('data_deleted'));
        setTimeout(() => window.location.reload(), 1500);
    };

    const openDeleteModal = (type: 'all' | 'transactions' | 'cards') => {
        setDeleteType(type);
        setDeleteConfirmation("");
        setDeleteModalOpen(true);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{t('settings_title')}</h1>
                <p className="text-gray-500">{t('settings_subtitle')}</p>
            </div>

            {/* Appearance & Language */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Palette size={20} className="text-purple-600" />
                    {t('appearance_language')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('theme')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                {t('light')}
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'dark' ? 'border-gray-800 bg-gray-900 text-white' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                {t('dark')}
                            </button>
                            <button
                                onClick={() => setTheme('entrepreneur')}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === 'entrepreneur' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                {t('entrepreneur')}
                            </button>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none"
                            >
                                <option value="pt">Português (Brasil)</option>
                                <option value="en">English (US)</option>
                                <option value="es">Español</option>
                                <option value="it">Italiano</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Shield size={20} className="text-blue-600" />
                    {t('data_management')}
                </h2>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <h3 className="font-medium text-gray-900">{t('export_backup')}</h3>
                        <p className="text-sm text-gray-500">{t('export_backup_desc')}</p>
                    </div>
                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                        <Download size={18} />
                        {t('export')}
                    </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-red-600 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        {t('danger_zone')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => openDeleteModal('transactions')}
                            className="p-4 text-left border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                            <span className="block font-medium text-red-900 group-hover:text-red-700">{t('delete_transactions')}</span>
                            <span className="text-xs text-red-600/70">{t('delete_transactions_desc')}</span>
                        </button>

                        <button
                            onClick={() => openDeleteModal('cards')}
                            className="p-4 text-left border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                            <span className="block font-medium text-red-900 group-hover:text-red-700">{t('delete_cards')}</span>
                            <span className="text-xs text-red-600/70">{t('delete_cards_desc')}</span>
                        </button>

                        <button
                            onClick={() => openDeleteModal('all')}
                            className="col-span-1 md:col-span-2 p-4 text-left border border-red-200 bg-red-100/50 rounded-xl hover:bg-red-100 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-red-900 font-bold">
                                <Trash2 size={18} />
                                {t('delete_all')}
                            </div>
                            <span className="text-xs text-red-700">{t('delete_all_desc')}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{t('delete_confirmation_title')}</h3>
                            <p className="text-gray-500 mt-2">
                                {t('delete_confirmation_desc')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {t('type_delete_instruction')}
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none uppercase"
                                placeholder="DELETAR"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteConfirmation !== "DELETAR"}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('erase')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
