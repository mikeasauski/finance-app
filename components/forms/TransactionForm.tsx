"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    FileText,
    Tag,
    Calendar,
    Landmark,
    X,
    Repeat,
    CreditCard as CreditCardIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Transaction, TransactionType, PaymentMethod } from "@/types";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/constants";
import { BRANDS } from "@/lib/brands";

interface TransactionFormProps {
    initialData?: Transaction;
    onClose?: () => void;
    defaultType?: TransactionType;
    lockType?: boolean;
}

type FormMode = 'expense' | 'income' | 'subscription';

export default function TransactionForm({ initialData, onClose, defaultType, lockType }: TransactionFormProps) {
    const { t } = useLanguage();
    const { addTransaction, updateTransaction, cards = [], accounts = [] } = useFinance();
    const { showToast } = useToast();

    // Determine initial mode
    const getInitialMode = (): FormMode => {
        if (initialData?.subType === 'subscription') return 'subscription';
        if (initialData?.type === 'income') return 'income';
        return 'expense';
    };

    const [mode, setMode] = useState<FormMode>(getInitialMode());

    // Common State
    const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [date, setDate] = useState(initialData?.date || "");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || "debit");

    // Expense Specific
    const [installments, setInstallments] = useState(initialData?.installments?.total?.toString() || "1");
    const [isRecurrent, setIsRecurrent] = useState(initialData?.subType === 'fixed');

    // Subscription Specific
    const [subscriptionDay, setSubscriptionDay] = useState(initialData?.recurrence?.day?.toString() || "15");

    // Selection State
    const [selectedCardId, setSelectedCardId] = useState(initialData?.cardId || "");
    const [selectedAccountId, setSelectedAccountId] = useState(initialData?.accountId || "");
    const [selectedBrandId, setSelectedBrandId] = useState(initialData?.brandId || "");

    const [isPaid, setIsPaid] = useState(initialData?.isPaid ?? true);

    // Set default date
    useEffect(() => {
        if (!date && !initialData?.date) {
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, []);

    // Reset fields when switching modes
    useEffect(() => {
        if (mode === 'subscription') {
            setPaymentMethod('credit'); // Default to credit for subs usually
            setIsPaid(false); // Subs are usually future/pending
        } else if (mode === 'income') {
            setPaymentMethod('debit'); // Income usually goes to account
            setIsPaid(true);
        }
    }, [mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !category) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (paymentMethod !== 'credit' && !selectedAccountId && paymentMethod !== 'cash') {
            alert(t('select_account_required') || "Por favor, selecione uma conta.");
            return;
        }

        const type: TransactionType = mode === 'income' ? 'income' : 'expense';
        let subType: any = 'daily';
        let recurrence: any = undefined;

        if (mode === 'subscription') {
            subType = 'subscription';
            recurrence = {
                frequency: 'monthly',
                day: Number(subscriptionDay),
                infinite: true
            };
        } else if (mode === 'expense') {
            if (isRecurrent) {
                subType = 'fixed';
                recurrence = {
                    frequency: 'monthly',
                    day: new Date(date).getDate(),
                    infinite: true
                };
            } else if (Number(installments) > 1 && paymentMethod === 'credit') {
                subType = 'installment';
            }
        }

        const transactionData: Transaction = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            type,
            subType,
            context: 'PF', // Default
            amount: Number(amount),
            description,
            category,
            date,
            paymentMethod,
            status: isPaid ? 'paid' : 'pending',
            cardId: paymentMethod === 'credit' ? selectedCardId : undefined,
            accountId: paymentMethod !== 'credit' && paymentMethod !== 'cash' ? selectedAccountId : undefined,
            isPaid: isPaid,
            installments: mode === 'expense' && paymentMethod === 'credit' && Number(installments) > 1 ? {
                current: 1,
                total: Number(installments)
            } : undefined,
            brandId: selectedBrandId,
            recurrence
        };

        if (initialData) {
            updateTransaction(transactionData);
            showToast('success', 'Transação atualizada com sucesso!');
        } else {
            addTransaction(transactionData);
            showToast('success', 'Transação criada com sucesso!');
        }

        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors z-10"
                >
                    <X size={20} />
                </button>
            )}

            <h3 className="text-lg font-bold text-foreground pr-8">
                {initialData ? t('edit_transaction') : t('new_transaction')}
            </h3>

            {/* Mode Tabs */}
            {!lockType && (
                <div className="flex p-1 bg-muted rounded-xl">
                    <button
                        type="button"
                        onClick={() => setMode('expense')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'expense'
                                ? "bg-card text-red-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <ArrowDownLeft size={16} />
                        {t('expense')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('income')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'income'
                                ? "bg-card text-green-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <ArrowUpRight size={16} />
                        {t('revenue')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('subscription')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'subscription'
                                ? "bg-card text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Repeat size={16} />
                        {t('subscription')}
                    </button>
                </div>
            )}

            {/* Amount */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t('amount')}</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground text-sm font-bold">R$</span>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg font-semibold text-lg text-foreground"
                        placeholder="0,00"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t('description')}</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-foreground"
                        placeholder={mode === 'subscription' ? "Ex: Netflix, Spotify..." : "Ex: Mercado, Salário..."}
                        required
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t('category')}</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
                        required
                    >
                        <option value="">{t('select')}</option>
                        {CATEGORIES?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Date / Due Day */}
            {mode === 'subscription' ? (
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{t('due_day')}</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={subscriptionDay}
                            onChange={(e) => setSubscriptionDay(e.target.value)}
                            className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-foreground"
                            placeholder="Dia (ex: 15)"
                            required
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{t('date')}</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 p-2 bg-background border border-border rounded-lg text-foreground"
                            required
                        />
                    </div>
                </div>
            )}

            {/* Payment Method */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">{t('payment_method')}</label>
                <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS?.map((method) => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all",
                                    paymentMethod === method.id
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                        : "border-border text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Icon size={16} />
                                <span className="text-[10px] font-medium">{method.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Account Selection (Non-Credit) */}
            {paymentMethod !== 'credit' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{t('account')} <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Landmark className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                        <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            className="w-full pl-10 p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
                            required
                        >
                            <option value="">{t('select_account')}</option>
                            {accounts?.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} (R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Credit Card Options */}
            {paymentMethod === 'credit' && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border animate-in fade-in slide-in-from-top-2">
                    <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">{t('card')}</label>
                        <select
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="w-full p-2 bg-background border border-border rounded-lg text-foreground"
                        >
                            <option value="">{t('select_card')}</option>
                            {cards?.map(card => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Installments - ONLY for Expense Mode */}
                    {mode === 'expense' && (
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">{t('installments')}</label>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={installments}
                                onChange={(e) => setInstallments(e.target.value)}
                                className="w-full p-2 bg-background border border-border rounded-lg text-foreground"
                                placeholder="1"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Brand Selection (Optional) */}
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{t('brand')} ({t('optional')})</label>
                <div className="relative">
                    <div className="absolute left-3 top-2.5 z-10 pointer-events-none">
                        {selectedBrandId ? (
                            (() => {
                                const brand = BRANDS?.find(b => b.id === selectedBrandId);
                                return brand?.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={brand.logoUrl} alt="" className="w-5 h-5 object-contain" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-foreground">
                                        {brand?.name.substring(0, 2)}
                                    </div>
                                );
                            })()
                        ) : (
                            <Tag className="text-muted-foreground" size={18} />
                        )}
                    </div>
                    <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        className="w-full pl-10 p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
                    >
                        <option value="">{t('select_brand')}</option>
                        {BRANDS?.filter(b => b.type !== 'bank').map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


            {/* Paid Status */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                <input
                    type="checkbox"
                    id="isPaid"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-border bg-card"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-foreground select-none cursor-pointer flex-1">
                    {isPaid ? `${t('paid')} / ${t('received')}` : `${t('pending')} / ${t('to_receive')}`}
                </label>
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                {initialData ? t('save_changes') : t('save_transaction')}
            </button>
        </form>
    );
}
