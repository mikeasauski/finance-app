export type ContextType = 'PF' | 'PJ';

export type TransactionType = 'income' | 'expense';

export type TransactionSubType = 'fixed' | 'installment' | 'daily';

export type PaymentMethod = 'credit' | 'debit' | 'cash' | 'pix' | 'transfer';

export interface CreditCard {
    id: string;
    name: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    color?: string;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: TransactionType;
    subType: TransactionSubType;
    category: string;
    paymentMethod: PaymentMethod;
    installments?: {
        current: number;
        total: number;
    };
    context: ContextType;
    cardId?: string;
}
