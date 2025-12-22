"use client";

import React from "react";
import { Plane, Car, Plus, Home, Star, Shield, Target } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageContext";

import { useRouter } from "next/navigation";

export default function GoalsWidget() {
    const router = useRouter();
<<<<<<< HEAD
    const { t, locale } = useLanguage();
    const { goals } = useFinance();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'plane': return <Plane size={24} />;
            case 'car': return <Car size={24} />;
            case 'home': return <Home size={24} />;
            case 'star': return <Star size={24} />;
            case 'shield': return <Shield size={24} />;
            case 'target': return <Target size={24} />;
            default: return <Target size={24} />;
        }
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'orange': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' };
            case 'blue': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-600' };
            case 'green': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-600' };
            case 'purple': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-600' };
            case 'red': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-600' };
            default: return { bg: 'bg-muted', text: 'text-muted-foreground', bar: 'bg-muted-foreground' };
        }
    };
=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
<<<<<<< HEAD
                <h3 className="font-semibold text-foreground">{t('my_goals')}</h3>
                <button
                    onClick={() => router.push('/planning')}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                    title={t('manage_goals')}
                >
                    <Plus size={20} className="text-primary" />
=======
                <h3 className="font-semibold text-gray-800">Meus Objetivos</h3>
                <button
                    onClick={() => router.push('/planning')}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Gerenciar Objetivos"
                >
                    <Plus size={20} className="text-blue-600" />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
            </div>

            <div className="space-y-4">
                {goals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl border border-dashed border-border">
                        <p>{t('no_goals_yet') || "No goals yet"}</p>
                        <button
                            onClick={() => router.push('/planning')}
                            className="text-primary font-medium mt-2 hover:underline"
                        >
                            {t('create_goal') || "Create one"}
                        </button>
                    </div>
                ) : (
                    goals.map(goal => {
                        const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                        const colors = getColorClasses(goal.color);

                        return (
                            <div key={goal.id} className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-center gap-4">
                                <div className={`p-3 ${colors.bg} ${colors.text} rounded-xl`}>
                                    {getIcon(goal.icon)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-foreground">{goal.name}</h4>
                                        <span className={`text-sm font-bold ${colors.text}`}>{percentage}%</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD', maximumFractionDigits: 0 }).format(goal.currentAmount)}
                                        {' '}{t('of')}{' '}
                                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD', maximumFractionDigits: 0 }).format(goal.targetAmount)}
                                    </p>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className={`h-full ${colors.bar}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
