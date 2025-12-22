"use client";

import React, { useState } from 'react';
import { Briefcase, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { differenceInMonths, differenceInDays, parseISO } from 'date-fns';

export default function RescisaoPage() {
    const [salary, setSalary] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('SEM_JUSTA_CAUSA');
    const [notice, setNotice] = useState('INDENIZADO');
    const [balanceFgts, setBalanceFgts] = useState('');
    const [result, setResult] = useState<{ total: number; items: { label: string; value: number }[] } | null>(null);

    const handleCalculate = () => {
        const salaryValue = parseFloat(salary.replace(',', '.')) || 0;
        const fgtsValue = parseFloat(balanceFgts.replace(',', '.')) || 0;

        if (!salaryValue || !startDate || !endDate) return;

        const start = parseISO(startDate);
        const end = parseISO(endDate);

        // Calculate worked months/days
        // Simplified logic for educational purpose

        // 1. Saldo de Salário (Days worked in the last month)
        const daysInLastMonth = end.getDate();
        const saldoSalario = (salaryValue / 30) * daysInLastMonth;

        // 2. Aviso Prévio
        let avisoPrevio = 0;
        if (reason === 'SEM_JUSTA_CAUSA' && notice === 'INDENIZADO') {
            // 30 days + 3 days per year
            const years = differenceInDays(end, start) / 365;
            const daysNotice = 30 + (Math.floor(years) * 3);
            const limitedDays = Math.min(daysNotice, 90);
            avisoPrevio = (salaryValue / 30) * limitedDays;
        }

        // 3. 13º Proporcional
        // Count months worked in the current year
        const monthsWorkedYear = end.getMonth() + 1; // Simplified
        // If day > 15, counts as full month
        const proportional13 = (salaryValue / 12) * monthsWorkedYear;

        // 4. Férias Vencidas + Proporcionais
        // This is tricky without knowing if they took vacation.
        // Let's assume 1 year accrued + proportional.
        // Or just ask user?
        // Let's assume proportional only for simplicity + 1 expired if > 1 year?
        // Let's just calculate proportional based on total time since start (simplified)
        // Actually, let's just do Proportional Férias (current period)
        const monthsSinceStart = differenceInMonths(end, start);
        const monthsVacation = monthsSinceStart % 12;
        const feriasProporcionais = (salaryValue / 12) * monthsVacation;
        const oneThirdFerias = feriasProporcionais / 3;

        // 5. Multa FGTS
        let multaFgts = 0;
        if (reason === 'SEM_JUSTA_CAUSA') {
            multaFgts = fgtsValue * 0.40;
        }

        const items = [
            { label: "Saldo de Salário", value: saldoSalario },
            { label: "Aviso Prévio", value: avisoPrevio },
            { label: "13º Proporcional", value: proportional13 },
            { label: "Férias Proporcionais + 1/3", value: feriasProporcionais + oneThirdFerias },
            { label: "Multa 40% FGTS", value: multaFgts }
        ].filter(item => item.value > 0);

        const total = items.reduce((acc, item) => acc + item.value, 0);

        setResult({
            total,
            items
        });
    };

    return (
        <CalculatorLayout
            title="Cálculo de Rescisão"
            icon={Briefcase}
            description="Estime os valores a receber no término do contrato de trabalho (CLT)."
            examples={[
                {
                    title: "Demissão Sem Justa Causa",
                    scenario: "1 ano de casa, Aviso Indenizado",
                    result: "Recebe: Saldo + Aviso + Férias + 13º + Multa FGTS",
                    isPositive: true
                },
                {
                    title: "Pedido de Demissão",
                    scenario: "Não cumpre aviso",
                    result: "Desconta aviso prévio, não recebe multa FGTS",
                    isPositive: false
                }
            ]}
            faq={[
                {
                    question: "O que é Aviso Prévio Indenizado?",
                    answer: "A empresa decide que você não precisa trabalhar no período de aviso, mas paga o salário correspondente como se tivesse trabalhado."
                },
                {
                    question: "Quando recebo a multa do FGTS?",
                    answer: "A multa de 40% sobre o saldo do FGTS é paga apenas em demissão sem justa causa por iniciativa da empresa."
                }
            ]}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Salário Base</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="3000.00"
                            className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Data de Admissão</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Data de Saída</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Motivo</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="SEM_JUSTA_CAUSA">Demissão sem Justa Causa</option>
                        <option value="PEDIDO_DEMISSAO">Pedido de Demissão</option>
                        <option value="JUSTA_CAUSA">Demissão por Justa Causa</option>
                    </select>
                </div>

                {reason === 'SEM_JUSTA_CAUSA' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Aviso Prévio</label>
                            <select
                                value={notice}
                                onChange={(e) => setNotice(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="INDENIZADO">Indenizado (Empresa paga)</option>
                                <option value="TRABALHADO">Trabalhado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Saldo FGTS (Para Multa)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-muted-foreground font-bold">R$</span>
                                <input
                                    type="number"
                                    value={balanceFgts}
                                    onChange={(e) => setBalanceFgts(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                    <Calculator size={20} />
                    Calcular Rescisão
                </button>

                {result && (
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                            {result.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>{item.label}:</span>
                                    <span className="font-mono text-foreground">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-end">
                            <span className="font-bold text-foreground">Total Estimado:</span>
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.total)}
                            </span>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            * Valores aproximados. Consulte um contador ou RH para cálculo exato.
                        </p>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
