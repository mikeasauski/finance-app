"use client";

import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FileText, Trash2, Eye, EyeOff, Copy, Edit2, Paperclip, ExternalLink } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Document } from '@/types';
import DocumentViewer from './DocumentViewer';
=======
import { FileText, Trash2, Eye, EyeOff, Copy, Edit2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export interface Document {
    id: string;
    type: 'RG' | 'CPF' | 'CNH' | 'CNPJ' | 'OTHER';
    title: string;
    number: string;
    color: string;
}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

interface DocumentListProps {
    onEdit?: (document: Document) => void;
    documents: Document[];
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function DocumentList({ onEdit, documents, setDocuments }: DocumentListProps) {
    const { showToast } = useToast();
    const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
<<<<<<< HEAD
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

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
<<<<<<< HEAD
                    <div key={doc.id} className="bg-card p-4 rounded-xl border border-border shadow-sm relative group overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`absolute top-0 left-0 w-1 h-full ${doc.color}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${doc.color} bg-opacity-10`}>
                                    <FileText size={18} className="text-foreground" />
                                </div>
                                <div>
                                    <span className="font-semibold text-foreground block leading-tight">{doc.title}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{doc.type}</span>
                                        {doc.fileUrl && (
                                            <span className="text-xs flex items-center gap-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                                                <Paperclip size={10} />
                                                Anexo
                                            </span>
                                        )}
                                    </div>
                                </div>
=======
                    <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${doc.color}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" />
                                <span className="font-semibold text-gray-700">{doc.title}</span>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{doc.type}</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit && onEdit(doc)}
<<<<<<< HEAD
                                    className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Editar"
=======
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
<<<<<<< HEAD
                                    className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Excluir"
=======
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

<<<<<<< HEAD
                        <div className="pl-2 mt-4 flex items-center justify-between bg-muted p-2 rounded-lg">
                            <code className="text-sm font-mono text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                                {showNumbers[doc.id] ? doc.number : '•'.repeat(Math.min(doc.number.length, 12))}
=======
                        <div className="pl-2 mt-4 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <code className="text-sm font-mono text-gray-800">
                                {showNumbers[doc.id] ? doc.number : '•'.repeat(doc.number.length)}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            </code>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleShowNumber(doc.id)}
<<<<<<< HEAD
                                    className="text-muted-foreground hover:text-foreground"
=======
                                    className="text-gray-400 hover:text-gray-600"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                    title={showNumbers[doc.id] ? "Ocultar" : "Mostrar"}
                                >
                                    {showNumbers[doc.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(doc.number)}
<<<<<<< HEAD
                                    className="text-muted-foreground hover:text-blue-600"
=======
                                    className="text-gray-400 hover:text-blue-600"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                                    title="Copiar"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
<<<<<<< HEAD

                        {/* Footer Actions */}
                        <div className="pl-2 mt-3 flex items-center justify-end gap-2">
                            {doc.fileUrl && (
                                <button
                                    onClick={() => setViewingDocument(doc)}
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                    <ExternalLink size={12} />
                                    Ver Documento
                                </button>
                            )}
                        </div>
=======
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                    </div>
                ))}

                {documents.length === 0 && (
<<<<<<< HEAD
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <FileText size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">Sua carteira está vazia</p>
                        <p className="text-sm opacity-70 mt-1">Adicione seus documentos para tê-los sempre à mão</p>
                    </div>
                )}
            </div>

            {viewingDocument && (
                <DocumentViewer
                    document={viewingDocument}
                    onClose={() => setViewingDocument(null)}
                />
            )}
=======
                    <div className="col-span-full text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p>Nenhum documento cadastrado</p>
                    </div>
                )}
            </div>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
        </div>
    );
}
