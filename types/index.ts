export type ContextType = 'PF' | 'PJ';

export type TransactionType = 'income' | 'expense';

export type TransactionSubType = 'daily' | 'installment' | 'fixed' | 'subscription';

export type PaymentMethod = 'credit' | 'debit' | 'cash' | 'pix' | 'transfer';

export interface CreditCard {
    id: string;
    name: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    color: string;
    context: ContextType;
    bankId?: string;
    isFavorite?: boolean;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    icon: 'plane' | 'car' | 'home' | 'star' | 'shield' | 'target';
    color: string;
    deadline?: string;
}

export interface Account {
    id: string;
    name: string;
    bankId: string;
    balance: number;
    initialBalance: number;
    isFavorite: boolean;
    context: ContextType;
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
    status: 'pending' | 'paid';
    isPaid: boolean; // Deprecated, keep for backward compatibility for now
    installments?: {
        current: number;
        total: number;
    };
    brandId?: string;
    context: ContextType;
    cardId?: string;
    accountId?: string;
    goalId?: string;

    recurrence?: {
        frequency: 'monthly';
        day: number;
        infinite: boolean;
    };
}
