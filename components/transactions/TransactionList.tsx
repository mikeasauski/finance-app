"use client";

import { useState } from "react";
import { Transaction } from "@/types";
import { format, parseISO } from "date-fns";import { ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, MoreHorizontal, Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { getBrandById } from "@/lib/brands";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit?: (transaction: Transaction) => void;
}

import { useLanguage } from "@/contexts/LanguageContext";

export default function TransactionList({ transactions, onEdit }: TransactionListProps) {
    const { t, locale } = useLanguage();
    const { removeTransaction } = useFinance();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta transação?")) {
            removeTransaction(id);
        }
    };

    const toggleGroup = (key: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedGroups(newExpanded);
    };

    // Group transactions
    const groupedTransactions = transactions.reduce((acc, t) => {
        const key = `${t.description}-${t.category}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(t);
        return acc;
    }, {} as Record<string, Transaction[]>);

    // Sort groups by date of the most relevant item
    const sortedGroups = Object.entries(groupedTransactions).sort(([, groupA], [, groupB]) => {
        const dateA = parseISO(groupA[0].date).getTime();
        const dateB = parseISO(groupB[0].date).getTime();        return dateB - dateA;
    });

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Calendar size={32} className="text-muted-foreground" />
                </div>
                <p className="font-medium">{t('no_transactions_found')}</p>
                <p className="text-sm">{t('no_transactions_help')}</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="w-8"></th>
                            <th className="w-8"></th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('description')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('category')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('date')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('payment_method')}</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('amount')}</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">                        {sortedGroups.map(([key, group]) => {
                            const isGroup = group.length > 1;
                            const isExpanded = expandedGroups.has(key);

                            // Determine display transaction for the group row
                            // Logic: Earliest pending, or latest paid
                            const sortedGroup = [...group].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
                            const earliestPending = group
                                .filter(t => !t.isPaid && t.status !== 'paid')
                                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];                            const latestPaid = sortedGroup.find(t => t.isPaid || t.status === 'paid');
                            const displayTransaction = earliestPending || latestPaid || sortedGroup[0];

                            return (
                                <>
                                    <tr key={key} className={`hover:bg-muted/50 transition-colors group ${isExpanded ? 'bg-muted/30' : ''}`}>                                        <td className="pl-4">
                                            {isGroup && (
                                                <button
                                                    onClick={() => toggleGroup(key)}
                                                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${displayTransaction.brandId && getBrandById(displayTransaction.brandId)?.logoUrl
                                                    ? 'bg-transparent'
                                                    : (displayTransaction.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')                                                    }`}>
                                                    {displayTransaction.brandId ? (
                                                        (() => {
                                                            const brand = getBrandById(displayTransaction.brandId);
                                                            if (brand?.logoUrl) {
                                                                return (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" />
                                                                );
                                                            }
                                                            return <span className="text-[10px] font-bold">{brand?.name.substring(0, 2)}</span>;
                                                        })()
                                                    ) : (
                                                        displayTransaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground flex items-center gap-2">
                                                        {displayTransaction.description}
                                                        {isGroup && (
                                                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">                                                                {group.length} itens
                                                            </span>
                                                        )}
                                                    </p>
                                                    {displayTransaction.installments && (
                                                        <span className="text-xs text-muted-foreground">                                                            Parcela {displayTransaction.installments.current}/{displayTransaction.installments.total}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                                                {displayTransaction.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-muted-foreground">
                                            {format(parseISO(displayTransaction.date), "d 'de' MMM, yyyy", { locale })}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                {displayTransaction.paymentMethod === 'credit' && <CreditCard size={14} />}
                                                <span className="capitalize">
                                                    {displayTransaction.paymentMethod === 'credit' ? t('credit') :
                                                        displayTransaction.paymentMethod === 'debit' ? t('debit') :
                                                            displayTransaction.paymentMethod === 'pix' ? t('pix') :
                                                                displayTransaction.paymentMethod === 'cash' ? t('cash') : t('transfer')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-6 text-right font-semibold ${displayTransaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-foreground'                                            }`}>
                                            {displayTransaction.type === 'expense' ? '- ' : '+ '}
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayTransaction.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit && onEdit(displayTransaction)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(displayTransaction.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && group.map(transactionItem => {                                        // Don't show the display transaction again? Or show all?
                                        // User wants to see "expanded quantity of installments".
                                        // So we show ALL items in the group when expanded.
                                        // Maybe slightly indented.
                                        if (transactionItem.id === displayTransaction.id && !isGroup) return null; // Should not happen if logic is correct

                                        return (
                                            <tr key={transactionItem.id} className="bg-muted/20 hover:bg-muted/40 transition-colors">
                                                <td></td>
                                                <td className="py-3 px-6 pl-12 border-l-2 border-primary/20">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-sm text-foreground">{transactionItem.description}</p>
                                                            {transactionItem.installments && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {t('installment_prefix')} {transactionItem.installments.current}/{transactionItem.installments.total}                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    {/* Category repeated or empty? Empty looks cleaner */}
                                                </td>
                                                <td className="py-3 px-6 text-sm text-muted-foreground">
                                                    {format(parseISO(transactionItem.date), "d 'de' MMM, yyyy", { locale })}
                                                    {transactionItem.status === 'pending' && (
                                                        <span className="ml-2 text-[10px] text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">{t('pending')}</span>
                                                    )}
                                                    {(transactionItem.status === 'paid' || transactionItem.isPaid) && (
                                                        <span className="ml-2 text-[10px] text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">{t('paid')}</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-sm text-muted-foreground">
                                                    {/* Method repeated */}
                                                </td>
                                                <td className="py-3 px-6 text-right text-sm text-muted-foreground">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transactionItem.amount)}                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onEdit && onEdit(transactionItem)}
                                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(transactionItem.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
