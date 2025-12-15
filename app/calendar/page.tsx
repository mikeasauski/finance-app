"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, Calendar as CalendarIcon, CreditCard as CreditCardIcon } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { cn } from "@/lib/utils";
import { Transaction, CreditCard } from "@/types";
import { getBrandById } from "@/lib/brands";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CalendarPage() {
    const { transactions, cards } = useFinance();
    const { t, locale } = useLanguage();
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

    // Generate week days dynamically based on locale
    const weekDays = eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 0 }),
        end: endOfWeek(new Date(), { weekStartsOn: 0 })
    }).map(day => format(day, 'EEE', { locale }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('calendar_title')}</h1>
                    <p className="text-gray-500">{t('calendar_subtitle')}</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-800 min-w-[140px] text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="aspect-square bg-gray-50/50 rounded-xl" />
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
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 z-10"
                                            : "border-transparent hover:bg-gray-50",
                                        isToday && !isSelected && "bg-blue-50/50 font-semibold text-blue-600"
                                    )}
                                >
                                    <span className={cn("text-sm", isSelected && "font-bold text-blue-700")}>
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
                                                    {t('invoice')}
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-600" />
                        {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale }) : t('select_date')}
                    </h3>

                    <div className="space-y-6">
                        {/* Invoices Section */}
                        {selectedDateInvoices.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('todays_invoices')}</h4>
                                {selectedDateInvoices.map(({ card, amount }) => (
                                    <div key={card.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: card.color }}>
                                            <CreditCardIcon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{card.name}</p>
                                            <p className="text-xs text-purple-600 font-medium">{t('due_today')}</p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Transactions Section */}
                        {selectedDateTransactions.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('entries')}</h4>
                                {selectedDateTransactions.map(transaction => {
                                    const brand = transaction.brandId ? getBrandById(transaction.brandId) : null;

                                    return (
                                        <div key={transaction.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                                transaction.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                            )}>
                                                {brand?.logoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    transaction.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                                                <p className="text-xs text-gray-500">{transaction.category}</p>
                                            </div>
                                            <div className={cn(
                                                "font-semibold whitespace-nowrap",
                                                transaction.type === 'income' ? "text-green-600" : "text-gray-900"
                                            )}>
                                                {transaction.type === 'expense' && '- '}
                                                {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(transaction.amount)}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">{t('inflows')}</span>
                                        <span className="text-green-600 font-medium">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(
                                                selectedDateTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">{t('outflows')}</span>
                                        <span className="text-red-600 font-medium">
                                            {new Intl.NumberFormat(locale.code === 'pt-BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: locale.code === 'pt-BR' ? 'BRL' : 'USD' }).format(
                                                selectedDateTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            selectedDateInvoices.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    <p>{t('no_entries_day')}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
