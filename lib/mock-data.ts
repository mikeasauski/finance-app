import { Transaction, CreditCard } from "@/types";

export const mockCards: CreditCard[] = [
    { id: "1", name: "Nubank", limit: 5000, closingDay: 20, dueDay: 27, color: "purple", context: "PF" },
    { id: "2", name: "Inter", limit: 10000, closingDay: 5, dueDay: 12, color: "orange", context: "PJ" },
];

export const mockTransactions: Transaction[] = [
    {
        id: "1",
        description: "Supermercado Mensal",
        amount: 850.50,
        date: "2025-11-20",
        type: "expense",
        subType: "daily",
        category: "Alimentação",
        paymentMethod: "credit",
        context: "PF",
        cardId: "1",
        status: "pending",
        isPaid: false
    },
    {
        id: "2",
        description: "Salário Mensal",
        amount: 5000.00,
        date: "2025-11-05",
        type: "income",
        subType: "fixed",
        category: "Salário",
        paymentMethod: "transfer",
        context: "PF",
        status: "paid",
        isPaid: true
    },
    {
        id: "3",
        description: "Netflix",
        amount: 55.90,
        date: "2025-11-15",
        type: "expense",
        subType: "fixed",
        category: "Lazer",
        paymentMethod: "credit",
        context: "PF",
        cardId: "1",
        status: "pending",
        isPaid: false
    },
    {
        id: "4",
        description: "Notebook Dell",
        amount: 4500.00,
        date: "2025-10-10",
        type: "expense",
        subType: "installment",
        category: "Eletrônicos",
        paymentMethod: "credit",
        installments: {
            current: 2,
            total: 10
        },
        context: "PJ",
        cardId: "2",
        status: "pending",
        isPaid: false
    },
    {
        id: "5",
        description: "Almoço Restaurante",
        amount: 45.00,
        date: "2025-11-22",
        type: "expense",
        subType: "daily",
        category: "Alimentação",
        paymentMethod: "debit",
        context: "PF",
        status: "paid",
        isPaid: true
    },
    {
        id: "6",
        description: "Freela Design",
        amount: 1200.00,
        date: "2025-11-18",
        type: "income",
        subType: "daily",
        category: "Serviços",
        paymentMethod: "pix",
        context: "PJ",
        status: "paid",
        isPaid: true,
        goalId: "2" // Linked to 'Carro Novo' goal
    },
    {
        id: "7",
        description: "Uber",
        amount: 24.90,
        date: "2025-11-21",
        type: "expense",
        subType: "daily",
        category: "Transporte",
        paymentMethod: "credit",
        context: "PF",
        cardId: "1",
        status: "pending",
        isPaid: false
    },
    {
        id: "8",
        description: "Academia",
        amount: 110.00,
        date: "2025-11-01",
        type: "expense",
        subType: "fixed",
        category: "Saúde",
        paymentMethod: "credit",
        context: "PF",
        cardId: "1",
        status: "pending",
        isPaid: false
    }
];

export const mockGoals: any[] = [
    {
        id: '1',
        name: 'Viagem',
        targetAmount: 6000,
        currentAmount: 1200,
        icon: 'plane',
        color: 'orange',
        deadline: '2024-12-31'
    },
    {
        id: '2',
        name: 'Carro Novo',
        targetAmount: 25000,
        currentAmount: 3400,
        icon: 'car',
        color: 'blue',
        deadline: '2025-06-30'
    }
];
