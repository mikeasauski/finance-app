import React, { useState } from "react";
import { Edit2, Trash2, MoreVertical, Star } from "lucide-react";
import { Account } from "@/types";
import { getBankById } from "@/lib/banks";

interface AccountListProps {
    accounts: Account[];
    onEdit: (account: Account) => void;
    onDelete: (id: string) => void;
}

export default function AccountList({ accounts, onEdit, onDelete }: AccountListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={() => onEdit(account)}
                    onDelete={() => onDelete(account.id)}
                />
            ))}
        </div>
    );
}

function AccountCard({ account, onEdit, onDelete }: { account: Account; onEdit: () => void; onDelete: () => void }) {
    const [showMenu, setShowMenu] = useState(false);
    const bank = getBankById(account.bankId);

    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">                        {bank ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={bank.logoUrl} alt={bank.name} className="w-8 h-8 object-contain" />
                        ) : (
                            <div className="w-8 h-8 bg-muted rounded-full" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            {account.name}
                            {account.isFavorite && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                        </h4>
                        <p className="text-xs text-muted-foreground">{bank?.name}</p>                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 top-8 z-20 bg-card rounded-lg shadow-lg py-1 w-32 border border-border">                                <button
                                    onClick={() => {
                                        onEdit();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"                                >
                                    <Edit2 size={14} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"                                >
                                    <Trash2 size={14} />
                                    Excluir
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div>
                <p className="text-xs text-muted-foreground mb-1">Saldo Atual</p>
                <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>                    R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">                <span>{account.context === 'PF' ? 'Pessoa Física' : 'Empresarial'}</span>
            </div>
        </div>
    );
}
