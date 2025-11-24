"use client";

import { Transaction } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit }: TransactionListProps) {
    const { removeTransaction } = useFinance();

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta transação?")) {
            removeTransaction(id);
        }
    };

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
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${transaction.type === 'income'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.description}</p>
                                            {transaction.installments && (
                                                <span className="text-xs text-gray-500">
                                                    Parcela {transaction.installments.current}/{transaction.installments.total}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    {format(new Date(transaction.date), "d 'de' MMM, yyyy", { locale: ptBR })}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        {transaction.paymentMethod === 'credit' && <CreditCard size={14} />}
                                        <span className="capitalize">
                                            {transaction.paymentMethod === 'credit' ? 'Crédito' :
                                                transaction.paymentMethod === 'debit' ? 'Débito' :
                                                    transaction.paymentMethod === 'pix' ? 'Pix' :
                                                        transaction.paymentMethod === 'cash' ? 'Dinheiro' : 'Transferência'}
                                        </span>
                                    </div>
                                </td>
                                <td className={`py-4 px-6 text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                    {transaction.type === 'expense' ? '- ' : '+ '}
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit && onEdit(transaction)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
