import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Example {
    title: string;
    scenario: string;
    result: string;
    isPositive?: boolean;
}

interface FAQ {
    question: string;
    answer: string;
}

interface CalculatorLayoutProps {
    title: string;
    icon: React.ElementType;
    description: string;
    examples: Example[];
    faq: FAQ[];
    children: React.ReactNode;
}

export default function CalculatorLayout({
    title,
    icon: Icon,
    description,
    examples,
    faq,
    children
}: CalculatorLayoutProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Back Button */}
            <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Voltar para Ferramentas
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Icon size={32} />
                </div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>

            {/* The Tool (Simulator) */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
                {children}
            </div>

            {/* Educational Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Understanding the Calculation */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Lightbulb size={20} />
                        <h2>Entenda o Cálculo</h2>
                    </div>
                    <div className="bg-muted/50 p-6 rounded-xl text-muted-foreground leading-relaxed">
                        {description}
                    </div>
                </section>

                {/* Practical Examples */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <HelpCircle size={20} />
                        <h2>Exemplos na Prática</h2>
                    </div>
                    <div className="space-y-3">
                        {examples.map((ex, i) => (
                            <div key={i} className="bg-card border border-border p-4 rounded-xl shadow-sm">
                                <h3 className="font-bold text-foreground mb-1">{ex.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{ex.scenario}</p>
                                <div className={cn(
                                    "text-sm font-semibold px-2 py-1 rounded-md inline-block",
                                    ex.isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                )}>
                                    {ex.result}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* FAQ Accordion */}
            <section className="pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Dúvidas Frequentes</h2>
                <div className="space-y-2">
                    {faq.map((item, i) => (
                        <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                className="w-full flex justify-between items-center p-4 text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-medium text-foreground">{item.question}</span>
                                {openFaqIndex === i ? (
                                    <ChevronUp size={20} className="text-muted-foreground" />
                                ) : (
                                    <ChevronDown size={20} className="text-muted-foreground" />
                                )}
                            </button>
                            {openFaqIndex === i && (
                                <div className="p-4 pt-0 text-muted-foreground bg-muted/30 border-t border-border/50">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
