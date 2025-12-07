"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, EyeOff, Copy, Edit2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export interface Document {
    id: string;
    type: 'RG' | 'CPF' | 'CNH' | 'CNPJ' | 'OTHER';
    title: string;
    number: string;
    color: string;
}

interface DocumentListProps {
    onEdit?: (document: Document) => void;
    documents: Document[];
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function DocumentList({ onEdit, documents, setDocuments }: DocumentListProps) {
    const { showToast } = useToast();
    const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const storedDocs = localStorage.getItem('finance_documents');
        if (storedDocs) {
            try {
                setDocuments(JSON.parse(storedDocs));
            } catch (e) {
                console.error("Failed to parse documents", e);
            }
        }
    }, [setDocuments]);

    useEffect(() => {
        localStorage.setItem('finance_documents', JSON.stringify(documents));
    }, [documents]);

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja remover este documento?')) {
            setDocuments(prev => prev.filter(d => d.id !== id));
            showToast('success', 'Documento removido.');
        }
    };

    const toggleShowNumber = (id: string) => {
        setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('success', 'Copiado!');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${doc.color}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" />
                                <span className="font-semibold text-gray-700">{doc.title}</span>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{doc.type}</span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit && onEdit(doc)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="pl-2 mt-4 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <code className="text-sm font-mono text-gray-800">
                                {showNumbers[doc.id] ? doc.number : '•'.repeat(doc.number.length)}
                            </code>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleShowNumber(doc.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title={showNumbers[doc.id] ? "Ocultar" : "Mostrar"}
                                >
                                    {showNumbers[doc.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(doc.number)}
                                    className="text-gray-400 hover:text-blue-600"
                                    title="Copiar"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {documents.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p>Nenhum documento cadastrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
