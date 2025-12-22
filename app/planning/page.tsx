"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Target, ShieldAlert, Plus, Edit2, Trash2, Plane, Car, Home, Star, Shield, History, PlusCircle, Calendar } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Goal } from "@/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PlanningPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'debts' | 'investments' | 'goals'>('debts');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{t('planning_title')}</h1>
                <p className="text-muted-foreground">{t('planning_subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-muted rounded-xl w-full md:w-fit">
                <button
                    onClick={() => setActiveTab('debts')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'debts' ? "bg-card text-red-600 dark:text-red-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ShieldAlert size={18} />
                    {t('debt_management')}
                </button>
                <button
                    onClick={() => setActiveTab('investments')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'investments' ? "bg-card text-green-600 dark:text-green-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <TrendingUp size={18} />
                    {t('investments')}
                </button>
                <button
                    onClick={() => setActiveTab('goals')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'goals' ? "bg-card text-blue-600 dark:text-blue-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Target size={18} />
                    {t('life_goals')}
                </button>
            </div>

            {/* Content */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border min-h-[400px]">
                {activeTab === 'debts' && <DebtManager />}
                {activeTab === 'investments' && <InvestmentSimulator />}
                {activeTab === 'goals' && <GoalsPlanner />}
            </div>
        </div>
    );
}

// --- Subcomponents ---

function DebtManager() {
    const { t, locale } = useLanguage();
    const [debts, setDebts] = useState<{ id: string; name: string; amount: number; interest: number }[]>([]);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [interest, setInterest] = useState("");

    const addDebt = () => {
        if (!name || !amount) {
            alert(t('fill_all_fields') || "Por favor, preencha todos os campos.");
            return;
        }
        setDebts([...debts, { id: crypto.randomUUID(), name, amount: Number(amount), interest: Number(interest) }]);
        setName("");
        setAmount("");
        setInterest("");
    };

    const removeDebt = (id: string) => {
        setDebts(debts.filter(d => d.id !== id));
    };

    const totalDebt = debts.reduce((acc, d) => acc + d.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">{t('add_debt')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder={t('debt_name_placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 border border-border bg-background rounded-lg text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            type="number"
                            placeholder={t('value_placeholder')}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="p-2 border border-border bg-background rounded-lg text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                            type="number"
                            placeholder={t('interest_monthly_placeholder')}
                            value={interest}
                            onChange={(e) => setInterest(e.target.value)}
                            className="p-2 border border-border bg-background rounded-lg text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <button
                        onClick={addDebt}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Plus size={18} /> {t('add')}
                    </button>
                </div>

                <div className="w-full md:w-64 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{t('total_debts')}</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(totalDebt)}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{t('snowball_strategy')}</h3>
                <p className="text-sm text-muted-foreground">{t('snowball_desc')}</p>

                {debts.length === 0 ? (
                    <p className="text-muted-foreground italic py-4">{t('no_debts')}</p>
                ) : (
                    <div className="space-y-2">
                        {debts.sort((a, b) => a.amount - b.amount).map((debt, index) => (
                            <div key={debt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{debt.name}</p>
                                        <p className="text-xs text-muted-foreground">{debt.interest}{t('interest_rate_month')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-foreground">
                                        {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(debt.amount)}
                                    </span>
                                    <button onClick={() => removeDebt(debt.id)} className="text-muted-foreground hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function InvestmentSimulator() {
    const { t, locale } = useLanguage();
    const [initial, setInitial] = useState("1000");
    const [monthly, setMonthly] = useState("500");
    const [rate, setRate] = useState("10"); // Annual
    const [years, setYears] = useState("10");

    const calculateResult = () => {
        const p = Number(initial);
        const pm = Number(monthly);
        const r = Number(rate) / 100 / 12; // Monthly rate
        const n = Number(years) * 12; // Months

        // FV = P * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
        const futureValue = p * Math.pow(1 + r, n) + pm * ((Math.pow(1 + r, n) - 1) / r);
        const totalInvested = p + (pm * n);
        const totalInterest = futureValue - totalInvested;

        return { futureValue, totalInvested, totalInterest };
    };

    const result = calculateResult();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Calculator size={20} className="text-green-600 dark:text-green-400" />
                        {t('compound_interest_sim')}
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-muted-foreground">{t('initial_investment')}</label>
                            <input type="number" value={initial} onChange={e => setInitial(e.target.value)} className="w-full p-2 border border-border bg-background rounded-lg text-foreground" />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">{t('monthly_contribution')}</label>
                            <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="w-full p-2 border border-border bg-background rounded-lg text-foreground" />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">{t('interest_rate_year')}</label>
                            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2 border border-border bg-background rounded-lg text-foreground" />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">{t('time_years')}</label>
                            <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full p-2 border border-border bg-background rounded-lg text-foreground" />
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/30 flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">{t('total_accumulated')}</p>
                        <p className="text-4xl font-bold text-green-800 dark:text-green-300">
                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(result.futureValue)}
                        </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-green-200 dark:border-green-800/30">
                        <div className="flex justify-between text-sm">
                            <span className="text-green-700 dark:text-green-400">{t('total_invested')}</span>
                            <span className="font-bold text-green-800 dark:text-green-300">{new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(result.totalInvested)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-green-700 dark:text-green-400">{t('yield_interest')}</span>
                            <span className="font-bold text-green-600 dark:text-green-400">+{new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(result.totalInterest)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GoalsPlanner() {
    const { t, locale } = useLanguage();
    const { goals, addGoal, updateGoal, removeGoal, addTransaction, transactions, accounts } = useFinance();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    // Deposit Modal State
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [depositAmount, setDepositAmount] = useState("");
    const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    // History Modal State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Goal Form State
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [icon, setIcon] = useState<Goal['icon']>('target');
    const [color, setColor] = useState("blue");

    const resetForm = () => {
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        setIcon("target");
        setColor("blue");
        setEditingGoal(null);
        setIsFormOpen(false);
    };

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setName(goal.name);
        setTargetAmount(String(goal.targetAmount));
        setCurrentAmount(String(goal.currentAmount));
        setIcon(goal.icon);
        setColor(goal.color);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm(t('confirm_delete_goal') || "Are you sure?")) {
            removeGoal(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const goalData: Goal = {
            id: editingGoal ? editingGoal.id : crypto.randomUUID(),
            name,
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount),
            icon,
            color,
            deadline: editingGoal?.deadline
        };

        if (editingGoal) {
            updateGoal(goalData);
        } else {
            addGoal(goalData);
        }

        resetForm();
    };

    const handleOpenDeposit = (goalId: string) => {
        setSelectedGoalId(goalId);
        setDepositAmount("");
        setDepositDate(new Date().toISOString().split('T')[0]);
        // Default to first account if available
        if (accounts.length > 0) {
            setSelectedAccountId(accounts[0].id);
        }
        setIsDepositOpen(true);
    };

    const handleDepositSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGoalId || !depositAmount || !selectedAccountId) {
            alert(t('select_account_required') || "Please select an account");
            return;
        }

        const goal = goals.find(g => g.id === selectedGoalId);
        if (!goal) return;

        const account = accounts.find(a => a.id === selectedAccountId);
        if (!account) return;

        const amount = Number(depositAmount);

        // Create transaction linked to goal
        addTransaction({
            id: crypto.randomUUID(),
            description: `${t('deposit_to') || 'Deposit to'} ${goal.name}`,
            amount: amount,
            type: 'expense', // Money leaving "wallet" to "goal"
            subType: 'daily',
            context: account.context,
            category: 'Investments', // Or 'Savings'
            date: depositDate,
            paymentMethod: 'debit', // Assume debit/account for now
            status: 'paid',
            isPaid: true,
            goalId: selectedGoalId,
            accountId: selectedAccountId
        });

        setIsDepositOpen(false);
    };

    const handleOpenHistory = (goalId: string) => {
        setSelectedGoalId(goalId);
        setIsHistoryOpen(true);
    };

    const getGoalTransactions = (goalId: string) => {
        return transactions.filter(t => t.goalId === goalId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

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

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                        <Target className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{t('life_goals')}</h3>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    {t('new_goal') || "New Goal"}
                </button>
            </div>

            {/* Deposit Modal */}
            {isDepositOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card p-6 rounded-2xl w-full max-w-md shadow-xl border border-border">
                        <h4 className="font-semibold text-foreground mb-4">{t('add_value') || "Add Value"}</h4>
                        <form onSubmit={handleDepositSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('amount')}</label>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={e => setDepositAmount(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('date')}</label>
                                <input
                                    type="date"
                                    value={depositDate}
                                    onChange={e => setDepositDate(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('source_account') || "Source Account"}</label>
                                <select
                                    value={selectedAccountId}
                                    onChange={e => setSelectedAccountId(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                    required
                                >
                                    <option value="" disabled>{t('select_account') || "Select an account"}</option>
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} ({new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(acc.balance)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDepositOpen(false)}
                                    className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg text-sm font-medium"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                >
                                    {t('confirm') || "Confirm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {isHistoryOpen && selectedGoalId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card p-6 rounded-2xl w-full max-w-md shadow-xl max-h-[80vh] flex flex-col border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-foreground">{t('history') || "History"}</h4>
                            <button onClick={() => setIsHistoryOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {getGoalTransactions(selectedGoalId).length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">{t('no_transactions_found')}</p>
                            ) : (
                                getGoalTransactions(selectedGoalId).map(t => (
                                    <div key={t.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                                        <div>
                                            <p className="font-medium text-foreground">{t.description}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-green-600">
                                            + {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(t.amount)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h4 className="font-semibold text-foreground mb-4">{editingGoal ? (t('edit_goal') || "Edit Goal") : (t('new_goal') || "New Goal")}</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">{t('goal_name') || "Goal Name"}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('target_amount') || "Target Amount"}</label>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={e => setTargetAmount(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('current_amount') || "Current Amount"}</label>
                                <input
                                    type="number"
                                    value={currentAmount}
                                    onChange={e => setCurrentAmount(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('icon') || "Icon"}</label>
                                <select
                                    value={icon}
                                    onChange={e => setIcon(e.target.value as any)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                >
                                    <option value="target">{t('icon_target')}</option>
                                    <option value="plane">{t('icon_plane')}</option>
                                    <option value="car">{t('icon_car')}</option>
                                    <option value="home">{t('icon_home')}</option>
                                    <option value="star">{t('icon_star')}</option>
                                    <option value="shield">{t('icon_shield')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('color') || "Color"}</label>
                                <select
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    className="w-full p-2 border border-border bg-background rounded-lg text-foreground"
                                >
                                    <option value="blue">{t('color_blue')}</option>
                                    <option value="green">{t('color_green')}</option>
                                    <option value="orange">{t('color_orange')}</option>
                                    <option value="purple">{t('color_purple')}</option>
                                    <option value="red">{t('color_red')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg text-sm font-medium"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {goals.map(goal => {
                    const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                    const colors = getColorClasses(goal.color);

                    return (
                        <div key={goal.id} className="bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col gap-4 group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 ${colors.bg} ${colors.text} rounded-xl`}>
                                    {getIcon(goal.icon)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-semibold text-foreground">{goal.name}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold ${colors.text}`}>{percentage}%</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(goal)}
                                                    className="p-1 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                                    title={t('edit_goal')}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(goal.id)}
                                                    className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                                    title={t('delete')}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
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

                            <div className="flex gap-2 pt-2 border-t border-border">
                                <button
                                    onClick={() => handleOpenDeposit(goal.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                >
                                    <PlusCircle size={16} />
                                    {t('add_value') || "Add Value"}
                                </button>
                                <button
                                    onClick={() => handleOpenHistory(goal.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                >
                                    <History size={16} />
                                    {t('history') || "History"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
