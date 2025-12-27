"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO, startOfWeek, endOfWeek } from "date-fns"; import { ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon, CreditCard as CreditCardIcon, Wallet } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { Transaction, CreditCard } from "@/types";
import { getBrandById } from "@/lib/brands";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CalendarPage() {
    const { transactions, cards, appContext } = useFinance();
    const { t, locale } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [filterMode, setFilterMode] = useState<'cash_flow' | 'future_expenses' | 'card_charges'>('cash_flow');

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    // Generate days for the calendar grid
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    // Calculate padding days for the start of the month
    const startDayOfWeek = getDay(firstDayOfMonth); // 0 = Sunday, 1 = Monday, etc.
    const paddingDays = Array(startDayOfWeek).fill(null);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getTransactionsForDate = (date: Date) => {
        return transactions.filter(t => {
            const isDateMatch = isSameDay(new Date(t.date), date);
            if (!isDateMatch) return false;

            if (filterMode === 'card_charges') {
                return t.paymentMethod === 'credit';
            }

            // For Cash Flow and Future Expenses, HIDE credit card purchases (they appear as invoices)
            if (filterMode === 'cash_flow' || filterMode === 'future_expenses') {
                return t.paymentMethod !== 'credit';
            }

            return true;
        });
    };

    // Helper to calculate invoice total for a specific card and due date
    const getInvoiceTotal = (card: CreditCard, dueDate: Date) => {
        const closingDay = Number(card.closingDay);
        const dueDay = Number(card.dueDay);
        const currentMonth = dueDate.getMonth();
        const currentYear = dueDate.getFullYear();

        let start: Date;
        let end: Date;

        if (closingDay < dueDay) {
            // Closes in same month
            start = new Date(currentYear, currentMonth - 1, closingDay);
            end = new Date(currentYear, currentMonth, closingDay - 1, 23, 59, 59);
        } else {
            // Closes in previous month
            start = new Date(currentYear, currentMonth - 2, closingDay);
            end = new Date(currentYear, currentMonth - 1, closingDay - 1, 23, 59, 59);
        }

        const total = transactions
            .filter(t => {
                if (t.cardId !== card.id || t.type !== 'expense') return false;
                const tDate = parseISO(t.date);
                return tDate >= start && tDate <= end;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);

        return total;
    };

    // Get invoices due on a specific date
    const getInvoicesForDate = (date: Date) => {
        // In 'card_charges' mode, we don't show invoices, we show individual charges
        if (filterMode === 'card_charges') return [];

        return cards.filter(card => {
            return date.getDate() === Number(card.dueDay);
        }).map(card => ({
            card,
            amount: getInvoiceTotal(card, date)
        })).filter(invoice => invoice.amount > 0);
    };

    const selectedDateTransactions = selectedDate ? getTransactionsForDate(selectedDate) : [];
    const selectedDateInvoices = selectedDate ? getInvoicesForDate(selectedDate) : [];

    // Calculate daily totals for the month
    const getDailyTotal = (date: Date) => {
        const txs = getTransactionsForDate(date);
        const invoices = getInvoicesForDate(date);

        // Calculate transaction totals
        let income = txs.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        let expense = txs.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

        // Add invoice totals to expense
        const invoiceTotal = invoices.reduce((acc, inv) => acc + inv.amount, 0);
        expense += invoiceTotal;

        // Filter logic for totals
        if (filterMode === 'future_expenses') {
            income = 0; // Hide income in Future Expenses
        }

        return { income, expense, balance: income - expense };
    };

    // Generate week days dynamically based on locale
    const weekDays = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 0 }),
        end: endOfWeek(new Date(), { weekStartsOn: 0 })
    }).map(day => format(day, 'EEE', { locale }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{t('calendar')}</h2>
                        <p className="text-muted-foreground">{t('calendar_subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-card p-1 rounded-xl border border-border shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-semibold min-w-[140px] text-center capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter Menu */}
                <div className="flex p-1 bg-muted/50 rounded-xl w-fit">
                    <button
                        onClick={() => setFilterMode('cash_flow')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            filterMode === 'cash_flow'
                                ? (appContext === 'PF' ? "bg-orange-500 text-white shadow-md" : "bg-blue-600 text-white shadow-md")
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Fluxo de Caixa
                    </button>
                    <button
                        onClick={() => setFilterMode('future_expenses')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            filterMode === 'future_expenses'
                                ? (appContext === 'PF' ? "bg-orange-500 text-white shadow-md" : "bg-blue-600 text-white shadow-md")
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Despesas Futuras
                    </button>
                    <button
                        onClick={() => setFilterMode('card_charges')}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            filterMode === 'card_charges'
                                ? (appContext === 'PF' ? "bg-orange-500 text-white shadow-md" : "bg-blue-600 text-white shadow-md")
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mensalidades no Cartão
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase">                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="aspect-square bg-muted/30 rounded-xl" />))}

                        {daysInMonth.map(date => {
                            const isSelected = selectedDate && isSameDay(date, selectedDate);
                            const isToday = isSameDay(date, new Date());
                            const { income, expense } = getDailyTotal(date);
                            const invoices = getInvoicesForDate(date);
                            const hasTransactions = income > 0 || expense > 0;
                            const hasInvoices = invoices.length > 0;

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "aspect-square relative rounded-xl border transition-all flex flex-col items-center justify-start pt-2 gap-1 overflow-hidden",
                                        isSelected
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 z-10"
                                            : "border-transparent hover:bg-muted",
                                        isToday && !isSelected && "bg-primary/5 font-semibold text-primary"
                                    )}
                                >
                                    <span className={cn("text-sm text-foreground", isSelected && "font-bold text-primary")}>                                        {format(date, 'd')}
                                    </span>

                                    <div className="flex flex-col gap-0.5 w-full px-1 items-center">
                                        {hasTransactions && (
                                            <div className="flex gap-1">
                                                {income > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                                                {expense > 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                            </div>
                                        )}

                                        {hasInvoices && (
                                            <div className="w-full flex justify-center mt-0.5">
                                                <div className="bg-purple-100 text-purple-700 text-[9px] px-1 rounded-sm w-full truncate text-center font-medium">
                                                    {t('invoice')}                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-fit">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-primary" />
                        {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale }) : t('select_date')}                    </h3>

                    <div className="space-y-6">
                        {/* Invoices Section */}
                        {selectedDateInvoices.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('todays_invoices')}</h4>
                                {selectedDateInvoices.map(({ card, amount }) => (
                                    <div key={card.id} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: card.color }}>
                                        <CreditCardIcon size={20} />
                                    </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">{card.name}</p>
                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{t('due_today')}</p>
                                        </div>
                                        <div className="font-bold text-foreground">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(amount)}                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Transactions Section */}
                        {selectedDateTransactions.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('entries')}</h4>                                {selectedDateTransactions.map(transaction => {
                                    const brand = transaction.brandId ? getBrandById(transaction.brandId) : null;

                                    return (
                                        <div key={transaction.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                transaction.type === 'income' ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400")}>
                                                {brand?.logoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    // Icon Logic:
                                                    // If Card Charges mode -> CreditCard Icon
                                                    // If Cash Flow/Future -> Wallet Icon (since these are actual money movements)
                                                    filterMode === 'card_charges' ? <CreditCardIcon size={20} /> :
                                                        transaction.type === 'income' ? <ArrowUpRight size={20} /> : <Wallet size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">{transaction.description}</p>
                                                <p className="text-xs text-muted-foreground">{transaction.category}</p>
                                            </div>
                                            <div className={cn(
                                                "font-semibold whitespace-nowrap",
                                                transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-foreground"
                                            )}>
                                                {transaction.type === 'expense' && '- '}
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(transaction.amount)}                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-4 border-t border-border mt-4">
                                    {filterMode !== 'future_expenses' && (
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">{t('inflows')}</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(selectedDateTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">{t('outflows')}</span>
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(selectedDateTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            selectedDateInvoices.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>{t('no_entries_day')}</p>                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
