"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, EyeOff, Copy, Edit2, Paperclip, ExternalLink } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Document } from '@/types';
import DocumentViewer from './DocumentViewer';
interface DocumentListProps {
    onEdit?: (document: Document) => void;
    documents: Document[];
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

export default function DocumentList({ onEdit, documents, setDocuments }: DocumentListProps) {
    const { showToast } = useToast();
    const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
    const toggleShowNumber = (id: string) => {
        setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("success", "Copiado para a área de transferência!");
    };

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este documento?")) {
            setDocuments(prev => prev.filter(d => d.id !== id));
            showToast("success", "Documento excluído com sucesso!");
        }
    };

    return (
        <div className="space-y-4">
            {documents.map(doc => (
                <div key={doc.id} className="bg-card p-4 rounded-xl border border-border group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">{doc.title}</h4>
                                <p className="text-xs text-muted-foreground">{doc.category || 'Documento'}</p>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit && onEdit(doc)}
                                className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="pl-2 mt-4 flex items-center justify-between bg-muted p-2 rounded-lg">
                        <code className="text-sm font-mono text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {showNumbers[doc.id] ? doc.number : '•'.repeat(Math.min(doc.number.length, 12))}
                        </code>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleShowNumber(doc.id)}
                                className="text-muted-foreground hover:text-foreground"
                                title={showNumbers[doc.id] ? "Ocultar" : "Mostrar"}
                            >
                                {showNumbers[doc.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                                onClick={() => copyToClipboard(doc.number)}
                                className="text-muted-foreground hover:text-blue-600"
                                title="Copiar"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

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
                </div>
            ))}

            {viewingDocument && (
                <DocumentViewer
                    document={viewingDocument}
                    onClose={() => setViewingDocument(null)}
                />
            )}
        </div>
    );
}
