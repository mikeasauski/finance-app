"use client";

import { useState } from "react";
import { Transaction } from "@/types";
<<<<<<< HEAD
import { format, parseISO } from "date-fns";
=======
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
import { ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, MoreHorizontal, Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react";
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
<<<<<<< HEAD
        const dateA = parseISO(groupA[0].date).getTime();
        const dateB = parseISO(groupB[0].date).getTime();
=======
        const dateA = new Date(groupA[0].date).getTime();
        const dateB = new Date(groupB[0].date).getTime();
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
        return dateB - dateA;
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
<<<<<<< HEAD
                            <th className="w-8"></th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('description')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('category')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('date')}</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('payment_method')}</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('amount')}</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
=======
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        {sortedGroups.map(([key, group]) => {
                            const isGroup = group.length > 1;
                            const isExpanded = expandedGroups.has(key);

                            // Determine display transaction for the group row
                            // Logic: Earliest pending, or latest paid
<<<<<<< HEAD
                            const sortedGroup = [...group].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
                            const earliestPending = group
                                .filter(t => !t.isPaid && t.status !== 'paid')
                                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];
=======
                            const sortedGroup = [...group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                            const earliestPending = group
                                .filter(t => !t.isPaid && t.status !== 'paid')
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            const latestPaid = sortedGroup.find(t => t.isPaid || t.status === 'paid');
                            const displayTransaction = earliestPending || latestPaid || sortedGroup[0];

                            return (
                                <>
<<<<<<< HEAD
                                    <tr key={key} className={`hover:bg-muted/50 transition-colors group ${isExpanded ? 'bg-muted/30' : ''}`}>
=======
                                    <tr key={key} className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-gray-50' : ''}`}>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        <td className="pl-4">
                                            {isGroup && (
                                                <button
                                                    onClick={() => toggleGroup(key)}
<<<<<<< HEAD
                                                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
=======
                                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${displayTransaction.brandId && getBrandById(displayTransaction.brandId)?.logoUrl
                                                    ? 'bg-transparent'
<<<<<<< HEAD
                                                    : (displayTransaction.type === 'income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')
=======
                                                    : (displayTransaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                    }`}>
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
<<<<<<< HEAD
                                                    <p className="font-medium text-foreground flex items-center gap-2">
                                                        {displayTransaction.description}
                                                        {isGroup && (
                                                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
=======
                                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                                        {displayTransaction.description}
                                                        {isGroup && (
                                                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                                {group.length} itens
                                                            </span>
                                                        )}
                                                    </p>
                                                    {displayTransaction.installments && (
<<<<<<< HEAD
                                                        <span className="text-xs text-muted-foreground">
=======
                                                        <span className="text-xs text-gray-500">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                            Parcela {displayTransaction.installments.current}/{displayTransaction.installments.total}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
<<<<<<< HEAD
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
                                        <td className={`py-4 px-6 text-right font-semibold ${displayTransaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-foreground'
=======
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {displayTransaction.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {format(new Date(displayTransaction.date), "d 'de' MMM, yyyy", { locale: ptBR })}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                {displayTransaction.paymentMethod === 'credit' && <CreditCard size={14} />}
                                                <span className="capitalize">
                                                    {displayTransaction.paymentMethod === 'credit' ? 'Crédito' :
                                                        displayTransaction.paymentMethod === 'debit' ? 'Débito' :
                                                            displayTransaction.paymentMethod === 'pix' ? 'Pix' :
                                                                displayTransaction.paymentMethod === 'cash' ? 'Dinheiro' : 'Transferência'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-6 text-right font-semibold ${displayTransaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            }`}>
                                            {displayTransaction.type === 'expense' ? '- ' : '+ '}
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayTransaction.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit && onEdit(displayTransaction)}
<<<<<<< HEAD
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
=======
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(displayTransaction.id)}
<<<<<<< HEAD
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
=======
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
<<<<<<< HEAD
                                    {isExpanded && group.map(transactionItem => {
=======
                                    {isExpanded && group.map(t => {
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        // Don't show the display transaction again? Or show all?
                                        // User wants to see "expanded quantity of installments".
                                        // So we show ALL items in the group when expanded.
                                        // Maybe slightly indented.
<<<<<<< HEAD
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
                                                                    {t('installment_prefix')} {transactionItem.installments.current}/{transactionItem.installments.total}
=======
                                        if (t.id === displayTransaction.id && !isGroup) return null; // Should not happen if logic is correct

                                        return (
                                            <tr key={t.id} className="bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                                <td></td>
                                                <td className="py-3 px-6 pl-12 border-l-2 border-blue-100">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-sm text-gray-700">{t.description}</p>
                                                            {t.installments && (
                                                                <span className="text-xs text-gray-400">
                                                                    Parcela {t.installments.current}/{t.installments.total}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    {/* Category repeated or empty? Empty looks cleaner */}
                                                </td>
<<<<<<< HEAD
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
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transactionItem.amount)}
=======
                                                <td className="py-3 px-6 text-sm text-gray-500">
                                                    {format(new Date(t.date), "d 'de' MMM, yyyy", { locale: ptBR })}
                                                    {t.status === 'pending' && (
                                                        <span className="ml-2 text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">Pendente</span>
                                                    )}
                                                    {(t.status === 'paid' || t.isPaid) && (
                                                        <span className="ml-2 text-[10px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded">Pago</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-sm text-gray-500">
                                                    {/* Method repeated */}
                                                </td>
                                                <td className="py-3 px-6 text-right text-sm text-gray-600">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
<<<<<<< HEAD
                                                            onClick={() => onEdit && onEdit(transactionItem)}
                                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
=======
                                                            onClick={() => onEdit && onEdit(t)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
<<<<<<< HEAD
                                                            onClick={() => handleDelete(transactionItem.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
=======
                                                            onClick={() => handleDelete(t.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                        >
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
