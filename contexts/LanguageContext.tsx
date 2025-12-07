"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ptBR, enUS, es, it } from 'date-fns/locale';

type Language = 'pt' | 'en' | 'es' | 'it';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    locale: any; // date-fns locale
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt');

    useEffect(() => {
        const storedLanguage = localStorage.getItem("finance_language") as Language;
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    const handleSetLanguage = (newLanguage: Language) => {
        setLanguage(newLanguage);
        localStorage.setItem("finance_language", newLanguage);
    };

    const locales = {
        pt: ptBR,
        en: enUS,
        es: es,
        it: it
    };

    const translations: Record<Language, Record<string, string>> = {
        pt: {
            // General
            welcome: "Bem-vindo de volta!",
            overview: "Visão Geral",
            personal: "Pessoal",
            business: "Empresarial",
            total: "Total",
            save: "Salvar",
            cancel: "Cancelar",
            edit: "Editar",
            delete: "Excluir",
            back: "Voltar",
            optional: "Opcional",
            select: "Selecione...",

            // Sidebar
            dashboard: "Dashboard",
            transactions: "Transações",
            wallet: "Minha Carteira",
            calendar: "Calendário",
            reports: "Relatórios",
            planning: "Planejamento",
            income: "Renda",
            settings: "Configurações",
            new_transaction: "Nova Transação",
            logout: "Sair (Bloquear)",
            user: "Usuário",

            // Dashboard
            my_cards: "Meus Cartões",
            view_all: "Ver todos",
            cash_flow: "Fluxo de Caixa",
            last_6_months: "Últimos 6 meses",
            total_balance: "Saldo Atual",
            income_month: "Receitas (Este Mês)",
            expense_month: "Despesas (Este Mês)",
            upcoming_bills: "Contas da Semana",
            total_to_pay: "Total a pagar",
            no_bills: "Nenhuma conta para esta semana 🎉",
            my_goals: "Meus Objetivos",
            manage_goals: "Gerenciar Objetivos",
            recent_transactions: "Transações Recentes",

            // Cards
            current_invoice: "Fatura Atual",
            available_limit: "Limite Disponível",
            limit_usage: "Uso do Limite",
            limit: "Limite",
            available: "Disponível",
            closes_day: "Fecha dia",
            due_day: "Vence dia",
            best_buy_day: "MELHOR DIA DE COMPRA",
            view_invoice: "Ver Fatura",
            card_holder: "Titular",
            bank: "Banco",

            // Forms
            edit_transaction: "Editar Transação",
            new_income: "Nova Renda",
            received: "Recebido",
            paid: "Pago",
            to_receive: "A Receber",
            pending: "Pendente",
            expense: "Despesa",
            revenue: "Receita",
            recurrence: "Recorrência",
            enable: "Habilitar",
            fixed_charge: "Cobrança Recorrente",
            type_fixed_help: "Esta opção é para utilizar em recorrências de Aluguel, Conta de água, Conta de luz...",
            consumes_limit: "Consome o limite total do cartão (de cartão de crédito).",
            subscription: "Assinatura Recorrente",
            type_sub_help: "Esta opção é para assinaturas digitais com cobranças mensais...",
            no_consume_limit: "Não consome o limite futuro, apenas o mês atual.",
            amount: "Valor",
            description: "Descrição",
            category: "Categoria",
            brand: "Marca / Empresa",
            select_brand: "Selecione uma marca...",
            date: "Data",
            payment_method: "Método de Pagamento",
            account: "Conta Bancária",
            select_account: "Selecione a conta...",
            card: "Cartão",
            installments: "Quantidade de Parcelas",
            save_changes: "Salvar Alterações",
            save_transaction: "Salvar Transação",

            // Goals (Generic labels)
            of: "de",
            day: "Dia",
            confirm_delete_card: "Tem certeza que deseja excluir o cartão {cardName}?",
            card_deleted_success: "Cartão {cardName} excluído com sucesso!",
            edit_card: "Editar Cartão",
            delete_card: "Excluir Cartão",
            dashboard_subtitle: "Visão geral das suas finanças",
            transactions_subtitle: "Histórico completo de movimentações",
            search_placeholder: "Buscar transações...",
            all: "Todas",
            all_categories: "Todas Categorias",
            all_methods: "Todos Métodos",
            no_transactions_found: "Nenhuma transação encontrada",
            no_transactions_help: "Tente ajustar os filtros ou adicione uma nova transação.",
            new: "Novo",
            all_caught_up: "Tudo em dia!",
            no_pending_bills_7_days: "Nenhuma conta pendente para os próximos 7 dias.",
        },
        en: {
            // General
            welcome: "Welcome back!",
            overview: "Overview",
            personal: "Personal",
            business: "Business",
            total: "Total",
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            back: "Back",
            optional: "Optional",
            select: "Select...",

            // Sidebar
            dashboard: "Dashboard",
            transactions: "Transactions",
            wallet: "My Wallet",
            calendar: "Calendar",
            reports: "Reports",
            planning: "Planning",
            income: "Income",
            settings: "Settings",
            new_transaction: "New Transaction",
            logout: "Logout (Lock)",
            user: "User",

            // Dashboard
            my_cards: "My Cards",
            view_all: "View all",
            cash_flow: "Cash Flow",
            last_6_months: "Last 6 months",
            total_balance: "Current Balance",
            income_month: "Income (This Month)",
            expense_month: "Expenses (This Month)",
            upcoming_bills: "Upcoming Bills",
            total_to_pay: "Total to pay",
            no_bills: "No bills for this week 🎉",
            my_goals: "My Goals",
            manage_goals: "Manage Goals",
            recent_transactions: "Recent Transactions",

            // Cards
            current_invoice: "Current Invoice",
            available_limit: "Available Limit",
            limit_usage: "Limit Usage",
            limit: "Limit",
            available: "Available",
            closes_day: "Closes on",
            due_day: "Due on",
            best_buy_day: "BEST BUY DAY",
            view_invoice: "View Invoice",
            card_holder: "Holder",
            bank: "Bank",
            wallet_subtitle: "Manage your cards and limits",
            new_card: "New Card",
            new_account: "New Account",
            new_document: "New Document",
            credit_cards: "Credit Cards",
            bank_accounts: "Bank Accounts",
            documents: "Documents",
            personal_context: "Personal",
            business_context: "Business",

            // Forms
            edit_transaction: "Edit Transaction",
            new_income: "New Income",
            received: "Received",
            paid: "Paid",
            to_receive: "To Receive",
            pending: "Pending",
            expense: "Expense",
            revenue: "Revenue",
            recurrence: "Recurrence",
            enable: "Enable",
            fixed_charge: "Fixed Charge",
            type_fixed_help: "Use this for Rent, Water bill, Electricity bill...",
            consumes_limit: "Consumes total credit card limit.",
            subscription: "Subscription",
            type_sub_help: "Use this for digital subscriptions with monthly charges...",
            no_consume_limit: "Does not consume future limit, only current month.",
            amount: "Amount",
            description: "Description",
            category: "Category",
            brand: "Brand / Company",
            select_brand: "Select a brand...",
            date: "Date",
            payment_method: "Payment Method",
            account: "Bank Account",
            select_account: "Select account...",
            card: "Card",
            installments: "Installments",
            save_changes: "Save Changes",
            save_transaction: "Save Transaction",

            // Goals
            of: "of",
            day: "Day",
            confirm_delete_card: "Are you sure you want to delete the card {cardName}?",
            card_deleted_success: "Card {cardName} deleted successfully!",
            edit_card: "Edit Card",
            delete_card: "Delete Card",
            dashboard_subtitle: "Overview of your finances",
            transactions_subtitle: "Complete history of transactions",
            search_placeholder: "Search transactions...",
            all: "All",
            all_categories: "All Categories",
            all_methods: "All Methods",
            no_transactions_found: "No transactions found",
            no_transactions_help: "Try adjusting filters or add a new transaction.",
            new: "New",
            all_caught_up: "All caught up!",
            no_pending_bills_7_days: "No pending bills for the next 7 days.",
        },
        es: {
            // General
            welcome: "¡Bienvenido de nuevo!",
            overview: "Visión General",
            personal: "Personal",
            business: "Empresarial",
            total: "Total",
            save: "Guardar",
            cancel: "Cancelar",
            edit: "Editar",
            delete: "Eliminar",
            back: "Volver",
            optional: "Opcional",
            select: "Seleccionar...",

            // Sidebar
            dashboard: "Panel",
            transactions: "Transacciones",
            wallet: "Mi Billetera",
            calendar: "Calendario",
            reports: "Reportes",
            planning: "Planificación",
            income: "Ingresos",
            settings: "Configuración",
            new_transaction: "Nueva Transacción",
            logout: "Salir (Bloquear)",
            user: "Usuario",

            // Dashboard
            my_cards: "Mis Tarjetas",
            view_all: "Ver todos",
            cash_flow: "Flujo de Caja",
            last_6_months: "Últimos 6 meses",
            total_balance: "Saldo Actual",
            income_month: "Ingresos (Este Mes)",
            expense_month: "Gastos (Este Mes)",
            upcoming_bills: "Cuentas de la Semana",
            total_to_pay: "Total a pagar",
            no_bills: "No hay cuentas para esta semana 🎉",
            my_goals: "Mis Objetivos",
            manage_goals: "Gestionar Objetivos",
            recent_transactions: "Transacciones Recientes",

            // Cards
            current_invoice: "Factura Actual",
            available_limit: "Límite Disponible",
            limit_usage: "Uso del Límite",
            limit: "Límite",
            available: "Disponible",
            closes_day: "Cierra el",
            due_day: "Vence el",
            best_buy_day: "MEJOR DÍA DE COMPRA",
            view_invoice: "Ver Factura",
            card_holder: "Titular",
            bank: "Banco",

            // Forms
            edit_transaction: "Editar Transacción",
            new_income: "Nuevo Ingreso",
            received: "Recibido",
            paid: "Pagado",
            to_receive: "Por Recibir",
            pending: "Pendiente",
            expense: "Gasto",
            revenue: "Ingreso",
            recurrence: "Recurrencia",
            enable: "Habilitar",
            fixed_charge: "Cargo Fijo",
            type_fixed_help: "Usa esto para Alquiler, Agua, Luz...",
            consumes_limit: "Consume el límite total de la tarjeta.",
            subscription: "Suscripción",
            type_sub_help: "Usa esto para suscripciones digitales...",
            no_consume_limit: "No consume límite futuro, solo el mes actual.",
            amount: "Monto",
            description: "Descripción",
            category: "Categoría",
            brand: "Marca / Empresa",
            select_brand: "Seleccionar marca...",
            date: "Fecha",
            payment_method: "Método de Pago",
            account: "Cuenta Bancaria",
            select_account: "Seleccionar cuenta...",
            card: "Tarjeta",
            installments: "Cuotas",
            save_changes: "Guardar Cambios",
            save_transaction: "Guardar Transacción",

            // Goals
            of: "de",
            day: "Día",
            confirm_delete_card: "¿Estás seguro de que deseas eliminar la tarjeta {cardName}?",
            card_deleted_success: "¡Tarjeta {cardName} eliminada con éxito!",
            edit_card: "Editar Tarjeta",
            delete_card: "Eliminar Tarjeta",
            dashboard_subtitle: "Visión general de sus finanzas",
            transactions_subtitle: "Historial completo de transacciones",
            search_placeholder: "Buscar transacciones...",
            all: "Todas",
            all_categories: "Todas las Categorías",
            all_methods: "Todos los Métodos",
            no_transactions_found: "No se encontraron transacciones",
            no_transactions_help: "Intente ajustar los filtros o agregue una nueva transacción.",
            new: "Nuevo",
            all_caught_up: "¡Todo al día!",
            no_pending_bills_7_days: "No hay facturas pendientes para los próximos 7 días.",
        },
        it: {
            // General
            welcome: "Bentornato!",
            overview: "Panoramica",
            personal: "Personale",
            business: "Aziendale",
            total: "Totale",
            save: "Salva",
            cancel: "Annulla",
            edit: "Modifica",
            delete: "Elimina",
            back: "Indietro",
            optional: "Opzionale",
            select: "Seleziona...",

            // Sidebar
            dashboard: "Dashboard",
            transactions: "Transazioni",
            wallet: "Il mio Portafoglio",
            calendar: "Calendario",
            reports: "Report",
            planning: "Pianificazione",
            income: "Reddito",
            settings: "Impostazioni",
            new_transaction: "Nuova Transazione",
            logout: "Esci (Blocca)",
            user: "Utente",

            // Dashboard
            my_cards: "Le mie Carte",
            view_all: "Vedi tutti",
            cash_flow: "Flusso di Cassa",
            last_6_months: "Ultimi 6 mesi",
            total_balance: "Saldo Attuale",
            income_month: "Entrate (Questo Mese)",
            expense_month: "Uscite (Questo Mese)",
            upcoming_bills: "Bollette della Settimana",
            total_to_pay: "Totale da pagare",
            no_bills: "Nessuna bolletta per questa settimana 🎉",
            my_goals: "I miei Obiettivi",
            manage_goals: "Gestisci Obiettivi",
            recent_transactions: "Transazioni Recenti",

            // Cards
            current_invoice: "Fattura Attuale",
            available_limit: "Limite Disponibile",
            limit_usage: "Uso del Limite",
            limit: "Limite",
            available: "Disponibile",
            closes_day: "Chiude il",
            due_day: "Scade il",
            best_buy_day: "MIGLIOR GIORNO D'ACQUISTO",
            view_invoice: "Vedi Fattura",
            card_holder: "Titolare",
            bank: "Banca",
            wallet_subtitle: "Gestisci le tue carte e i limiti",
            new_card: "Nuova Carta",
            new_account: "Nuovo Conto",
            new_document: "Nuovo Documento",
            credit_cards: "Carte di Credito",
            bank_accounts: "Conti Bancari",
            documents: "Documenti",
            personal_context: "Personale",
            business_context: "Aziendale",

            // Forms
            edit_transaction: "Modifica Transazione",
            new_income: "Nuova Entrata",
            received: "Ricevuto",
            paid: "Pagato",
            to_receive: "Da Ricevere",
            pending: "In Sospeso",
            expense: "Spesa",
            revenue: "Entrata",
            recurrence: "Ricorrenza",
            enable: "Abilita",
            fixed_charge: "Addebito Fisso",
            type_fixed_help: "Usa questo per Affitto, Acqua, Luce...",
            consumes_limit: "Consuma il limite totale della carta.",
            subscription: "Abbonamento",
            type_sub_help: "Usa questo per abbonamenti digitali...",
            no_consume_limit: "Non consuma limite futuro, solo mese corrente.",
            amount: "Importo",
            description: "Descrizione",
            category: "Categoria",
            brand: "Marca / Azienda",
            select_brand: "Seleziona marca...",
            date: "Data",
            payment_method: "Metodo di Pagamento",
            account: "Conto Bancario",
            select_account: "Seleziona conto...",
            card: "Carta",
            installments: "Rate",
            save_changes: "Salva Modifiche",
            save_transaction: "Salva Transazione",

            // Goals
            of: "di",
            day: "Giorno",
            confirm_delete_card: "Sei sicuro di voler eliminare la carta {cardName}?",
            card_deleted_success: "Carta {cardName} eliminata con successo!",
            edit_card: "Modifica Carta",
            delete_card: "Elimina Carta",
            dashboard_subtitle: "Panoramica delle tue finanze",
            transactions_subtitle: "Cronologia completa delle transazioni",
            search_placeholder: "Cerca transazioni...",
            all: "Tutte",
            all_categories: "Tutte le Categorie",
            all_methods: "Tutti i Metodi",
            no_transactions_found: "Nessuna transazione trovata",
            no_transactions_help: "Prova a modificare i filtri o aggiungi una nuova transazione.",
            new: "Nuovo",
            all_caught_up: "Tutto aggiornato!",
            no_pending_bills_7_days: "Nessuna bolletta in sospeso per i prossimi 7 giorni.",
        },
    };

    const t = (key: string, params?: Record<string, string | number>) => {
        let translation = translations[language][key] || key;
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                translation = translation.replace(`{${key}}`, String(value));
            });
        }
        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, locale: locales[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
