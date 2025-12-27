import { CreditCard, Banknote, Smartphone, ArrowRightLeft, QrCode, Barcode } from "lucide-react";

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
    { id: 'boleto', label: 'Boleto', icon: Barcode },
];

export const DOCUMENT_CATEGORIES = {
    PERSONAL: {
        label: "Pessoais",
        types: [
            { value: "RG", label: "RG" },
            { value: "CPF", label: "CPF" },
            { value: "CNH", label: "CNH" },
            { value: "PASSPORT", label: "Passaporte" },
            { value: "BIRTH_CERTIFICATE", label: "Certidão de Nascimento" },
            { value: "MARRIAGE_CERTIFICATE", label: "Certidão de Casamento" },
            { value: "VOTER_ID", label: "Título de Eleitor" },
            { value: "RESERVIST", label: "Reservista" },
            { value: "WORK_CARD", label: "Carteira de Trabalho" },
            { value: "PIS", label: "PIS/PASEP" },
            { value: "CNS", label: "Cartão do SUS" },
        ]
    },
    VEHICLE: {
        label: "Veículos",
        types: [
            { value: "CRLV", label: "CRLV (Doc. do Veículo)" },
            { value: "CNH", label: "CNH" },
            { value: "IPVA", label: "IPVA" },
            { value: "INSURANCE", label: "Seguro" },
        ]
    },
    PROFESSIONAL: {
        label: "Profissionais",
        types: [
            { value: "OAB", label: "OAB (Advogado)" },
            { value: "CREA", label: "CREA (Engenheiro)" },
            { value: "CRM", label: "CRM (Médico)" },
            { value: "CRO", label: "CRO (Dentista)" },
            { value: "CRP", label: "CRP (Psicólogo)" },
            { value: "CRC", label: "CRC (Contador)" },
            { value: "COREN", label: "COREN (Enfermagem)" },
            { value: "CRECI", label: "CRECI (Corretor)" },
            { value: "CAU", label: "CAU (Arquiteto)" },
            { value: "CRA", label: "CRA (Administrador)" },
            { value: "CREF", label: "CREF (Ed. Física)" },
            { value: "CRMV", label: "CRMV (Veterinário)" },
            { value: "CRN", label: "CRN (Nutricionista)" },
            { value: "SUSEP", label: "SUSEP (Corretor Seguros)" },
        ]
    },
    BUSINESS: {
        label: "Empresarial",
        types: [
            { value: "CNPJ", label: "CNPJ" },
            { value: "SOCIAL_CONTRACT", label: "Contrato Social" },
            { value: "MUNICIPAL_LICENSE", label: "Alvará" },
            { value: "STATE_REGISTRATION", label: "Inscrição Estadual" },
        ]
    },
    RESIDENCE: {
        label: "Residência",
        types: [
            { value: "PROOF_OF_ADDRESS", label: "Comprovante de Endereço" },
            { value: "LEASE_AGREEMENT", label: "Contrato de Locação" },
            { value: "PROPERTY_DEED", label: "Escritura" },
        ]
    },
    OTHER: {
        label: "Outros",
        types: [
            { value: "OTHER", label: "Outro" },
        ]
    }
};
