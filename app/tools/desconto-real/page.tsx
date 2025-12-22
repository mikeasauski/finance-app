"use client";

import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import CalculatorLayout from '@/components/tools/CalculatorLayout';
import { cn } from '@/lib/utils';

export default function DescontoRealPage() {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [mode, setMode] = useState<'PRICE' | 'PERCENT'>('PRICE'); // Calculate by final price or percentage
    const [result, setResult] = useState<{ saved: number; percent: number; final: number } | null>(null);

    const handleCalculate = () => {
        const original = parseFloat(originalPrice.replace(',', '.'));

        if (!original) return;

        let final = 0;
        let saved = 0;
        let percent = 0;

        if (mode === 'PRICE') {
            const discounted = parseFloat(discountedPrice.replace(',', '.'));
            if (!discounted) return;

            final = discounted;
            saved = original - final;
            percent = (saved / original) * 100;
        } else {
            const pct = parseFloat(discountPercent.replace(',', '.'));
            if (!pct) return;

            percent = pct;
            saved = original * (pct / 100);
            final = original - saved;
        }

        setResult({ saved, percent, final });
    };

    return (
        <CalculatorLayout
            title="Calculadora de Desconto Real"
            icon={Percent}
            description="Muitas promoções aumentam o preço antes de dar o desconto (a famosa 'metade do dobro'). Esta ferramenta ajuda você a calcular o valor real economizado e a porcentagem efetiva de desconto para decidir se a oferta vale a pena."
            examples={[
                {
                    title: "Cenário A (Desconto em Reais)",
                    scenario: "Produto de R$ 200,00 por R$ 150,00",
                    result: "Economia: R$ 50,00 (25% OFF)",
                    isPositive: true
                },
                {
                    title: "Cenário B (Desconto em %)",
                    scenario: "Produto de R$ 1.000,00 com 15% OFF",
                    result: "Paga: R$ 850,00 (Economiza R$ 150)",
                    isPositive: true
                }
            ]}
            faq={[
                {
                    question: "Como saber se o desconto é real?",
                    answer: "Monitore o preço do produto por algumas semanas antes da promoção. Use sites comparadores de preço."
                },
                {
                    question: "Desconto à vista vale a pena?",
                    answer: "Geralmente sim. Se o desconto for maior que 1% ao mês (rendimento médio da poupança/CDB), compensa pagar à vista."
                },
                {
                    question: "O que é 'metade do dobro'?",
                    answer: "É quando a loja aumenta o preço dias antes da promoção para depois dar um desconto falso, voltando ao preço original."
                }
            ]}
        >
            <div className="space-y-6">
                {/* Mode Toggle */}
                <div className="flex p-1 bg-muted rounded-xl w-full">
                    <button
                        onClick={() => { setMode('PRICE'); setResult(null); }}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'PRICE' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Tenho o Valor Final
                    </button>
                    <button
                        onClick={() => { setMode('PERCENT'); setResult(null); }}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'PERCENT' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Tenho a % de Desconto
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Valor Original (R$)</label>
                        <input
                            type="number"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            placeholder="Ex: 200.00"
                            className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {mode === 'PRICE' ? (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Valor com Desconto (R$)</label>
                            <input
                                type="number"
                                value={discountedPrice}
                                onChange={(e) => setDiscountedPrice(e.target.value)}
                                placeholder="Ex: 150.00"
                                className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Porcentagem de Desconto (%)</label>
                            <input
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                placeholder="Ex: 25"
                                className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-primary/20"
                >
                    Calcular Economia
                </button>

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Você Economiza</p>
                            <p className="text-xl font-bold text-green-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.saved)}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Desconto Real</p>
                            <p className="text-xl font-bold text-blue-600">
                                {result.percent.toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-4 bg-muted border border-border rounded-xl text-center">
                            <p className="text-xs text-muted-foreground mb-1">Valor Final</p>
                            <p className="text-xl font-bold text-foreground">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.final)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorLayout>
    );
}
