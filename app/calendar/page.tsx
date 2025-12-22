"use client";

import { useState } from "react";
<<<<<<< HEAD
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
=======
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
import { ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon, CreditCard as CreditCardIcon } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { Transaction, CreditCard } from "@/types";
import { getBrandById } from "@/lib/brands";
<<<<<<< HEAD
import { useLanguage } from "@/contexts/LanguageContext";

export default function CalendarPage() {
    const { transactions, cards } = useFinance();
    const { t, locale } = useLanguage();
=======

export default function CalendarPage() {
    const { transactions, cards } = useFinance();
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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
        return transactions.filter(t => isSameDay(new Date(t.date), date));
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
        return cards.filter(card => {
            // Check if this date is the due date for this card
            // We need to handle month overflow if due day > days in month?
            // For simplicity, just check day match.
            return date.getDate() === Number(card.dueDay);
        }).map(card => ({
            card,
            amount: getInvoiceTotal(card, date)
        })).filter(invoice => invoice.amount > 0); // Only show if there's an amount
    };

    const selectedDateTransactions = selectedDate ? getTransactionsForDate(selectedDate) : [];
    const selectedDateInvoices = selectedDate ? getInvoicesForDate(selectedDate) : [];

    // Calculate daily totals for the month (excluding invoices to avoid double counting visually if we wanted, but here we just sum transactions)
    const getDailyTotal = (date: Date) => {
        const txs = getTransactionsForDate(date);
        const income = txs.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
        const expense = txs.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
        return { income, expense, balance: income - expense };
    };

<<<<<<< HEAD
    // Generate week days dynamically based on locale
    const weekDays = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 0 }),
        end: endOfWeek(new Date(), { weekStartsOn: 0 })
    }).map(day => format(day, 'EEE', { locale }));

=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
<<<<<<< HEAD
                    <h1 className="text-2xl font-bold text-foreground">{t('calendar_title')}</h1>
                    <p className="text-muted-foreground">{t('calendar_subtitle')}</p>
                </div>

                <div className="flex items-center gap-4 bg-card p-1 rounded-xl border border-border shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-foreground min-w-[140px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
=======
                    <h1 className="text-2xl font-bold text-gray-800">Calendário</h1>
                    <p className="text-gray-500">Visualize seus vencimentos e receitas</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-800 min-w-[140px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
<<<<<<< HEAD
                <div className="lg:col-span-2 bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase">
=======
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
<<<<<<< HEAD
                            <div key={`padding-${i}`} className="aspect-square bg-muted/30 rounded-xl" />
=======
                            <div key={`padding-${i}`} className="aspect-square bg-gray-50/50 rounded-xl" />
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                        ))}

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
<<<<<<< HEAD
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 z-10"
                                            : "border-transparent hover:bg-muted",
                                        isToday && !isSelected && "bg-primary/5 font-semibold text-primary"
                                    )}
                                >
                                    <span className={cn("text-sm text-foreground", isSelected && "font-bold text-primary")}>
=======
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 z-10"
                                            : "border-transparent hover:bg-gray-50",
                                        isToday && !isSelected && "bg-blue-50/50 font-semibold text-blue-600"
                                    )}
                                >
                                    <span className={cn("text-sm", isSelected && "font-bold text-blue-700")}>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        {format(date, 'd')}
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
<<<<<<< HEAD
                                                    {t('invoice')}
=======
                                                    Fatura
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Details Panel */}
<<<<<<< HEAD
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-fit">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-primary" />
                        {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale }) : t('select_date')}
=======
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-600" />
                        {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    </h3>

                    <div className="space-y-6">
                        {/* Invoices Section */}
                        {selectedDateInvoices.length > 0 && (
                            <div className="space-y-3">
<<<<<<< HEAD
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('todays_invoices')}</h4>
                                {selectedDateInvoices.map(({ card, amount }) => (
                                    <div key={card.id} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
=======
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Faturas do Dia</h4>
                                {selectedDateInvoices.map(({ card, amount }) => (
                                    <div key={card.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: card.color }}>
                                            <CreditCardIcon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
<<<<<<< HEAD
                                            <p className="font-medium text-foreground truncate">{card.name}</p>
                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">{t('due_today')}</p>
                                        </div>
                                        <div className="font-bold text-foreground">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(amount)}
=======
                                            <p className="font-medium text-gray-900 truncate">{card.name}</p>
                                            <p className="text-xs text-purple-600 font-medium">Vencimento Hoje</p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Transactions Section */}
                        {selectedDateTransactions.length > 0 ? (
                            <div className="space-y-3">
<<<<<<< HEAD
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('entries')}</h4>
=======
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lançamentos</h4>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                {selectedDateTransactions.map(transaction => {
                                    const brand = transaction.brandId ? getBrandById(transaction.brandId) : null;

                                    return (
<<<<<<< HEAD
                                        <div key={transaction.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                transaction.type === 'income' ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
=======
                                        <div key={transaction.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                transaction.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            )}>
                                                {brand?.logoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
<<<<<<< HEAD
                                                <p className="font-medium text-foreground truncate">{transaction.description}</p>
                                                <p className="text-xs text-muted-foreground">{transaction.category}</p>
                                            </div>
                                            <div className={cn(
                                                "font-semibold whitespace-nowrap",
                                                transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-foreground"
                                            )}>
                                                {transaction.type === 'expense' && '- '}
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(transaction.amount)}
=======
                                                <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">{transaction.category}</p>
                                            </div>
                                            <div className={cn(
                                                "font-semibold whitespace-nowrap",
                                                transaction.type === 'income' ? "text-green-600" : "text-gray-900"
                                            )}>
                                                {transaction.type === 'expense' && '- '}
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                            </div>
                                        </div>
                                    );
                                })}

<<<<<<< HEAD
                                <div className="pt-4 border-t border-border mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">{t('inflows')}</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(
=======
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Entradas</span>
                                        <span className="text-green-600 font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                selectedDateTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
<<<<<<< HEAD
                                        <span className="text-muted-foreground">{t('outflows')}</span>
                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(
=======
                                        <span className="text-gray-500">Saídas</span>
                                        <span className="text-red-600 font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                                selectedDateTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            selectedDateInvoices.length === 0 && (
<<<<<<< HEAD
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>{t('no_entries_day')}</p>
=======
                                <div className="text-center py-12 text-gray-400">
                                    <p>Nenhum lançamento ou fatura para este dia.</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
