import { CreditCard, Banknote, Smartphone, ArrowRightLeft, QrCode } from "lucide-react";

export const CATEGORIES = [
    "Alimentação",
    "Transporte",
    "Lazer",
    "Saúde",
    "Educação",
    "Moradia",
    "Serviços",
    "Compras",
    "Assinaturas",
    "Outros"
];

export const PAYMENT_METHODS = [
    { id: 'credit', label: 'Crédito', icon: CreditCard },
    { id: 'debit', label: 'Débito', icon: CreditCard },
    { id: 'pix', label: 'Pix', icon: QrCode },
    { id: 'cash', label: 'Dinheiro', icon: Banknote },
    { id: 'transfer', label: 'Transferência', icon: ArrowRightLeft },
];
