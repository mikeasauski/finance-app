export type ContextType = 'PF' | 'PJ';

export type TransactionType = 'income' | 'expense';

export type TransactionSubType = 'daily' | 'installment' | 'fixed' | 'subscription';

export type PaymentMethod = 'credit' | 'debit' | 'cash' | 'pix' | 'transfer' | 'boleto';

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
    invoice?: number;
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

export type DocumentType =
    | 'RG' | 'CPF' | 'CNH' | 'PASSPORT' | 'BIRTH_CERTIFICATE' | 'MARRIAGE_CERTIFICATE' | 'VOTER_ID' | 'RESERVIST' | 'WORK_CARD' | 'PIS' | 'CNS'
    | 'CRLV' | 'IPVA' | 'INSURANCE'
    | 'OAB' | 'CREA' | 'CRM' | 'CRO' | 'CRP' | 'CRC' | 'COREN' | 'CRECI' | 'CAU' | 'CRA' | 'CREF' | 'CRMV' | 'CRN' | 'SUSEP'
    | 'CNPJ' | 'SOCIAL_CONTRACT' | 'MUNICIPAL_LICENSE' | 'STATE_REGISTRATION'
    | 'PROOF_OF_ADDRESS' | 'LEASE_AGREEMENT' | 'PROPERTY_DEED'
    | 'OTHER';

export interface Document {
    id: string;
    type: DocumentType;
    title: string;
    number: string;
    color: string;

    // New fields
    category?: string; // e.g., 'PERSONAL', 'VEHICLE'
    fileUrl?: string; // Base64 string
    fileName?: string;
    fileType?: string; // MIME type
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    notes?: string;
}
