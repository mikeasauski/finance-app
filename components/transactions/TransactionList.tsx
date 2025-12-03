"use client";

import { useState } from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, MoreHorizontal, Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { getBrandById } from "@/lib/brands";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit }: TransactionListProps) {
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
        const dateA = new Date(groupA[0].date).getTime();
        const dateB = new Date(groupB[0].date).getTime();
        return dateB - dateA;
    });

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Calendar size={32} className="text-gray-400" />
                </div>
                <p className="font-medium">Nenhuma transação encontrada</p>
                <p className="text-sm">Tente ajustar os filtros ou adicione uma nova transação.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="w-8"></th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sortedGroups.map(([key, group]) => {
                            const isGroup = group.length > 1;
                            const isExpanded = expandedGroups.has(key);

                            // Determine display transaction for the group row
                            // Logic: Earliest pending, or latest paid
                            const sortedGroup = [...group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                            const earliestPending = group
                                .filter(t => !t.isPaid && t.status !== 'paid')
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
                            const latestPaid = sortedGroup.find(t => t.isPaid || t.status === 'paid');
                            const displayTransaction = earliestPending || latestPaid || sortedGroup[0];

                            return (
                                <>
                                    <tr key={key} className={`hover:bg-gray-50/50 transition-colors group ${isExpanded ? 'bg-gray-50' : ''}`}>
                                        <td className="pl-4">
                                            {isGroup && (
                                                <button
                                                    onClick={() => toggleGroup(key)}
                                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${displayTransaction.brandId && getBrandById(displayTransaction.brandId)?.logoUrl
                                                    ? 'bg-transparent'
                                                    : (displayTransaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
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
                                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                                        {displayTransaction.description}
                                                        {isGroup && (
                                                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                {group.length} itens
                                                            </span>
                                                        )}
                                                    </p>
                                                    {displayTransaction.installments && (
                                                        <span className="text-xs text-gray-500">
                                                            Parcela {displayTransaction.installments.current}/{displayTransaction.installments.total}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
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
                                            }`}>
                                            {displayTransaction.type === 'expense' ? '- ' : '+ '}
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayTransaction.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit && onEdit(displayTransaction)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(displayTransaction.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && group.map(t => {
                                        // Don't show the display transaction again? Or show all?
                                        // User wants to see "expanded quantity of installments".
                                        // So we show ALL items in the group when expanded.
                                        // Maybe slightly indented.
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
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    {/* Category repeated or empty? Empty looks cleaner */}
                                                </td>
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
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onEdit && onEdit(t)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(t.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
